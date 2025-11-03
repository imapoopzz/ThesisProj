export interface Member {
  id: string;
  memberID: string;
  digitalID?: string;
  fullName: string;
  email: string;
  mobile: string;
  company: string;
  department: string;
  position: string;
  unionAffiliation: string;
  unionPosition: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Active' | 'Inactive';
  duesStatus: 'Current' | 'Overdue' | 'Paid' | 'Pending';
  idStatus: 'Not Issued' | 'Pending' | 'Issued' | 'Expired';
  cardRequested: boolean;
  cardStatus?: 'Requested' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered';
  registeredDate: string;
  photoURL?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  address: string;
  yearsEmployed: number;
  emergencyContact: string;
  notes?: string;
}

export const mockMembers: Member[] = [
  {
    id: '1',
    memberID: 'ALU-2024-0001',
    digitalID: 'DID-001-2024',
    fullName: 'Juan dela Cruz',
    email: 'juan.delacruz@bdo.com.ph',
    mobile: '+63917-123-4567',
    company: 'Banco de Oro (BDO)',
    department: 'Operations',
    position: 'Senior Officer',
    unionAffiliation: 'BDO Employees Union',
    unionPosition: 'Member',
    status: 'Active',
    duesStatus: 'Current',
    idStatus: 'Issued',
    cardRequested: true,
    cardStatus: 'Delivered',
    registeredDate: '2024-01-15',
    dateOfBirth: '1985-03-20',
    gender: 'Male',
    address: '123 Makati Ave, Makati City',
    yearsEmployed: 8,
    emergencyContact: 'Maria dela Cruz - +63917-765-4321',
  },
  {
    id: '2',
    memberID: 'ALU-2024-0002',
    fullName: 'Maria Santos',
    email: 'maria.santos@sm.com.ph',
    mobile: '+63918-234-5678',
    company: 'SM Investments Corp',
    department: 'Human Resources',
    position: 'Manager',
    unionAffiliation: 'SM Workers Union',
    unionPosition: 'Treasurer',
    status: 'Pending Review',
    duesStatus: 'Pending',
    idStatus: 'Not Issued',
    cardRequested: false,
    registeredDate: '2024-09-20',
    dateOfBirth: '1982-07-15',
    gender: 'Female',
    address: '456 Ortigas Ave, Pasig City',
    yearsEmployed: 12,
    emergencyContact: 'Jose Santos - +63918-876-5432',
  },
  {
    id: '3',
    memberID: 'ALU-2024-0003',
    digitalID: 'DID-003-2024',
    fullName: 'Pedro Reyes',
    email: 'pedro.reyes@jollibee.com.ph',
    mobile: '+63919-345-6789',
    company: 'Jollibee Foods Corporation',
    department: 'Store Operations',
    position: 'Store Manager',
    unionAffiliation: 'Fast Food Workers Union',
    unionPosition: 'Vice President',
    status: 'Active',
    duesStatus: 'Overdue',
    idStatus: 'Issued',
    cardRequested: true,
    cardStatus: 'Processing',
    registeredDate: '2023-11-10',
    dateOfBirth: '1978-12-03',
    gender: 'Male',
    address: '789 Quezon Ave, Quezon City',
    yearsEmployed: 15,
    emergencyContact: 'Ana Reyes - +63919-987-6543',
  },
  // Add more sample members...
  {
    id: '4',
    memberID: 'ALU-2024-0004',
    fullName: 'Ana Garcia',
    email: 'ana.garcia@ayala.com.ph',
    mobile: '+63920-456-7890',
    company: 'Ayala Corporation',
    department: 'Finance',
    position: 'Senior Analyst',
    unionAffiliation: 'Ayala Employees Association',
    unionPosition: 'Secretary',
    status: 'Active',
    duesStatus: 'Current',
    idStatus: 'Pending',
    cardRequested: false,
    registeredDate: '2024-03-05',
    dateOfBirth: '1990-04-18',
    gender: 'Female',
    address: '321 BGC, Taguig City',
    yearsEmployed: 5,
    emergencyContact: 'Carlos Garcia - +63920-098-7654',
  },
  {
    id: '5',
    memberID: 'ALU-2024-0005',
    fullName: 'Roberto Lopez',
    email: 'roberto.lopez@pldt.com.ph',
    mobile: '+63921-567-8901',
    company: 'PLDT Inc.',
    department: 'Technical Operations',
    position: 'Technical Specialist',
    unionAffiliation: 'Telecom Workers Union',
    unionPosition: 'Board Member',
    status: 'Active',
    duesStatus: 'Current',
    idStatus: 'Issued',
    cardRequested: true,
    cardStatus: 'Shipped',
    registeredDate: '2023-08-20',
    dateOfBirth: '1983-09-25',
    gender: 'Male',
    address: '654 Makati Ave, Makati City',
    yearsEmployed: 10,
    emergencyContact: 'Lisa Lopez - +63921-109-8765',
  },
];

export const mockCompanies = [
  'Banco de Oro (BDO)',
  'SM Investments Corp',
  'Jollibee Foods Corporation',
  'Ayala Corporation',
  'PLDT Inc.',
  'Globe Telecom',
  'Aboitiz Equity Ventures',
  'JG Summit Holdings',
  'Lopez Holdings Corp',
  'Metropolitan Bank & Trust Company',
];

export const mockUnions = [
  'BDO Employees Union',
  'SM Workers Union',
  'Fast Food Workers Union',
  'Ayala Employees Association',
  'Telecom Workers Union',
  'Banking Employees Union',
  'Manufacturing Workers Union',
  'Retail Workers Federation',
  'Service Workers Alliance',
  'Corporate Employees Union',
];

export const mockPositions = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'Board Member',
  'Member',
];

export function generateMockMembers(count: number): Member[] {
  const baseMembers = [...mockMembers];
  const statuses: Member['status'][] = ['Active', 'Pending Review', 'Approved', 'Inactive'];
  const duesStatuses: Member['duesStatus'][] = ['Current', 'Overdue', 'Paid', 'Pending'];
  const idStatuses: Member['idStatus'][] = ['Issued', 'Pending', 'Not Issued', 'Expired'];
  
  for (let i = baseMembers.length; i < count; i++) {
    const member: Member = {
      id: (i + 1).toString(),
      memberID: `ALU-2024-${String(i + 1).padStart(4, '0')}`,
      digitalID: Math.random() > 0.3 ? `DID-${String(i + 1).padStart(3, '0')}-2024` : undefined,
      fullName: `Member ${i + 1}`,
      email: `member${i + 1}@company.com.ph`,
      mobile: `+63917-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      company: mockCompanies[Math.floor(Math.random() * mockCompanies.length)],
      department: ['Operations', 'HR', 'Finance', 'IT', 'Sales', 'Marketing'][Math.floor(Math.random() * 6)],
      position: ['Manager', 'Senior Officer', 'Officer', 'Specialist', 'Analyst'][Math.floor(Math.random() * 5)],
      unionAffiliation: mockUnions[Math.floor(Math.random() * mockUnions.length)],
      unionPosition: mockPositions[Math.floor(Math.random() * mockPositions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      duesStatus: duesStatuses[Math.floor(Math.random() * duesStatuses.length)],
      idStatus: idStatuses[Math.floor(Math.random() * idStatuses.length)],
      cardRequested: Math.random() > 0.6,
      cardStatus: Math.random() > 0.5 ? (['Requested', 'Paid', 'Processing', 'Shipped', 'Delivered'][Math.floor(Math.random() * 5)] as any) : undefined,
      registeredDate: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      dateOfBirth: `198${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      address: `Address ${i + 1}, City ${Math.floor(Math.random() * 5) + 1}`,
      yearsEmployed: Math.floor(Math.random() * 20) + 1,
      emergencyContact: `Contact ${i + 1} - +63917-xxx-xxxx`,
    };
    baseMembers.push(member);
  }
  
  return baseMembers;
}