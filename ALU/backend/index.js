import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 5000);
const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'alu',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
  queueLimit: 0,
});

const runQuery = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};

const normalizeString = (value) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
};

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const generateDigitalId = (company) => {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = (company || 'ALU')
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');
  const randomSequence = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  return `ALU-${prefix}-${year}-${randomSequence}`;
};

const mapUserRow = (row) => {
  if (!row) return null;
  const emergencyContact = row.emergencyContactName
    ? {
        name: row.emergencyContactName,
        relationship: row.emergencyContactRelationship,
        phone: row.emergencyContactPhone,
        address: row.emergencyContactAddress,
      }
    : null;

  return {
    id: row.id,
    firstName: row.firstName,
    middleInitial: row.middleInitial,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    dateOfBirth: row.dateOfBirth,
    placeOfBirth: row.placeOfBirth,
    maritalStatus: row.maritalStatus,
    numberOfChildren: row.numberOfChildren,
    gender: row.gender,
    religion: row.religion,
    education: row.education,
    company: row.company,
    position: row.position,
    department: row.department,
    yearsEmployed: row.yearsEmployed,
    unionAffiliation: row.unionAffiliation,
    unionPosition: row.unionPosition,
    membershipDate: row.membershipDate,
    digitalId: row.digitalId,
    profilePicture: row.profilePictureUrl,
    isApproved: Boolean(row.isApproved),
    emergencyContact,
  };
};

const sanitizeUser = (row) => {
  if (!row) return null;
  const { passwordHash, ...rest } = row;
  return rest;
};

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const {
    firstName,
    middleInitial,
    lastName,
    email,
    phone,
    password,
    address,
    dateOfBirth,
    placeOfBirth,
    maritalStatus,
    numberOfChildren,
    gender,
    religion,
    education,
    company,
    position,
    department,
    yearsEmployed,
    unionAffiliation,
    unionPosition,
    emergencyContact = {},
  } = req.body ?? {};

  if (!normalizeString(firstName) || !normalizeString(lastName)) {
    return res.status(400).json({ message: 'First name and last name are required.' });
  }

  if (!normalizeString(email) || !normalizeString(phone)) {
    return res.status(400).json({ message: 'Email and phone are required.' });
  }

  if (!normalizeString(address) || !normalizeString(dateOfBirth) || !normalizeString(placeOfBirth)) {
    return res.status(400).json({ message: 'Address, place of birth, and date of birth are required.' });
  }

  if (!normalizeString(education) || !normalizeString(company) || !normalizeString(position) || !normalizeString(unionPosition)) {
    return res.status(400).json({ message: 'Education, company, position, and union position are required.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1',
      [email, phone],
    );

    if (existing.length) {
      await connection.rollback();
      return res.status(409).json({ message: 'An account with that email or phone already exists.' });
    }

    const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;
    const membershipDate = new Date();
    const digitalId = generateDigitalId(company);

    const [userResult] = await connection.query(
      `INSERT INTO users (
        first_name,
        middle_initial,
        last_name,
        email,
        phone,
        password_hash,
        date_of_birth,
        place_of_birth,
        address,
        marital_status,
        number_of_children,
        gender,
        religion,
        education,
        company,
        position,
        department,
        years_employed,
        union_affiliation,
        union_position,
        membership_date,
        digital_id,
        profile_picture_url,
        is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizeString(firstName),
        normalizeString(middleInitial),
        normalizeString(lastName),
        normalizeString(email),
        normalizeString(phone),
        passwordHash,
        normalizeString(dateOfBirth),
        normalizeString(placeOfBirth),
        normalizeString(address),
        normalizeString(maritalStatus),
        normalizeNumber(numberOfChildren),
        normalizeString(gender),
        normalizeString(religion),
        normalizeString(education),
        normalizeString(company),
        normalizeString(position),
        normalizeString(department),
        normalizeNumber(yearsEmployed),
        normalizeString(unionAffiliation),
        normalizeString(unionPosition),
        membershipDate,
        digitalId,
        null,
        0,
      ],
    );

    const userId = userResult.insertId;

    await connection.query(
      `INSERT INTO user_emergency_contacts (user_id, name, relationship, phone, address)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), relationship = VALUES(relationship), phone = VALUES(phone), address = VALUES(address)`,
      [
        userId,
        normalizeString(emergencyContact.name),
        normalizeString(emergencyContact.relationship),
        normalizeString(emergencyContact.phone),
        normalizeString(emergencyContact.address),
      ],
    );

    await connection.commit();

    res.status(201).json({ id: userId, digitalId, message: 'Membership application submitted.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  } finally {
    connection.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body ?? {};

  if (!normalizeString(identifier) || !normalizeString(password)) {
    return res.status(400).json({ message: 'Credentials are required.' });
  }

  try {
    const rows = await runQuery(
      `SELECT
         u.id,
         u.first_name AS firstName,
         u.middle_initial AS middleInitial,
         u.last_name AS lastName,
         u.email,
         u.phone,
         u.password_hash AS passwordHash,
         u.address,
         u.date_of_birth AS dateOfBirth,
         u.place_of_birth AS placeOfBirth,
         u.marital_status AS maritalStatus,
         u.number_of_children AS numberOfChildren,
         u.gender,
         u.religion,
         u.education,
         u.company,
         u.position,
         u.department,
         u.years_employed AS yearsEmployed,
         u.union_affiliation AS unionAffiliation,
         u.union_position AS unionPosition,
         u.membership_date AS membershipDate,
         u.digital_id AS digitalId,
         u.profile_picture_url AS profilePictureUrl,
         u.is_approved AS isApproved,
         ec.name AS emergencyContactName,
         ec.relationship AS emergencyContactRelationship,
         ec.phone AS emergencyContactPhone,
         ec.address AS emergencyContactAddress
       FROM users u
       LEFT JOIN user_emergency_contacts ec ON ec.user_id = u.id
       WHERE u.email = ? OR u.phone = ?
       LIMIT 1`,
      [identifier, identifier],
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const userRow = rows[0];

    if (!userRow.passwordHash) {
      return res.status(403).json({ message: 'Password setup required. Please complete verification.' });
    }

    const passwordMatches = await bcrypt.compare(password, userRow.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ user: sanitizeUser(mapUserRow(userRow)) });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const rows = await runQuery(
      `SELECT
         u.id,
         u.first_name AS firstName,
         u.middle_initial AS middleInitial,
         u.last_name AS lastName,
         u.email,
         u.phone,
         u.address,
         u.date_of_birth AS dateOfBirth,
         u.place_of_birth AS placeOfBirth,
         u.marital_status AS maritalStatus,
         u.number_of_children AS numberOfChildren,
         u.gender,
         u.religion,
         u.education,
         u.company,
         u.position,
         u.department,
         u.years_employed AS yearsEmployed,
         u.union_affiliation AS unionAffiliation,
         u.union_position AS unionPosition,
         u.membership_date AS membershipDate,
         u.digital_id AS digitalId,
         u.profile_picture_url AS profilePictureUrl,
         u.is_approved AS isApproved,
         ec.name AS emergencyContactName,
         ec.relationship AS emergencyContactRelationship,
         ec.phone AS emergencyContactPhone,
         ec.address AS emergencyContactAddress
       FROM users u
       LEFT JOIN user_emergency_contacts ec ON ec.user_id = u.id
       WHERE u.id = ?
       LIMIT 1`,
      [req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: mapUserRow(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch user.', error: error.message });
  }
});

app.get('/api/users/:id/dues', async (req, res) => {
  try {
    const dues = await runQuery(
      `SELECT id, billing_period AS billingPeriod, amount, status, paid_at AS paidAt
         FROM dues WHERE user_id = ? ORDER BY billing_period DESC`,
      [req.params.id],
    );

    res.json({ dues });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch dues.', error: error.message });
  }
});

app.post('/api/users/:id/dues', async (req, res) => {
  const { billingPeriod, amount, status } = req.body ?? {};
  if (!normalizeString(billingPeriod) || !normalizeNumber(amount)) {
    return res.status(400).json({ message: 'Billing period and amount are required.' });
  }

  try {
    const result = await runQuery(
      `INSERT INTO dues (user_id, billing_period, amount, status)
       VALUES (?, ?, ?, ?)`,
      [req.params.id, billingPeriod, Number(amount), status ?? 'pending'],
    );

    res.status(201).json({ id: result.insertId, message: 'Dues record created.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create dues record.', error: error.message });
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message ?? 'Unexpected error.' });
});

const start = async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`API server ready at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

start();
