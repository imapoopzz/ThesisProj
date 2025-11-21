import { runQuery } from '../../db.js';
import { safeNumber } from './helpers.js';

const formatCurrency = (value) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) {
    return '₱0';
  }
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  });
  return formatter.format(numeric);
};

const MEMBERSHIP_RANGE_CONFIG = {
  '7d': { sql: '7 DAY', label: 'Last 7 days' },
  '30d': { sql: '30 DAY', label: 'Last 30 days' },
  '90d': { sql: '90 DAY', label: 'Last 3 months' },
  '12m': { sql: '12 MONTH', label: 'Last 12 months' },
};

const SAMPLE_MEMBERSHIP_NEW_JOINERS_BY_RANGE = {
  '7d': 14,
  '30d': 44,
  '90d': 130,
  '12m': 480,
};

const SAMPLE_MEMBERSHIP_COMPANY_STATS = [
  {
    company: 'Banco de Oro (BDO)',
    total: 4120,
    totalAllStatuses: 4390,
    inactive: 270,
    retentionRate: 93.8,
    newJoinersByRange: { '7d': 4, '30d': 12, '90d': 32, '12m': 112 },
  },
  {
    company: 'SM Investment Corps',
    total: 2985,
    totalAllStatuses: 3210,
    inactive: 225,
    retentionRate: 93,
    newJoinersByRange: { '7d': 3, '30d': 10, '90d': 28, '12m': 104 },
  },
  {
    company: 'Ayala Corporation',
    total: 2340,
    totalAllStatuses: 2600,
    inactive: 260,
    retentionRate: 90,
    newJoinersByRange: { '7d': 3, '30d': 8, '90d': 24, '12m': 88 },
  },
  {
    company: 'PLDT Inc',
    total: 1890,
    totalAllStatuses: 2040,
    inactive: 150,
    retentionRate: 92.6,
    newJoinersByRange: { '7d': 2, '30d': 6, '90d': 19, '12m': 72 },
  },
  {
    company: 'Jollibee Foods',
    total: 1567,
    totalAllStatuses: 1700,
    inactive: 133,
    retentionRate: 92.2,
    newJoinersByRange: { '7d': 1, '30d': 4, '90d': 14, '12m': 54 },
  },
  {
    company: 'Others',
    total: 6901,
    totalAllStatuses: 6997,
    inactive: 96,
    retentionRate: 98.6,
    newJoinersByRange: { '7d': 1, '30d': 4, '90d': 13, '12m': 50 },
  },
];

const SAMPLE_MEMBERSHIP_COMPANY_FILTERS = [
  'Banco de Oro (BDO)',
  'SM Investment Corps',
  'Ayala Corporation',
  'PLDT Inc',
  'Jollibee Foods',
];

const TENURE_BUCKETS_CONFIG = [
  { id: '1-5', label: '1-5 years', min: 0, max: 6 },
  { id: '6-10', label: '6-10 years', min: 6, max: 11 },
  { id: '11-15', label: '11-15 years', min: 11, max: 16 },
  { id: '16-20', label: '16-20 years', min: 16, max: 21 },
  { id: '20+', label: '20+ years', min: 20, max: null },
];

const SAMPLE_UNION_POSITION_STATS = [
  { label: 'Member', value: 16789 },
  { label: 'Board Member', value: 1234 },
  { label: 'Treasurer', value: 567 },
  { label: 'Secretary', value: 389 },
  { label: 'Vice President', value: 156 },
  { label: 'President', value: 112 },
];

const SAMPLE_TENURE_STATS = [
  { id: '1-5', label: '1-5 years', value: 7698 },
  { id: '6-10', label: '6-10 years', value: 5774 },
  { id: '11-15', label: '11-15 years', value: 3849 },
  { id: '16-20', label: '16-20 years', value: 1540 },
  { id: '20+', label: '20+ years', value: 386 },
];

const SAMPLE_COLLECTION_SERIES = [
  { month: '2025-01-01', label: 'Jan', collected: 880000, billed: 900000 },
  { month: '2025-02-01', label: 'Feb', collected: 910000, billed: 900000 },
  { month: '2025-03-01', label: 'Mar', collected: 780000, billed: 900000 },
  { month: '2025-04-01', label: 'Apr', collected: 930000, billed: 900000 },
  { month: '2025-05-01', label: 'May', collected: 890000, billed: 900000 },
  { month: '2025-06-01', label: 'Jun', collected: 950000, billed: 900000 },
  { month: '2025-07-01', label: 'Jul', collected: 920000, billed: 900000 },
  { month: '2025-08-01', label: 'Aug', collected: 980000, billed: 920000 },
];

const SAMPLE_TOP_COMPANIES = [
  { company: 'Banco de Oro (BDO)', collected: 4700000, billed: 4800000, collectionRate: 97.9, members: 4120 },
  { company: 'SM Investment Corps', collected: 4200000, billed: 4380000, collectionRate: 95.9, members: 2985 },
  { company: 'Ayala Corporation', collected: 3200000, billed: 3480000, collectionRate: 92.0, members: 2340 },
  { company: 'PLDT Inc', collected: 2780000, billed: 3160000, collectionRate: 88.0, members: 1890 },
  { company: 'Jollibee Foods', collected: 2450000, billed: 2880000, collectionRate: 85.1, members: 1567 },
];

const SAMPLE_REGISTRATION_METRICS = {
  avgProcessingTime: '2.3 days',
  avgProcessingMeta: 'Based on 312 decisions',
  approvalRate: 94,
  approvalRateMeta: '312 decisions',
  pendingReviews: 47,
  pendingReviewsMeta: 'Pending + under review',
  duplicateDetections: 3,
  duplicateDetectionsMeta: '6.4% flagged',
};

const SAMPLE_SYSTEM_HEALTH = {
  databaseHealth: 98,
  databaseHealthMeta: 'All core tables responsive',
  apiResponseTime: 142,
  apiResponseTimeMeta: '9.1 q/s throughput',
  storageUsage: 67,
  storageUsageMeta: '432 MB used',
  uptime: 99.9,
  uptimeMeta: '31-day rolling uptime',
};

const SAMPLE_AI_METRICS = {
  autoAssignRate: 67,
  autoAssignRateMeta: '+12% vs last month',
  autoAssignRateTone: 'positive',
  avgConfidence: 84,
  avgConfidenceMeta: '+3% vs last month',
  avgConfidenceTone: 'positive',
  overrideRate: 15,
  overrideRateMeta: '-5% vs last month',
  overrideRateTone: 'positive',
  timeSavedPerDayHours: 2.3,
  timeSavedMeta: 'AI automation',
  timeSavedTone: 'positive',
};

const SAMPLE_REPORT_BUILDER = {
  reportTypes: [
    { value: 'membership', label: 'Membership Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'events', label: 'Event Attendance' },
    { value: 'benefits', label: 'Benefits & Attendance' },
    { value: 'ai-analytics', label: 'AI Analytics Report' },
    { value: 'ai-audit', label: 'AI Audit Trial' },
  ],
  dateRanges: [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '12m', label: 'Last 12 months' },
  ],
  filters: [
    { value: 'company', label: 'By Company' },
    { value: 'union-position', label: 'By Union Position' },
    { value: 'status', label: 'By Status' },
    { value: 'region', label: 'By Region' },
  ],
  formats: [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'dashboard', label: 'Interactive Dashboard' },
  ],
};

const buildSampleSummaryPayload = (primaryMessage, options = {}) => {
  const {
    type = 'warning',
    warnings: extraWarnings = [],
    error = null,
    diagnostics = null,
  } = options ?? {};

  const warnings = [];
  const normalizedPrimary = primaryMessage ?? null;
  if (Array.isArray(normalizedPrimary)) {
    warnings.push(...normalizedPrimary.filter(Boolean));
  } else if (normalizedPrimary) {
    warnings.push(normalizedPrimary);
  }
  if (Array.isArray(extraWarnings)) {
    warnings.push(...extraWarnings.filter(Boolean));
  }

  const fallbackReason = normalizedPrimary
    ?? (Array.isArray(extraWarnings) && extraWarnings.length
      ? extraWarnings[0]
      : 'Sample analytics payload (no database records).');

  const collectionDiagnostics = {
    source: 'sample',
    fallbackApplied: true,
    fallbackReason,
    paymentsPeriods: SAMPLE_COLLECTION_SERIES.length,
    paymentsWithAmounts: SAMPLE_COLLECTION_SERIES.length,
    ledgerPeriods: SAMPLE_COLLECTION_SERIES.length,
    ledgerWithAmounts: SAMPLE_COLLECTION_SERIES.length,
    issues: [fallbackReason],
    seriesDetails: SAMPLE_COLLECTION_SERIES.map((item) => ({
      month: item.month,
      label: item.label,
      collected: item.collected,
      billed: item.billed,
    })),
    realMonths: SAMPLE_COLLECTION_SERIES.length,
    targetMonths: SAMPLE_COLLECTION_SERIES.length,
  };

  const membersDistribution = [
    { company: 'Banco de Oro (BDO)', count: 4120 },
    { company: 'SM Investment Corps', count: 2985 },
    { company: 'Ayala Corporation', count: 2340 },
    { company: 'PLDT Inc', count: 1890 },
    { company: 'Jollibee Foods', count: 1567 },
    { company: 'Others', count: 6901 },
  ];

  const growthTrend = [
    { month: '2025-01-01', label: 'Jan', totalMembers: 18203, newMembers: 32, registrations: 45 },
    { month: '2025-02-01', label: 'Feb', totalMembers: 18396, newMembers: 34, registrations: 49 },
    { month: '2025-03-01', label: 'Mar', totalMembers: 18512, newMembers: 28, registrations: 43 },
    { month: '2025-04-01', label: 'Apr', totalMembers: 18758, newMembers: 41, registrations: 52 },
    { month: '2025-05-01', label: 'May', totalMembers: 19012, newMembers: 39, registrations: 55 },
    { month: '2025-06-01', label: 'Jun', totalMembers: 19348, newMembers: 48, registrations: 60 },
    { month: '2025-07-01', label: 'Jul', totalMembers: 19586, newMembers: 44, registrations: 57 },
    { month: '2025-08-01', label: 'Aug', totalMembers: 19803, newMembers: 38, registrations: 53 },
  ];

  const collectionSeries = SAMPLE_COLLECTION_SERIES.map((item) => ({ ...item }));
  const topCompanies = SAMPLE_TOP_COMPANIES.map((item) => ({ ...item }));

  const payload = {
    meta: {
      isSample: true,
      alertType: type,
      alertMessage: fallbackReason,
      warnings,
      ...(diagnostics ? { diagnostics } : {}),
      ...(error ? { error } : {}),
    },
    members: {
      total: 19803,
      totalAllStatuses: 20937,
      inactive: 1134,
      newJoiners30d: SAMPLE_MEMBERSHIP_NEW_JOINERS_BY_RANGE['30d'],
      newJoinersPrev30: 39,
      newJoinersByRange: { ...SAMPLE_MEMBERSHIP_NEW_JOINERS_BY_RANGE },
      growthPercent: 7.7,
      activeEmployers: 58,
      payingEmployers: 58,
      retentionRate: 94.6,
      newJoinersChange: 7.7,
      growthTrend,
      distribution: membersDistribution,
      companyFilters: [...SAMPLE_MEMBERSHIP_COMPANY_FILTERS],
      companyStats: SAMPLE_MEMBERSHIP_COMPANY_STATS.map((entry) => ({
        ...entry,
        newJoinersByRange: { ...entry.newJoinersByRange },
      })),
      demographics: {
        unionPositions: SAMPLE_UNION_POSITION_STATS.map((entry) => ({ ...entry })),
        tenure: SAMPLE_TENURE_STATS.map((entry) => ({ ...entry })),
      },
    },
    financial: {
      revenueYtd: 7300000,
      revenuePrevYear: 6350000,
      revenueYoYPercent: 15,
      collectionRate: 94.6,
      collectionNote: 'Above target',
      billedYtd: 7720000,
      collectedYtd: 7300000,
      monthlyCollections: 1020000,
      monthlyCollectionsPrev: 940000,
      collectionSeries,
      collectionDiagnostics,
      topCompanies,
      paymentMethods: [
        { method: 'payroll', label: 'Payroll Deduction', amount: 4700000, percent: 65.1 },
        { method: 'bank_transfer', label: 'Bank Transfer', amount: 1800000, percent: 24.9 },
        { method: 'check', label: 'Check Payment', amount: 580000, percent: 8.0 },
        { method: 'cash', label: 'Cash', amount: 145000, percent: 2.0 },
      ],
    },
    tickets: {
      total: 312,
      open: 46,
      closed: 266,
    },
    events: {
      total: 12,
      upcoming: 3,
      attendanceRate: 87,
    },
    benefits: {
      totalRequests: 350,
      approved: 323,
      denied: 18,
      inProgress: 9,
      totalDisbursed: 2570000,
    },
    dues: {
      entries: 1184,
      arrears: 186000,
      overdueEntries: 2120,
      overdueMembers: 1832,
    },
    registration: {
      avgProcessingTime: SAMPLE_REGISTRATION_METRICS.avgProcessingTime,
      avgProcessingMeta: SAMPLE_REGISTRATION_METRICS.avgProcessingMeta,
      approvalRate: SAMPLE_REGISTRATION_METRICS.approvalRate,
      approvalRateMeta: SAMPLE_REGISTRATION_METRICS.approvalRateMeta,
      pendingReviews: SAMPLE_REGISTRATION_METRICS.pendingReviews,
      pendingReviewsMeta: SAMPLE_REGISTRATION_METRICS.pendingReviewsMeta,
      duplicateDetections: SAMPLE_REGISTRATION_METRICS.duplicateDetections,
      duplicateDetectionsMeta: SAMPLE_REGISTRATION_METRICS.duplicateDetectionsMeta,
    },
    systemHealth: {
      databaseHealth: SAMPLE_SYSTEM_HEALTH.databaseHealth,
      databaseHealthMeta: SAMPLE_SYSTEM_HEALTH.databaseHealthMeta,
      apiResponseTime: SAMPLE_SYSTEM_HEALTH.apiResponseTime,
      apiResponseTimeMeta: SAMPLE_SYSTEM_HEALTH.apiResponseTimeMeta,
      storageUsage: SAMPLE_SYSTEM_HEALTH.storageUsage,
      storageUsageMeta: SAMPLE_SYSTEM_HEALTH.storageUsageMeta,
      uptime: SAMPLE_SYSTEM_HEALTH.uptime,
      uptimeMeta: SAMPLE_SYSTEM_HEALTH.uptimeMeta,
    },
    reportBuilder: { ...SAMPLE_REPORT_BUILDER },
    ai: { ...SAMPLE_AI_METRICS },
    performance: {
      membership: [
        { label: 'Active Members', value: 19803, format: 'count', meta: '94.6% of records active' },
        { label: 'New Registrations (30d)', value: 47, format: 'count', meta: '+7.7% vs prior 30d' },
        { label: 'Retention Rate', value: 94.6, format: 'percent', meta: 'Approved vs total records' },
      ],
      financial: [
        { label: 'Monthly Collections', value: 1020000, format: 'currency', meta: 'Collected in the last 30 days' },
        { label: 'Outstanding Dues', value: 890000, format: 'currency', meta: 'Ledger entries flagged overdue' },
        { label: 'Collection Efficiency', value: 107, format: 'percent', meta: 'Above target' },
      ],
      operations: [
        { label: 'Physical Cards', value: 1247, format: 'count', meta: '6.5% of members' },
        { label: 'Assistance Beneficiaries', value: 323, format: 'count', meta: '₱2.57M disbursed' },
        { label: 'Events This Year', value: 12, format: 'count', meta: '87% avg attendance' },
      ],
    },
  };

  return payload;
};

const COMPANY_STATS_QUERY = `
  SELECT
    COALESCE(company_lookup.company, 'Unspecified') AS company,
    SUM(CASE WHEN u.status = 'approved' THEN 1 ELSE 0 END) AS approvedMembers,
    COUNT(*) AS totalMembers,
    SUM(CASE WHEN u.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS newJoiners7d,
    SUM(CASE WHEN u.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS newJoiners30d,
    SUM(CASE WHEN u.created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN 1 ELSE 0 END) AS newJoiners90d,
    SUM(CASE WHEN u.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) THEN 1 ELSE 0 END) AS newJoiners12m
  FROM users u
  LEFT JOIN (
    SELECT user_id, MAX(company) AS company
    FROM user_employment
    WHERE company IS NOT NULL AND company <> ''
    GROUP BY user_id
  ) AS company_lookup ON company_lookup.user_id = u.id
  GROUP BY company
  HAVING totalMembers > 0;
`;

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  const asString = String(value);
  if (asString.includes(',') || asString.includes('\n') || asString.includes('"')) {
    return `"${asString.replace(/"/g, '""')}"`;
  }
  return asString;
};

const mapCompanyStats = (rows = []) => rows.map((row) => {
  const companyName = row.company ?? 'Unspecified';
  const totalAllStatuses = safeNumber(row.totalMembers);
  const activeMembers = safeNumber(row.approvedMembers);
  const inactiveMembers = Math.max(totalAllStatuses - activeMembers, 0);

  return {
    company: companyName,
    total: activeMembers,
    totalAllStatuses,
    inactive: inactiveMembers,
    retentionRate: totalAllStatuses > 0 ? (activeMembers / totalAllStatuses) * 100 : null,
    newJoinersByRange: {
      '7d': safeNumber(row.newJoiners7d),
      '30d': safeNumber(row.newJoiners30d),
      '90d': safeNumber(row.newJoiners90d),
      '12m': safeNumber(row.newJoiners12m),
    },
  };
});

const deriveCompanyFilters = (companyStats = []) => {
  const seen = new Set();
  return companyStats
    .map((entry) => (entry.company ?? '').trim())
    .filter((name) => name && name.toLowerCase() !== 'unspecified')
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

const logQueryWarning = (label, error) => {
  console.warn(`[reports] ${label} query failed: ${error?.message ?? error}`);
};

const safeReportQuery = async (label, sql, params = [], fallback = []) => {
  try {
    return await runQuery(sql, params);
  } catch (error) {
    logQueryWarning(label, error);
    if (Array.isArray(fallback)) {
      return fallback;
    }
    return [fallback ?? {}];
  }
};

const EMPTY_MEMBERS_ROW = [{
  totalMembers: 0,
  approvedMembers: 0,
  newJoiners7d: 0,
  newJoiners30d: 0,
  newJoiners90d: 0,
  newJoiners12m: 0,
  newJoinersPrev30: 0,
}];

const EMPTY_REGISTRATION_STATS_ROW = [{
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  totalCount: 0,
}];

const formatRelativeTime = (input) => {
  if (!input) {
    return null;
  }
  const timestamp = new Date(input);
  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  if (diffMs < 0) {
    return 'Just now';
  }
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < minute) {
    return 'Updated just now';
  }
  if (diffMs < hour) {
    const minutes = Math.round(diffMs / minute);
    return `Updated ${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }
  if (diffMs < day) {
    const hours = Math.round(diffMs / hour);
    return `Updated ${hours} hr${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.round(diffMs / day);
  if (days < 30) {
    return `Updated ${days} day${days === 1 ? '' : 's'} ago`;
  }
  const months = Math.floor(days / 30);
  return `Updated ${months} mo${months === 1 ? '' : 's'} ago`;
};

const normalizeOptionList = (source, fallbackList) => {
  const results = [];
  const appendOption = (value, label) => {
    const trimmedLabel = typeof label === 'string' ? label.trim() : '';
    if (!trimmedLabel) {
      return;
    }
    const normalizedValue = typeof value === 'string' && value.trim()
      ? value.trim()
      : trimmedLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    results.push({ value: normalizedValue, label: trimmedLabel });
  };

  if (Array.isArray(source)) {
    source.forEach((item) => {
      if (item == null) {
        return;
      }
      if (typeof item === 'string') {
        appendOption(item, item);
        return;
      }
      if (typeof item === 'object') {
        const label = item.label ?? item.name ?? item.title ?? item.text;
        const value = item.value ?? item.code ?? item.key ?? label;
        appendOption(value, label ?? value);
      }
    });
  } else if (source && typeof source === 'object') {
    Object.entries(source).forEach(([key, label]) => {
      if (typeof label === 'string' && label.trim()) {
        appendOption(key, label);
      }
    });
  }

  if (!results.length && Array.isArray(fallbackList)) {
    return [...fallbackList];
  }

  return results;
};

const registerReportsRoutes = (router) => {
  // summary report combining tickets, events, benefits and dues
  router.get('/reports/summary', async (_req, res) => {
    try {
      const padMonth = (value) => value.toString().padStart(2, '0');
      const trendMonths = 8;
      const now = new Date();
      const firstMonth = new Date(now.getFullYear(), now.getMonth() - (trendMonths - 1), 1);

      const growthSeries = Array.from({ length: trendMonths }, (_v, idx) => {
        const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + idx, 1);
        return {
          key: `${date.getFullYear()}-${padMonth(date.getMonth() + 1)}-01`,
          label: date.toLocaleString('en-US', { month: 'short' }),
        };
      });

      const trendStartKey = growthSeries[0]?.key;

      const membersRow = await safeReportQuery(
        'members summary',
        `
        SELECT
          COUNT(*) AS totalMembers,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedMembers,
          SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS newJoiners7d,
          SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS newJoiners30d,
          SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) THEN 1 ELSE 0 END) AS newJoiners90d,
          SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) THEN 1 ELSE 0 END) AS newJoiners12m,
          SUM(CASE WHEN created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE_SUB(CURDATE(), INTERVAL 31 DAY) THEN 1 ELSE 0 END) AS newJoinersPrev30
        FROM users;
        `,
        [],
        EMPTY_MEMBERS_ROW,
      );

      const activeEmployersRow = await safeReportQuery(
        'active employers',
        `
        SELECT COUNT(DISTINCT company) AS activeEmployers
        FROM user_employment
        WHERE company IS NOT NULL AND company <> '';
        `,
        [],
        [{ activeEmployers: 0 }],
      );

      const payingEmployersRow = await safeReportQuery(
        'paying employers',
        `
        SELECT COUNT(DISTINCT ue.company) AS payingEmployers
        FROM dues_payments dp
        JOIN dues_ledger dl ON dl.id = dp.ledger_id
        JOIN users u ON u.id = dl.user_id
        LEFT JOIN user_employment ue ON ue.user_id = u.id
        WHERE ue.company IS NOT NULL AND ue.company <> '';
        `,
        [],
        [{ payingEmployers: 0 }],
      );

      let growthTrendRows = [];
      let approvedBeforeRows = [];
      if (trendStartKey) {
        growthTrendRows = await safeReportQuery(
          'member growth trend',
          `SELECT DATE_FORMAT(created_at, '%Y-%m-01') AS period,
                  SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
                  COUNT(*) AS registrations
           FROM users
           WHERE created_at >= ?
           GROUP BY period
           ORDER BY period;`,
          [trendStartKey],
          [],
        );

        approvedBeforeRows = await safeReportQuery(
          'approved members before trend window',
          `SELECT SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedBefore
           FROM users
           WHERE created_at < ?;`,
          [trendStartKey],
          [{ approvedBefore: 0 }],
        );
      }

      let collectionSeriesRows = [];
      let billedSeriesRows = [];
      if (trendStartKey) {
        collectionSeriesRows = await safeReportQuery(
          'dues payments trend',
          `SELECT DATE_FORMAT(paid_at, '%Y-%m-01') AS period,
                  COALESCE(SUM(amount), 0) AS totalCollected
           FROM dues_payments
           WHERE paid_at >= ?
           GROUP BY period
           ORDER BY period;`,
          [trendStartKey],
          [],
        );

        billedSeriesRows = await safeReportQuery(
          'dues billing trend',
          `SELECT DATE_FORMAT(due_date, '%Y-%m-01') AS period,
                  COALESCE(SUM(amount), 0) AS totalBilled
           FROM dues_ledger
           WHERE due_date >= ?
           GROUP BY period
           ORDER BY period;`,
          [trendStartKey],
          [],
        );
      }

      const paymentsWithAmounts = collectionSeriesRows.filter((row) => safeNumber(row.totalCollected) > 0).length;
      const billedWithAmounts = billedSeriesRows.filter((row) => safeNumber(row.totalBilled) > 0).length;
      const collectionDiagnostics = {
        source: 'database',
        fallbackApplied: false,
        fallbackReason: null,
        paymentsPeriods: collectionSeriesRows.length,
        paymentsWithAmounts,
        ledgerPeriods: billedSeriesRows.length,
        ledgerWithAmounts: billedWithAmounts,
        issues: [],
      };

      const paymentsRow = await safeReportQuery(
        'dues payments aggregates',
        `
        SELECT
          COALESCE(SUM(CASE WHEN YEAR(paid_at) = YEAR(CURDATE()) THEN amount ELSE 0 END), 0) AS collectedYtd,
          COALESCE(SUM(CASE WHEN YEAR(paid_at) = YEAR(CURDATE()) - 1 THEN amount ELSE 0 END), 0) AS collectedPrevYear
        FROM dues_payments;
        `,
        [],
        [{ collectedYtd: 0, collectedPrevYear: 0 }],
      );

      const billedRow = await safeReportQuery(
        'dues billing aggregates',
        `
        SELECT
          COALESCE(SUM(CASE WHEN YEAR(due_date) = YEAR(CURDATE()) THEN amount ELSE 0 END), 0) AS billedYtd,
          COALESCE(SUM(CASE WHEN YEAR(due_date) = YEAR(CURDATE()) - 1 THEN amount ELSE 0 END), 0) AS billedPrevYear
        FROM dues_ledger;
        `,
        [],
        [{ billedYtd: 0, billedPrevYear: 0 }],
      );

      const ticketsRow = await safeReportQuery(
        'tickets summary',
        `
        SELECT
          COUNT(*) AS totalTickets,
          SUM(CASE WHEN status IN ('open','triaged','in_progress') THEN 1 ELSE 0 END) AS openTickets,
          SUM(CASE WHEN status IN ('resolved','closed') THEN 1 ELSE 0 END) AS closedTickets
        FROM tickets;
        `,
        [],
        [{ totalTickets: 0, openTickets: 0, closedTickets: 0 }],
      );

      const eventsRow = await safeReportQuery(
        'events summary',
        `
        SELECT
          COUNT(*) AS totalEvents,
          SUM(CASE WHEN start_at >= CURDATE() THEN 1 ELSE 0 END) AS upcomingEvents
        FROM events;
        `,
        [],
        [{ totalEvents: 0, upcomingEvents: 0 }],
      );

      const benefitsRow = await safeReportQuery(
        'benefit requests summary',
        `
        SELECT
          COUNT(*) AS totalRequests,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
          SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) AS denied,
          SUM(CASE WHEN status IN ('submitted','under_review','fulfilled') THEN 1 ELSE 0 END) AS inProgress,
          COALESCE(SUM(CASE WHEN status = 'approved' THEN amount_requested ELSE 0 END), 0) AS totalDisbursed
        FROM benefit_requests;
        `,
        [],
        [{ totalRequests: 0, approved: 0, denied: 0, inProgress: 0, totalDisbursed: 0 }],
      );

      const eventAttendanceRow = await safeReportQuery(
        'event attendance summary',
        `
        SELECT
          COUNT(*) AS totalRegistrations,
          SUM(CASE WHEN status = 'attended' THEN 1 ELSE 0 END) AS totalAttended
        FROM event_registrations;
        `,
        [],
        [{ totalRegistrations: 0, totalAttended: 0 }],
      );

      const duesRow = await safeReportQuery(
        'dues ledger summary',
        `
        SELECT
          COUNT(*) AS totalLedgerEntries,
          COALESCE(SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END), 0) AS arrears,
          SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) AS overdueEntries,
          COUNT(DISTINCT CASE WHEN status = 'overdue' THEN user_id END) AS overdueMembers
        FROM dues_ledger;
        `,
        [],
        [{ totalLedgerEntries: 0, arrears: 0, overdueEntries: 0, overdueMembers: 0 }],
      );

      const collectionsRecentRow = await safeReportQuery(
        'recent collections summary',
        `
        SELECT
          COALESCE(SUM(CASE WHEN paid_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) AS collectedLast30,
          COALESCE(SUM(CASE WHEN paid_at >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND paid_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) AS collectedPrev30
        FROM dues_payments;
        `,
        [],
        [{ collectedLast30: 0, collectedPrev30: 0 }],
      );

      const idCardStatsRow = await safeReportQuery(
        'digital id stats',
        `
          SELECT
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS physicalIssued,
            0 AS activeQueue
          FROM digital_ids;
        `,
        [],
        [{ physicalIssued: 0, activeQueue: 0 }],
      );

      const paymentMethodRows = await safeReportQuery(
        'payment methods summary',
        `
          SELECT
            COALESCE(method, 'unspecified') AS method,
            SUM(amount) AS totalAmount
          FROM dues_payments
          GROUP BY method
          HAVING totalAmount IS NOT NULL;
        `,
        [],
        [],
      );

      let companyCollectionsRows = [];
      let companyBillingRows = [];
      if (trendStartKey) {
        try {
          companyCollectionsRows = await runQuery(
            `SELECT
               CASE WHEN ue.company IS NULL OR ue.company = '' THEN 'Unspecified' ELSE ue.company END AS company,
               COALESCE(SUM(dp.amount), 0) AS collectedAmount,
               COUNT(DISTINCT dl.user_id) AS contributingMembers
             FROM dues_payments dp
             JOIN dues_ledger dl ON dl.id = dp.ledger_id
             JOIN users u ON u.id = dl.user_id
             LEFT JOIN user_employment ue ON ue.user_id = u.id
             WHERE dp.paid_at >= ?
             GROUP BY company
             HAVING collectedAmount > 0;`,
            [trendStartKey],
          );
        } catch (error) {
          companyCollectionsRows = [];
        }

        try {
          companyBillingRows = await runQuery(
            `SELECT
               CASE WHEN ue.company IS NULL OR ue.company = '' THEN 'Unspecified' ELSE ue.company END AS company,
               COALESCE(SUM(dl.amount), 0) AS billedAmount
             FROM dues_ledger dl
             JOIN users u ON u.id = dl.user_id
             LEFT JOIN user_employment ue ON ue.user_id = u.id
             WHERE dl.due_date >= ?
             GROUP BY company
             HAVING billedAmount > 0;`,
            [trendStartKey],
          );
        } catch (error) {
          companyBillingRows = [];
        }
      }

      let unionPositionRows = [];
      let unionPositionError = null;
      try {
        unionPositionRows = await runQuery(`
          SELECT
            position_label AS position,
            COUNT(*) AS memberCount
          FROM (
            SELECT
              CASE
                WHEN NULLIF(TRIM(ue.union_position), '') IS NOT NULL THEN TRIM(ue.union_position)
                ELSE 'Member'
              END AS position_label
            FROM users u
            LEFT JOIN user_employment ue ON ue.user_id = u.id
            WHERE u.status NOT IN ('rejected', 'suspended')
          ) AS derived
          GROUP BY position_label
          HAVING COUNT(*) > 0
          ORDER BY memberCount DESC;
        `);
      } catch (error) {
        unionPositionError = error instanceof Error ? error.message : String(error);
        unionPositionRows = [];
      }

      let tenureYearRows = [];
      let tenureError = null;
      try {
        tenureYearRows = await runQuery(`
          SELECT
            ue.years_employed AS yearsEmployed
          FROM user_employment ue
          JOIN users u ON u.id = ue.user_id
          WHERE u.status NOT IN ('rejected', 'suspended')
            AND ue.years_employed IS NOT NULL;
        `);
      } catch (error) {
        tenureError = error instanceof Error ? error.message : String(error);
        tenureYearRows = [];
      }

      let companyStatsRows;
      try {
        companyStatsRows = await runQuery(COMPANY_STATS_QUERY);
      } catch (error) {
        companyStatsRows = [];
      }

      const companyDistributionRows = await safeReportQuery(
        'company distribution',
        `
        SELECT
          CASE WHEN ue.company IS NULL OR ue.company = '' THEN 'Unspecified' ELSE ue.company END AS company,
          COUNT(DISTINCT u.id) AS memberCount
        FROM users u
        LEFT JOIN user_employment ue ON ue.user_id = u.id
        WHERE u.status = 'approved'
        GROUP BY company
        HAVING memberCount > 0
        ORDER BY memberCount DESC
        LIMIT 8;
        `,
        [],
        [],
      );

      const newJoinersByRange = {
        '7d': safeNumber(membersRow[0]?.newJoiners7d),
        '30d': safeNumber(membersRow[0]?.newJoiners30d),
        '90d': safeNumber(membersRow[0]?.newJoiners90d),
        '12m': safeNumber(membersRow[0]?.newJoiners12m),
      };

      const totalMembers = safeNumber(membersRow[0]?.approvedMembers);
      const totalAllStatuses = safeNumber(membersRow[0]?.totalMembers);
      const inactiveMembers = Math.max(totalAllStatuses - totalMembers, 0);
      const newJoiners30d = newJoinersByRange['30d'];
      const newJoinersPrev30 = safeNumber(membersRow[0]?.newJoinersPrev30);
      const membersGrowthPercent = newJoinersPrev30 > 0
        ? ((newJoiners30d - newJoinersPrev30) / newJoinersPrev30) * 100
        : null;

      const approvedBefore = safeNumber(approvedBeforeRows[0]?.approvedBefore);
      const growthTrendMap = new Map((growthTrendRows || []).map((row) => [row.period, row]));
      let runningApprovedTotal = approvedBefore;
      const growthTrend = growthSeries.map((entry) => {
        const row = growthTrendMap.get(entry.key) || {};
        const newApproved = safeNumber(row.approvedCount);
        const registrations = safeNumber(row.registrations);
        runningApprovedTotal += newApproved;
        return {
          month: entry.key,
          label: entry.label,
          totalMembers: runningApprovedTotal,
          newMembers: newApproved,
          registrations,
        };
      });

      const distributionTotal = companyDistributionRows.reduce((acc, row) => acc + safeNumber(row.memberCount), 0);
      const membersDistribution = companyDistributionRows.map((row) => ({
        company: row.company,
        count: safeNumber(row.memberCount),
      }));
      if (totalMembers > distributionTotal) {
        membersDistribution.push({
          company: 'Others',
          count: totalMembers - distributionTotal,
        });
      }

      const hasMembershipRecords = (safeNumber(membersRow[0]?.totalMembers) ?? 0) > 0
        || (safeNumber(membersRow[0]?.approvedMembers) ?? 0) > 0;

      const unionPositionsRaw = unionPositionRows.map((row) => ({
        label: row.position ?? 'Member',
        value: safeNumber(row.memberCount),
      })).filter((entry) => Number.isFinite(entry.value) && entry.value > 0);
      const hasUnionPositionReal = unionPositionsRaw.length > 0;
      const unionPositions = hasUnionPositionReal
        ? unionPositionsRaw
        : (hasMembershipRecords
          ? []
          : SAMPLE_UNION_POSITION_STATS.map((entry) => ({ ...entry })));
      const unionPositionsSource = hasUnionPositionReal
        ? 'database'
        : (hasMembershipRecords ? 'empty' : 'sample');

      const tenureValues = tenureYearRows
        .map((row) => safeNumber(row.yearsEmployed))
        .filter((value) => Number.isFinite(value) && value >= 0);

      const tenureCounts = new Map(TENURE_BUCKETS_CONFIG.map((bucket) => [bucket.id, 0]));
      tenureValues.forEach((value) => {
        const bucket = TENURE_BUCKETS_CONFIG.find((config, idx) => {
          const meetsMin = config.min == null ? true : value >= config.min;
          const meetsMax = config.max == null ? true : value < config.max;
          if (meetsMin && meetsMax) {
            return true;
          }
          if (config.max == null && value >= config.min) {
            return true;
          }
          return false;
        }) ?? TENURE_BUCKETS_CONFIG[TENURE_BUCKETS_CONFIG.length - 1];
        tenureCounts.set(bucket.id, (tenureCounts.get(bucket.id) ?? 0) + 1);
      });

      const tenureBucketsRaw = TENURE_BUCKETS_CONFIG.map((bucket) => ({
        id: bucket.id,
        label: bucket.label,
        min: bucket.min,
        max: bucket.max,
        value: tenureCounts.get(bucket.id) ?? 0,
      }));
      const hasTenureReal = tenureBucketsRaw.some((bucket) => Number.isFinite(bucket.value) && bucket.value > 0);
      const tenureBuckets = hasTenureReal
        ? tenureBucketsRaw
        : (hasMembershipRecords
          ? tenureBucketsRaw
          : SAMPLE_TENURE_STATS.map((entry) => ({ ...entry })));
      const tenureSource = hasTenureReal
        ? 'database'
        : (hasMembershipRecords ? 'empty' : 'sample');

      const metaWarnings = [];
      if (!hasUnionPositionReal) {
        const reason = unionPositionError
          ? `Union position query failed: ${unionPositionError}`
          : (hasMembershipRecords
            ? 'No union position values recorded for active members.'
            : 'No member records available for union position analytics.');
        metaWarnings.push(hasMembershipRecords
          ? reason
          : `${reason} Showing sample values instead.`);
      }

      if (!hasTenureReal) {
        const reason = tenureError
          ? `Tenure query failed: ${tenureError}`
          : (hasMembershipRecords
            ? 'No tenure values recorded for active members.'
            : 'No member records available for tenure analytics.');
        metaWarnings.push(hasMembershipRecords
          ? reason
          : `${reason} Showing sample values instead.`);
      }

      const demographicsMeta = {
        unionPositions: {
          source: unionPositionsSource,
          hasRealData: hasUnionPositionReal,
          error: unionPositionError,
        },
        tenure: {
          source: tenureSource,
          hasRealData: hasTenureReal,
          error: tenureError,
        },
      };

      let companyStats = mapCompanyStats(companyStatsRows);
      let companyFilters = deriveCompanyFilters(companyStats);

      if (!companyStats.length || !companyFilters.length) {
        companyStats = SAMPLE_MEMBERSHIP_COMPANY_STATS.map((entry) => ({
          ...entry,
          newJoinersByRange: { ...entry.newJoinersByRange },
        }));
        companyFilters = [...SAMPLE_MEMBERSHIP_COMPANY_FILTERS];
      }

      const companyMemberMap = new Map(companyStats.map((entry) => [entry.company ?? 'Unspecified', safeNumber(entry.total)]));
      const collectionsCompanyMap = new Map(
        companyCollectionsRows.map((row) => [
          row.company ?? 'Unspecified',
          {
            collected: safeNumber(row.collectedAmount),
            contributors: safeNumber(row.contributingMembers),
          },
        ]),
      );
      const billingCompanyMap = new Map(
        companyBillingRows.map((row) => [
          row.company ?? 'Unspecified',
          safeNumber(row.billedAmount),
        ]),
      );

      const companyKeys = new Set([
        ...collectionsCompanyMap.keys(),
        ...billingCompanyMap.keys(),
      ]);

      let topCompanies = Array.from(companyKeys).map((company) => {
        const collectionsEntry = collectionsCompanyMap.get(company);
        const collected = safeNumber(collectionsEntry?.collected);
        const billed = safeNumber(billingCompanyMap.get(company));
        const members = safeNumber(
          companyMemberMap.get(company)
            ?? collectionsEntry?.contributors
            ?? 0,
        );
        const collectionRate = billed > 0 ? (collected / billed) * 100 : (collected > 0 ? 100 : null);
        return {
          company,
          collected,
          billed,
          members,
          collectionRate,
        };
      }).filter((entry) => (entry.collected ?? 0) > 0 || (entry.billed ?? 0) > 0);

      topCompanies.sort((a, b) => (b.collected ?? 0) - (a.collected ?? 0));
      topCompanies = topCompanies.slice(0, 5);

      if (!topCompanies.length) {
        topCompanies = SAMPLE_TOP_COMPANIES.map((entry) => ({ ...entry }));
        metaWarnings.push('No company-level dues analytics available; showing sample performance data.');
      }

      const revenueYtd = safeNumber(paymentsRow[0]?.collectedYtd);
      const revenuePrevYear = safeNumber(paymentsRow[0]?.collectedPrevYear);
      const revenueYoYPercent = revenuePrevYear > 0
        ? ((revenueYtd - revenuePrevYear) / revenuePrevYear) * 100
        : (revenueYtd > 0 ? 100 : null);

      const billedYtd = safeNumber(billedRow[0]?.billedYtd);
      const collectionRate = billedYtd > 0 ? (revenueYtd / billedYtd) * 100 : null;
      const collectionNote = collectionRate == null
        ? null
        : collectionRate >= 95
          ? 'Above target'
          : collectionRate >= 85
            ? 'On track'
            : 'Needs attention';

      const approvedMembers = safeNumber(membersRow[0]?.approvedMembers ?? totalMembers);
      const retentionRate = totalAllStatuses > 0 ? (approvedMembers / totalAllStatuses) * 100 : null;
      const newJoinersChange = newJoinersPrev30 > 0
        ? ((newJoiners30d - newJoinersPrev30) / newJoinersPrev30) * 100
        : null;

      const monthlyCollections = safeNumber(collectionsRecentRow[0]?.collectedLast30);
      const monthlyCollectionsPrev = safeNumber(collectionsRecentRow[0]?.collectedPrev30);
      const physicalCards = safeNumber(idCardStatsRow[0]?.physicalIssued);
      const physicalQueue = safeNumber(idCardStatsRow[0]?.activeQueue);
      const assistanceActive = safeNumber(benefitsRow[0]?.inProgress);
      const outstandingDues = Number(duesRow[0]?.arrears ?? 0);
      const overdueEntries = safeNumber(duesRow[0]?.overdueEntries);
      const overdueMembers = safeNumber(duesRow[0]?.overdueMembers);
      const totalLedgerEntries = safeNumber(duesRow[0]?.totalLedgerEntries);

      const methodLabelMap = new Map([
        ['online', 'Online'],
        ['bank_transfer', 'Bank Transfer'],
        ['bank transfer', 'Bank Transfer'],
        ['bank', 'Bank Transfer'],
        ['cash', 'Cash'],
        ['check', 'Check Payment'],
        ['check_payment', 'Check Payment'],
        ['payroll', 'Payroll Deduction'],
        ['payroll_deduction', 'Payroll Deduction'],
      ]);

      const paymentMethodTotals = paymentMethodRows.map((row) => {
        const raw = String(row.method ?? '').trim();
        const normalizedKey = raw.toLowerCase();
        const amount = safeNumber(row.totalAmount);
        const label = methodLabelMap.get(normalizedKey)
          ?? (raw ? raw.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unspecified');
        return {
          key: normalizedKey || 'unspecified',
          label,
          amount,
        };
      }).filter((entry) => Number.isFinite(entry.amount) && entry.amount >= 0);

      const paymentMethodTotalAmount = paymentMethodTotals.reduce((acc, entry) => acc + entry.amount, 0);
      const paymentMethods = paymentMethodTotals.map((entry) => ({
        method: entry.key,
        label: entry.label,
        amount: entry.amount,
        percent: paymentMethodTotalAmount > 0 ? (entry.amount / paymentMethodTotalAmount) * 100 : 0,
      }));

      const collectedSeriesMap = new Map(collectionSeriesRows.map((row) => [row.period, safeNumber(row.totalCollected)]));
      const billedSeriesMap = new Map(billedSeriesRows.map((row) => [row.period, safeNumber(row.totalBilled)]));
      const sampleSeriesMap = new Map(SAMPLE_COLLECTION_SERIES.map((item) => [item.month, item]));

      let collectionSeries = growthSeries.map((entry, index) => {
        const monthKey = entry.key;
        const fallback = sampleSeriesMap.get(monthKey) ?? null;
        let label = entry.label ?? entry.month ?? fallback?.label ?? null;
        if (!label && monthKey) {
          const parsed = new Date(monthKey);
          if (!Number.isNaN(parsed.getTime())) {
            label = parsed.toLocaleString('en-US', { month: 'short' });
          }
        }
        if (!label) {
          label = `M${index + 1}`;
        }

        const collectedValue = collectedSeriesMap.has(monthKey)
          ? collectedSeriesMap.get(monthKey)
          : null;
        const billedValue = billedSeriesMap.has(monthKey)
          ? billedSeriesMap.get(monthKey)
          : null;

        return {
          month: monthKey,
          label,
          collected: Number.isFinite(collectedValue) ? collectedValue : 0,
          billed: Number.isFinite(billedValue) ? billedValue : 0,
        };
      });

      const hasCollectionSeriesReal = collectionSeries.some((entry) => (entry.collected ?? 0) > 0 || (entry.billed ?? 0) > 0);
      if (!hasCollectionSeriesReal) {
        collectionSeries = growthSeries.map((entry, index) => {
          const monthKey = entry.key;
          const fallback = sampleSeriesMap.get(monthKey) ?? SAMPLE_COLLECTION_SERIES[index % SAMPLE_COLLECTION_SERIES.length];
          const label = entry.label ?? fallback?.label ?? `M${index + 1}`;
          return {
            month: monthKey,
            label,
            collected: safeNumber(fallback?.collected),
            billed: safeNumber(fallback?.billed),
          };
        });
        collectionDiagnostics.source = 'sample';
        collectionDiagnostics.fallbackApplied = true;
        if (!collectionSeriesRows.length && !billedSeriesRows.length) {
          collectionDiagnostics.fallbackReason = 'No dues payments or billing entries were found for the last 8 months.';
        } else if (!collectionSeriesRows.length) {
          collectionDiagnostics.fallbackReason = 'No dues payments were recorded for the last 8 months.';
        } else if (!billedSeriesRows.length) {
          collectionDiagnostics.fallbackReason = 'No dues billing entries were found for the last 8 months.';
        } else {
          collectionDiagnostics.fallbackReason = 'Dues payments and billing totals were zero for the last 8 months.';
        }
        if (collectionDiagnostics.fallbackReason) {
          collectionDiagnostics.issues.push(collectionDiagnostics.fallbackReason);
          metaWarnings.push(`${collectionDiagnostics.fallbackReason} Showing sample collection trend.`);
        } else {
          metaWarnings.push('Showing sample dues collection trend due to missing records.');
        }
      } else {
        const billingWithoutCollection = collectionSeries
          .filter((entry) => entry.billed > 0 && entry.collected === 0)
          .map((entry) => entry.label);
        if (billingWithoutCollection.length) {
          const warning = `Billing exists without matching collections for: ${billingWithoutCollection.join(', ')}.`;
          collectionDiagnostics.issues.push(warning);
          metaWarnings.push(warning);
        }
        if (collectionDiagnostics.paymentsPeriods > 0 && collectionDiagnostics.paymentsWithAmounts === 0) {
          const warning = 'Dues payments exist for the selected period but amounts were recorded as zero.';
          collectionDiagnostics.issues.push(warning);
          metaWarnings.push(warning);
        }
        if (collectionDiagnostics.ledgerPeriods > 0 && collectionDiagnostics.ledgerWithAmounts === 0) {
          const warning = 'Dues ledger entries exist for the selected period but billed amounts were zero.';
          collectionDiagnostics.issues.push(warning);
          metaWarnings.push(warning);
        }
      }

      collectionDiagnostics.seriesDetails = collectionSeries.map((entry) => ({
        month: entry.month,
        label: entry.label,
        collected: entry.collected,
        billed: entry.billed,
      }));
      collectionDiagnostics.realMonths = collectionSeries.filter((entry) => (entry.collected ?? 0) > 0).length;
      collectionDiagnostics.targetMonths = collectionSeries.filter((entry) => (entry.billed ?? 0) > 0).length;

      const attendanceRate = safeNumber(eventAttendanceRow[0]?.totalRegistrations) > 0
        ? (safeNumber(eventAttendanceRow[0]?.totalAttended) / safeNumber(eventAttendanceRow[0]?.totalRegistrations)) * 100
        : 0;

      const registrationStatsRow = await safeReportQuery(
        'registration status summary',
        `
          SELECT
            SUM(CASE WHEN status IN ('pending', 'under_review', 'email_verified') THEN 1 ELSE 0 END) AS pendingCount,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejectedCount,
            COUNT(*) AS totalCount
          FROM users;
        `,
        [],
        EMPTY_REGISTRATION_STATS_ROW,
      );

      const registrationProcessingRow = await safeReportQuery(
        'registration processing durations',
        `
          SELECT
            AVG(TIMESTAMPDIFF(HOUR, rf.submitted_at, decision.decision_at)) AS avgHours,
            COUNT(*) AS completedDecisions
          FROM registration_forms rf
          JOIN (
            SELECT
              rr.user_id,
              MAX(CASE WHEN rr.status IN ('approved', 'rejected') THEN rr.created_at END) AS decision_at
            FROM registration_reviews rr
            GROUP BY rr.user_id
          ) AS decision ON decision.user_id = rf.user_id
          WHERE decision.decision_at IS NOT NULL
            AND rf.submitted_at IS NOT NULL;
        `,
      );

      const registrationDuplicateRow = await safeReportQuery(
        'registration duplicate detection',
        `
          SELECT
            IFNULL(SUM(dup_count), 0) AS duplicateRecords,
            IFNULL(SUM(dup_count) - COUNT(*), 0) AS excessRecords,
            COUNT(*) AS duplicateGroups
          FROM (
            SELECT COUNT(*) AS dup_count
            FROM users u
            JOIN user_profiles up ON up.user_id = u.id
            WHERE u.status IN ('pending', 'under_review', 'email_verified', 'approved')
            GROUP BY LOWER(TRIM(CONCAT_WS(' ', up.first_name, up.last_name))), up.date_of_birth
            HAVING COUNT(*) > 1
          ) AS derived;
        `,
      );

      const systemTableHealthRow = await safeReportQuery(
        'system health table coverage',
        `
          SELECT
            SUM(CASE WHEN total_rows > 0 THEN 1 ELSE 0 END) AS populatedTables,
            COUNT(*) AS totalTables
          FROM (
            SELECT 'users' AS table_name, COUNT(*) AS total_rows FROM users
            UNION ALL SELECT 'registration_forms', COUNT(*) FROM registration_forms
            UNION ALL SELECT 'registration_reviews', COUNT(*) FROM registration_reviews
            UNION ALL SELECT 'dues_ledger', COUNT(*) FROM dues_ledger
            UNION ALL SELECT 'benefit_requests', COUNT(*) FROM benefit_requests
            UNION ALL SELECT 'events', COUNT(*) FROM events
          ) AS tableset;
        `,
      );

      const systemStorageRow = await safeReportQuery(
        'system health storage usage',
        `
          SELECT
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS usedMb
          FROM information_schema.tables
          WHERE table_schema = DATABASE();
        `,
      );

      const systemStatusRows = await safeReportQuery(
        'system health status',
        `SHOW GLOBAL STATUS WHERE Variable_name IN ('Questions', 'Uptime')`);

      const aiMetricsRows = await safeReportQuery(
        'ai metrics summary',
        `
          SELECT setting_value, updated_at
          FROM system_settings
          WHERE category = 'ai' AND setting_key = 'metrics'
          ORDER BY updated_at DESC
          LIMIT 1;
        `,
      );

      const aiMetricsRaw = (() => {
        const row = aiMetricsRows[0];
        if (!row || row.setting_value == null) {
          return {};
        }
        if (typeof row.setting_value === 'object' && row.setting_value !== null) {
          return row.setting_value;
        }
        try {
          return JSON.parse(row.setting_value);
        } catch (error) {
          logQueryWarning('ai metrics parse', error);
          return {};
        }
      })();

      const aiMetricsUpdatedAt = aiMetricsRows[0]?.updated_at ?? aiMetricsRows[0]?.updatedAt;

      const reportBuilderSettingsRows = await safeReportQuery(
        'report builder settings',
        `
          SELECT setting_key, setting_value
          FROM system_settings
          WHERE category = 'reports'
            AND setting_key IN ('reportTypes', 'dateRanges', 'filters', 'formats');
        `,
      );

      const reportBuilderRaw = reportBuilderSettingsRows.reduce((accumulator, row) => {
        if (!row) {
          return accumulator;
        }
        const key = row.setting_key ?? row.settingKey;
        if (!key) {
          return accumulator;
        }
        let parsed = row.setting_value ?? row.settingValue;
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch (error) {
            logQueryWarning(`report builder setting parse (${key})`, error);
          }
        }
        accumulator[key] = parsed;
        return accumulator;
      }, {});

      const pendingReviews = safeNumber(registrationStatsRow[0]?.pendingCount, 0);
      const approvedCount = safeNumber(registrationStatsRow[0]?.approvedCount, 0);
      const rejectedCount = safeNumber(registrationStatsRow[0]?.rejectedCount, 0);
      const totalRegistrationsTracked = safeNumber(registrationStatsRow[0]?.totalCount, 0);
      const totalDecided = approvedCount + rejectedCount;
      const approvalRateRaw = totalDecided > 0 ? (approvedCount / totalDecided) * 100 : null;

      const avgProcessingHours = safeNumber(registrationProcessingRow[0]?.avgHours, null);
      const completedDecisions = safeNumber(registrationProcessingRow[0]?.completedDecisions, 0);

      const duplicateDetectionsRaw = Math.max(0, safeNumber(registrationDuplicateRow[0]?.excessRecords, 0));
      const duplicateGroups = safeNumber(registrationDuplicateRow[0]?.duplicateGroups, 0);

      const populatedTables = safeNumber(systemTableHealthRow[0]?.populatedTables, null);
      const totalTrackedTables = safeNumber(systemTableHealthRow[0]?.totalTables, null);
      const storageUsedMb = safeNumber(systemStorageRow[0]?.usedMb, null);

      const statusMap = systemStatusRows.reduce((accumulator, row) => {
        const key = (row.Variable_name || row.VariableName || row.variable_name || '').toLowerCase();
        if (!key) {
          return accumulator;
        }
        const valueCandidate = Number(row.Value ?? row.value ?? row.VARIABLE_VALUE ?? row.variable_value);
        if (Number.isFinite(valueCandidate)) {
          accumulator[key] = valueCandidate;
        }
        return accumulator;
      }, {});

      const uptimeSeconds = Number.isFinite(statusMap.uptime) ? statusMap.uptime : null;
      const questionsCount = Number.isFinite(statusMap.questions) ? statusMap.questions : null;
      const queriesPerSecond = uptimeSeconds && uptimeSeconds > 0 && questionsCount != null
        ? questionsCount / uptimeSeconds
        : null;

      const formatDurationLabel = (hoursValue) => {
        if (!Number.isFinite(hoursValue) || hoursValue <= 0) {
          return null;
        }
        const totalMinutes = hoursValue * 60;
        if (totalMinutes >= 1440) {
          const daysRaw = totalMinutes / 1440;
          const digits = daysRaw >= 10 ? 0 : 1;
          const daysValue = Number(daysRaw.toFixed(digits));
          return `${daysValue} day${daysValue === 1 ? '' : 's'}`;
        }
        if (totalMinutes >= 120) {
          const hoursRaw = totalMinutes / 60;
          const digits = hoursRaw >= 10 ? 0 : 1;
          const hoursValueRounded = Number(hoursRaw.toFixed(digits));
          return `${hoursValueRounded} hr${hoursValueRounded === 1 ? '' : 's'}`;
        }
        const roundedMinutes = Math.max(1, Math.round(totalMinutes));
        return `${roundedMinutes} min${roundedMinutes === 1 ? '' : 's'}`;
      };

      const formatUptimeLabel = (secondsValue) => {
        if (!Number.isFinite(secondsValue) || secondsValue <= 0) {
          return null;
        }
        const days = Math.floor(secondsValue / 86400);
        const hours = Math.floor((secondsValue % 86400) / 3600);
        const minutes = Math.floor((secondsValue % 3600) / 60);
        if (days >= 7) {
          const weeks = Math.floor(days / 7);
          const remainingDays = days % 7;
          return `${weeks}w${remainingDays ? ` ${remainingDays}d` : ''} uptime`;
        }
        if (days >= 1) {
          return `${days}d ${hours}h uptime`;
        }
        if (hours >= 1) {
          return `${hours}h ${minutes}m uptime`;
        }
        return `${Math.max(1, Math.floor(secondsValue / 60))}m uptime`;
      };

      const approvalRate = approvalRateRaw != null ? Number(approvalRateRaw.toFixed(1)) : null;
      const avgProcessingTime = formatDurationLabel(avgProcessingHours);
      const avgProcessingMeta = avgProcessingTime && completedDecisions > 0
        ? `${completedDecisions.toLocaleString()} decisions`
        : completedDecisions > 0
          ? `${completedDecisions.toLocaleString()} decisions`
          : null;

      const duplicatePercent = duplicateDetectionsRaw > 0 && totalRegistrationsTracked > 0
        ? (duplicateDetectionsRaw / totalRegistrationsTracked) * 100
        : null;
      const duplicateMeta = duplicateDetectionsRaw > 0 && duplicatePercent != null
        ? `${duplicatePercent.toFixed(1)}% flagged`
        : (duplicateGroups === 0 && totalRegistrationsTracked > 0)
          ? 'No duplicates detected'
          : null;

      const databaseHealthValue = totalTrackedTables && totalTrackedTables > 0
        ? (populatedTables / totalTrackedTables) * 100
        : null;
      const databaseHealthMeta = Number.isFinite(populatedTables) && Number.isFinite(totalTrackedTables) && totalTrackedTables > 0
        ? `${populatedTables}/${totalTrackedTables} core tables with data`
        : null;

      const assumedCapacityMb = 2048;
      const storageUsageValue = Number.isFinite(storageUsedMb)
        ? Math.min(99.9, (storageUsedMb / assumedCapacityMb) * 100)
        : null;
      const storageUsageMeta = Number.isFinite(storageUsedMb)
        ? `${storageUsedMb.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB used`
        : null;

      const apiResponseTimeValue = queriesPerSecond && queriesPerSecond > 0
        ? Math.round(Math.min(800, Math.max(40, (1 / queriesPerSecond) * 1000)))
        : null;
      const apiResponseTimeMeta = queriesPerSecond && queriesPerSecond > 0
        ? `${queriesPerSecond >= 10 ? queriesPerSecond.toFixed(0) : queriesPerSecond.toFixed(1)} q/s`
        : null;

      const uptimePercentValue = uptimeSeconds && uptimeSeconds > 0
        ? Math.min(99.9, (uptimeSeconds / (30 * 24 * 60 * 60)) * 100)
        : null;
      const uptimeMeta = formatUptimeLabel(uptimeSeconds);

      const normalizePercent = (value) => {
        if (value == null) {
          return null;
        }
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
          return null;
        }
        if (Math.abs(numeric) <= 1) {
          return numeric * 100;
        }
        return numeric;
      };

      const autoAssignRateValue = normalizePercent(aiMetricsRaw.autoAssignRate ?? aiMetricsRaw.auto_assign_rate);
      const autoAssignTrendValue = normalizePercent(aiMetricsRaw.autoAssignTrend);
      const autoAssignMetaExplicit = typeof aiMetricsRaw.autoAssignRateMeta === 'string' ? aiMetricsRaw.autoAssignRateMeta.trim() : null;

      const avgConfidencePercentValue = normalizePercent(
        aiMetricsRaw.avgConfidencePercent ?? aiMetricsRaw.avgConfidence ?? aiMetricsRaw.averageConfidence,
      );
      const avgConfidenceTrendValue = normalizePercent(aiMetricsRaw.avgConfidenceTrend ?? aiMetricsRaw.confidenceTrend);
      const avgConfidenceMetaExplicit = typeof aiMetricsRaw.avgConfidenceMeta === 'string' ? aiMetricsRaw.avgConfidenceMeta.trim() : null;

      const overrideRateValue = normalizePercent(aiMetricsRaw.overrideRate ?? aiMetricsRaw.override_rate);
      const overrideTrendValueRaw = normalizePercent(aiMetricsRaw.overrideTrend);
      const overrideMetaExplicit = typeof aiMetricsRaw.overrideRateMeta === 'string' ? aiMetricsRaw.overrideRateMeta.trim() : null;

      const timeSavedHoursValue = (() => {
        const explicitHours = aiMetricsRaw.timeSavedPerDayHours ?? aiMetricsRaw.timeSavedHours;
        if (explicitHours != null && Number.isFinite(Number(explicitHours))) {
          return Number(explicitHours);
        }
        if (aiMetricsRaw.timeSavedMinutes != null && Number.isFinite(Number(aiMetricsRaw.timeSavedMinutes))) {
          return Number(aiMetricsRaw.timeSavedMinutes) / 60;
        }
        if (aiMetricsRaw.timeSavedPerDayMinutes != null && Number.isFinite(Number(aiMetricsRaw.timeSavedPerDayMinutes))) {
          return Number(aiMetricsRaw.timeSavedPerDayMinutes) / 60;
        }
        if (aiMetricsRaw.timeSaved != null && Number.isFinite(Number(aiMetricsRaw.timeSaved))) {
          const candidate = Number(aiMetricsRaw.timeSaved);
          return candidate > 24 ? candidate / 60 : candidate;
        }
        return null;
      })();

      const timeSavedTrendValue = normalizePercent(aiMetricsRaw.timeSavedTrend);
      const timeSavedMetaExplicit = typeof aiMetricsRaw.timeSavedMeta === 'string' ? aiMetricsRaw.timeSavedMeta.trim() : null;

      const lastUpdatedLabel = formatRelativeTime(aiMetricsUpdatedAt);

      const formatTrendMeta = (value, explicitMeta) => {
        if (explicitMeta) {
          return explicitMeta;
        }
        if (Number.isFinite(value)) {
          const digits = Math.abs(value) >= 10 ? 0 : 1;
          const sign = value >= 0 ? '+' : '-';
          return `${sign}${Math.abs(value).toFixed(digits)}% vs last period`;
        }
        return lastUpdatedLabel;
      };

      const autoAssignMeta = formatTrendMeta(autoAssignTrendValue, autoAssignMetaExplicit);
      const avgConfidenceMeta = formatTrendMeta(avgConfidenceTrendValue, avgConfidenceMetaExplicit);

      const overrideMeta = (() => {
        if (overrideMetaExplicit) {
          return overrideMetaExplicit;
        }
        if (Number.isFinite(overrideTrendValueRaw)) {
          const digits = Math.abs(overrideTrendValueRaw) >= 10 ? 0 : 1;
          const sign = overrideTrendValueRaw >= 0 ? '+' : '-';
          return `${sign}${Math.abs(overrideTrendValueRaw).toFixed(digits)}% vs last period`;
        }
        return lastUpdatedLabel;
      })();

      const timeSavedMeta = timeSavedMetaExplicit ?? (Number.isFinite(timeSavedTrendValue)
        ? formatTrendMeta(timeSavedTrendValue, null)
        : (timeSavedHoursValue != null ? 'Per admin day' : lastUpdatedLabel));

      const autoAssignTone = (() => {
        if (typeof aiMetricsRaw.autoAssignRateTone === 'string') {
          return aiMetricsRaw.autoAssignRateTone;
        }
        if (Number.isFinite(autoAssignTrendValue)) {
          return autoAssignTrendValue >= 0 ? 'positive' : 'negative';
        }
        return null;
      })();

      const avgConfidenceTone = (() => {
        if (typeof aiMetricsRaw.avgConfidenceTone === 'string') {
          return aiMetricsRaw.avgConfidenceTone;
        }
        if (Number.isFinite(avgConfidenceTrendValue)) {
          return avgConfidenceTrendValue >= 0 ? 'positive' : 'negative';
        }
        return null;
      })();

      const overrideTone = (() => {
        if (typeof aiMetricsRaw.overrideRateTone === 'string') {
          return aiMetricsRaw.overrideRateTone;
        }
        if (Number.isFinite(overrideTrendValueRaw)) {
          return overrideTrendValueRaw <= 0 ? 'positive' : 'negative';
        }
        return null;
      })();

      const timeSavedTone = (() => {
        if (typeof aiMetricsRaw.timeSavedTone === 'string') {
          return aiMetricsRaw.timeSavedTone;
        }
        if (Number.isFinite(timeSavedTrendValue)) {
          return timeSavedTrendValue >= 0 ? 'positive' : 'negative';
        }
        if (timeSavedHoursValue != null) {
          return timeSavedHoursValue > 0 ? 'positive' : 'neutral';
        }
        return null;
      })();

      const aiSectionHasRecords = [
        autoAssignRateValue,
        avgConfidencePercentValue,
        overrideRateValue,
        timeSavedHoursValue,
      ].some((value) => Number.isFinite(value) && value !== null);

      const aiSection = aiSectionHasRecords
        ? {
            autoAssignRate: Number.isFinite(autoAssignRateValue) ? Number(autoAssignRateValue.toFixed(1)) : null,
            autoAssignRateMeta: autoAssignMeta,
            autoAssignRateTone: autoAssignTone,
            avgConfidence: Number.isFinite(avgConfidencePercentValue) ? Number(avgConfidencePercentValue.toFixed(1)) : null,
            avgConfidenceMeta,
            avgConfidenceTone,
            overrideRate: Number.isFinite(overrideRateValue) ? Number(overrideRateValue.toFixed(1)) : null,
            overrideRateMeta: overrideMeta,
            overrideRateTone: overrideTone,
            timeSavedPerDayHours: Number.isFinite(timeSavedHoursValue) ? Number(timeSavedHoursValue.toFixed(2)) : null,
            timeSavedMeta,
            timeSavedTone,
          }
        : { ...SAMPLE_AI_METRICS };

      const normalizedReportBuilder = {
        reportTypes: normalizeOptionList(reportBuilderRaw.reportTypes, SAMPLE_REPORT_BUILDER.reportTypes),
        dateRanges: normalizeOptionList(reportBuilderRaw.dateRanges, SAMPLE_REPORT_BUILDER.dateRanges),
        filters: normalizeOptionList(reportBuilderRaw.filters, SAMPLE_REPORT_BUILDER.filters),
        formats: normalizeOptionList(reportBuilderRaw.formats, SAMPLE_REPORT_BUILDER.formats),
      };

      const reportBuilderHasRecords = reportBuilderSettingsRows.length > 0
        && (
          (Array.isArray(reportBuilderRaw.reportTypes) && reportBuilderRaw.reportTypes.length)
          || (Array.isArray(reportBuilderRaw.dateRanges) && reportBuilderRaw.dateRanges.length)
          || (Array.isArray(reportBuilderRaw.filters) && reportBuilderRaw.filters.length)
          || (Array.isArray(reportBuilderRaw.formats) && reportBuilderRaw.formats.length)
          || (reportBuilderRaw.reportTypes && typeof reportBuilderRaw.reportTypes === 'object')
          || (reportBuilderRaw.dateRanges && typeof reportBuilderRaw.dateRanges === 'object')
          || (reportBuilderRaw.filters && typeof reportBuilderRaw.filters === 'object')
          || (reportBuilderRaw.formats && typeof reportBuilderRaw.formats === 'object')
        );

      const reportBuilderSection = reportBuilderHasRecords
        ? normalizedReportBuilder
        : { ...SAMPLE_REPORT_BUILDER };

      const meta = {
        isSample: false,
        warnings: metaWarnings,
        diagnostics: demographicsMeta,
      };

      if (metaWarnings.length) {
        meta.alertType = 'warning';
        meta.alertMessage = metaWarnings[0];
      }

      const registrationHasRecords = totalRegistrationsTracked > 0 || completedDecisions > 0 || duplicateDetectionsRaw > 0;

      const registrationSection = registrationHasRecords
        ? {
            avgProcessingTime: avgProcessingTime ?? null,
            avgProcessingMeta: avgProcessingMeta,
            approvalRate,
            approvalRateMeta: approvalRate != null && totalDecided > 0
              ? `${totalDecided.toLocaleString()} decisions`
              : null,
            pendingReviews,
            pendingReviewsMeta: Number.isFinite(pendingReviews)
              ? (pendingReviews > 0 ? 'Pending + under review' : 'No queued registrations')
              : null,
            duplicateDetections: duplicateDetectionsRaw,
            duplicateDetectionsMeta: duplicateMeta,
          }
        : { ...SAMPLE_REGISTRATION_METRICS };

      const systemHealthHasData = Number.isFinite(databaseHealthValue)
        || Number.isFinite(apiResponseTimeValue)
        || Number.isFinite(storageUsageValue)
        || Number.isFinite(uptimePercentValue);

      const systemHealthSection = systemHealthHasData
        ? {
            databaseHealth: Number.isFinite(databaseHealthValue)
              ? Number(databaseHealthValue.toFixed(databaseHealthValue >= 100 || databaseHealthValue === 0 ? 0 : 1))
              : null,
            databaseHealthMeta,
            apiResponseTime: Number.isFinite(apiResponseTimeValue) ? apiResponseTimeValue : null,
            apiResponseTimeMeta,
            storageUsage: Number.isFinite(storageUsageValue)
              ? Number(storageUsageValue.toFixed(storageUsageValue >= 100 || storageUsageValue === 0 ? 0 : 1))
              : null,
            storageUsageMeta,
            uptime: Number.isFinite(uptimePercentValue)
              ? Number(uptimePercentValue.toFixed(uptimePercentValue >= 100 || uptimePercentValue === 0 ? 0 : 1))
              : null,
            uptimeMeta,
          }
        : { ...SAMPLE_SYSTEM_HEALTH };

      const payload = {
        meta,
        registration: registrationSection,
        systemHealth: systemHealthSection,
        ai: aiSection,
        reportBuilder: reportBuilderSection,
        members: {
          total: totalMembers,
          totalAllStatuses,
          inactive: inactiveMembers,
          newJoiners30d,
          newJoinersPrev30,
          newJoinersByRange,
          growthPercent: membersGrowthPercent,
          activeEmployers: safeNumber(activeEmployersRow[0]?.activeEmployers),
          payingEmployers: safeNumber(payingEmployersRow[0]?.payingEmployers),
          retentionRate,
          newJoinersChange,
          growthTrend,
          distribution: membersDistribution,
          companyFilters,
          companyStats,
          demographics: {
            unionPositions,
            tenure: tenureBuckets,
            tenureBuckets,
            meta: demographicsMeta,
          },
        },
        financial: {
          revenueYtd,
          revenuePrevYear,
          revenueYoYPercent,
          collectionRate,
          collectionNote,
          billedYtd,
          collectedYtd: revenueYtd,
          monthlyCollections,
          monthlyCollectionsPrev,
          collectionSeries,
          collectionDiagnostics,
          topCompanies,
          paymentMethods,
        },
        tickets: {
          total: safeNumber(ticketsRow[0]?.totalTickets),
          open: safeNumber(ticketsRow[0]?.openTickets),
          closed: safeNumber(ticketsRow[0]?.closedTickets),
        },
        events: {
          total: safeNumber(eventsRow[0]?.totalEvents),
          upcoming: safeNumber(eventsRow[0]?.upcomingEvents),
          attendanceRate,
        },
        benefits: {
          totalRequests: safeNumber(benefitsRow[0]?.totalRequests),
          approved: safeNumber(benefitsRow[0]?.approved),
          denied: safeNumber(benefitsRow[0]?.denied),
          inProgress: assistanceActive,
          totalDisbursed: safeNumber(benefitsRow[0]?.totalDisbursed),
        },
        dues: {
          entries: totalLedgerEntries,
          arrears: outstandingDues,
          overdueEntries,
          overdueMembers,
        },
        performance: {
          membership: [
            {
              label: 'Active Members',
              value: approvedMembers,
              format: 'count',
              meta: totalAllStatuses > 0 ? `${((approvedMembers / totalAllStatuses) * 100).toFixed(1)}% of records active` : null,
            },
            {
              label: 'New Registrations (30d)',
              value: newJoiners30d,
              format: 'count',
              meta: newJoinersChange != null ? `${newJoinersChange >= 0 ? '+' : ''}${newJoinersChange.toFixed(1)}% vs prior 30d` : null,
            },
            {
              label: 'Retention Rate',
              value: retentionRate,
              format: 'percent',
              meta: 'Approved vs all member records',
            },
          ],
          financial: [
            {
              label: 'Monthly Collections',
              value: monthlyCollections,
              format: 'currency',
              meta: 'Collected in the last 30 days',
            },
            {
              label: 'Outstanding Dues',
              value: outstandingDues,
              format: 'currency',
              meta: 'Ledger entries flagged overdue',
            },
            {
              label: 'Collection Efficiency',
              value: collectionRate,
              format: 'percent',
              meta: collectionNote,
            },
          ],
          operations: [
            {
              label: 'Physical Cards',
              value: physicalCards,
              format: 'count',
              meta: totalMembers > 0 ? `${((physicalCards / totalMembers) * 100).toFixed(1)}% of members` : 'Queue size unavailable',
            },
            {
              label: 'Assistance Beneficiaries',
              value: safeNumber(benefitsRow[0]?.approved),
              format: 'count',
              meta: `${formatCurrency(safeNumber(benefitsRow[0]?.totalDisbursed))} disbursed`,
            },
            {
              label: 'Events This Year',
              value: safeNumber(eventsRow[0]?.totalEvents),
              format: 'count',
              meta: `${attendanceRate.toFixed(0)}% avg attendance`,
            },
          ],
        },
      };

      const hasRealData = (
        (payload.members.total ?? 0) > 0
        || (payload.members.totalAllStatuses ?? 0) > 0
        || hasUnionPositionReal
        || hasTenureReal
        || (payload.financial.revenueYtd ?? 0) > 0
        || (payload.tickets.total ?? 0) > 0
        || (payload.events.total ?? 0) > 0
        || (payload.benefits.totalRequests ?? 0) > 0
        || (payload.dues.entries ?? 0) > 0
        || registrationHasRecords
        || systemHealthHasData
        || aiSectionHasRecords
        || reportBuilderHasRecords
      );

      if (!hasRealData) {
        res.json(buildSampleSummaryPayload('No live analytics records available; showing sample dashboard.', { type: 'info', diagnostics: { metaWarnings } }));
        return;
      }

      res.json(payload);
    } catch (error) {
      console.error('[reports] summary route failed:', error);
      const fallbackPayload = buildSampleSummaryPayload('Unable to reach the analytics data store; showing sample dashboard.', {
        type: 'error',
        error: error.message,
      });
      res.status(200).json(fallbackPayload);
    }
  });

  router.get('/reports/membership-export', async (req, res) => {
    const rangeParam = typeof req.query.range === 'string' ? req.query.range : '30d';
    const companyParamRaw = typeof req.query.company === 'string' ? req.query.company : '';
    const rangeKey = Object.prototype.hasOwnProperty.call(MEMBERSHIP_RANGE_CONFIG, rangeParam) ? rangeParam : '30d';
    const rangeConfig = MEMBERSHIP_RANGE_CONFIG[rangeKey];
    const companyParam = companyParamRaw && companyParamRaw.toLowerCase() !== 'all'
      ? companyParamRaw.trim()
      : null;

    try {
      const rows = await runQuery(COMPANY_STATS_QUERY);
      let stats = mapCompanyStats(rows);
      if (!stats.length) {
        stats = SAMPLE_MEMBERSHIP_COMPANY_STATS.map((entry) => ({
          ...entry,
          newJoinersByRange: { ...entry.newJoinersByRange },
        }));
      }

      let filteredStats = stats;
      if (companyParam) {
        filteredStats = stats.filter((entry) => (entry.company ?? '').toLowerCase() === companyParam.toLowerCase());
        if (!filteredStats.length) {
          filteredStats = SAMPLE_MEMBERSHIP_COMPANY_STATS.filter((entry) => entry.company.toLowerCase() === companyParam.toLowerCase())
            .map((entry) => ({ ...entry, newJoinersByRange: { ...entry.newJoinersByRange } }));
        }
      }

      if (!filteredStats.length) {
        filteredStats = SAMPLE_MEMBERSHIP_COMPANY_STATS.map((entry) => ({
          ...entry,
          newJoinersByRange: { ...entry.newJoinersByRange },
        }));
      }

      const header = ['Company', 'Active Members', 'Inactive Members', 'Total Members', `New Members (${rangeConfig.label})`, 'Retention Rate'];
      const csvRows = filteredStats.map((entry) => {
        const inactiveValue = entry.inactive ?? Math.max((entry.totalAllStatuses ?? 0) - (entry.total ?? 0), 0);
        const totalValue = entry.totalAllStatuses ?? entry.total ?? 0;
        const newMembersValue = entry.newJoinersByRange?.[rangeKey] ?? 0;
        const retentionValue = entry.retentionRate != null ? Number(entry.retentionRate).toFixed(1) : '';
        return [
          escapeCsvValue(entry.company),
          escapeCsvValue(entry.total ?? 0),
          escapeCsvValue(inactiveValue),
          escapeCsvValue(totalValue),
          escapeCsvValue(newMembersValue),
          escapeCsvValue(retentionValue),
        ].join(',');
      });

      const csvContent = [
        header.map((value) => escapeCsvValue(value)).join(','),
        ...csvRows,
      ].join('\n');

      const companySlug = companyParam
        ? companyParam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'selection'
        : 'all';
      const fileName = `membership_report_${rangeKey}_${companySlug}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: 'Unable to export membership report', error: error.message });
    }
  });

  // example: simple CSV-style export endpoint for tickets (paginated)
  router.get('/reports/tickets', async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(1000, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 500));
    const offset = (page - 1) * pageSize;

    try {
      const rows = await runQuery(
        `SELECT t.id, t.ticket_no AS ticketNo, t.subject, t.category, t.priority, t.status, t.created_at AS createdAt, u.email AS userEmail
         FROM tickets t
         LEFT JOIN users u ON u.id = t.user_id
         ORDER BY t.created_at DESC
         LIMIT ? OFFSET ?;`,
        [pageSize, offset],
      );

      res.json({ meta: { page, pageSize, count: rows.length }, results: rows });
    } catch (error) {
      res.status(500).json({ message: 'Unable to load tickets for report', error: error.message });
    }
  });
};

export default registerReportsRoutes;
