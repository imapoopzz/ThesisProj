import { useMemo, useState, useEffect } from "react";
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  Download,
  Filter,
  LineChart,
  PieChart,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import "../styles/admin-base.css";
import api from "../api/admin";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "membership", label: "Membership" },
  { id: "financial", label: "Financial" },
  { id: "operations", label: "Operations" },
  { id: "custom", label: "Custom Reports" },
];
const exportHistory = [];

const DEFAULT_REPORT_BUILDER_OPTIONS = {
  reportTypes: [
    { value: "membership", label: "Membership Report" },
    { value: "financial", label: "Financial Report" },
    { value: "events", label: "Event Attendance" },
    { value: "benefits", label: "Benefits & Attendance" },
    { value: "ai-analytics", label: "AI Analytics Report" },
    { value: "ai-audit", label: "AI Audit Trial" },
  ],
  dateRanges: [
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "quarter", label: "Last 3 months" },
    { value: "year", label: "Last 12 months" },
  ],
  filters: [
    { value: "company", label: "By company" },
    { value: "union", label: "By union position" },
    { value: "status", label: "By status" },
    { value: "region", label: "By region" },
  ],
  formats: [
    { value: "pdf", label: "PDF report" },
    { value: "excel", label: "Excel spreadsheet" },
    { value: "csv", label: "CSV file" },
    { value: "dashboard", label: "Interactive dashboard" },
  ],
};

const REPORT_BUILDER_OPTION_MAP = {
  reportType: "reportTypes",
  dateRange: "dateRanges",
  primaryFilter: "filters",
  format: "formats",
};

const REPORT_BUILDER_OPTION_ENTRIES = Object.entries(REPORT_BUILDER_OPTION_MAP);

const formatPesoCompact = (value) => {
  if (!Number.isFinite(value)) {
    return '₱0';
  }
  if (value === 0) {
    return '₱0';
  }
  const absolute = Math.abs(value);
  if (absolute >= 1000000) {
    const scaled = value / 1000000;
    const digits = Math.abs(scaled) >= 10 ? 0 : 1;
    return `₱${scaled.toFixed(digits)}M`;
  }
  if (absolute >= 1000) {
    const scaled = value / 1000;
    const digits = Math.abs(scaled) >= 10 ? 0 : 1;
    return `₱${scaled.toFixed(digits)}K`;
  }
  return `₱${Math.round(value)}`;
};

const computeAxisScale = (value, sections = 4) => {
  const safeValue = Number.isFinite(value) && value > 0 ? value : 0;
  if (safeValue === 0) {
    return { max: 1, step: 1 };
  }
  const roughStep = safeValue / Math.max(sections, 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const candidates = [1, 2, 2.5, 5, 10];
  let step = magnitude;
  for (const multiplier of candidates) {
    const option = multiplier * magnitude;
    step = option;
    if (roughStep <= option) {
      break;
    }
  }
  const max = step * Math.ceil(safeValue / step);
  return { max, step };
};

const SCHEDULE_CADENCE_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annual",
  custom: "Custom cadence",
};

const SCHEDULE_CADENCE_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annual" },
  { value: "custom", label: "Custom" },
];

const DEFAULT_SCHEDULE_FORM = {
  name: "",
  cadence: "monthly",
  nextRun: "",
  timezone: "Asia/Manila",
  format: "pdf",
  recipients: "",
};

const scheduleIdFor = (entry) => {
  if (!entry) {
    return null;
  }
  if (typeof entry.id === "string" && entry.id) {
    return entry.id;
  }
  if (typeof entry.scheduleId === "string" && entry.scheduleId) {
    return entry.scheduleId;
  }
  if (typeof entry.key === "string" && entry.key) {
    return entry.key;
  }
  return null;
};

const normalizeRecipientsList = (input) => {
  if (!input) {
    return [];
  }
  const values = Array.isArray(input)
    ? input
    : String(input)
      .split(/[,;]+/)
      .map((value) => value.trim());
  const normalized = [];
  const seen = new Set();
  values.forEach((value) => {
    if (!value) {
      return;
    }
    const recipient = String(value).trim();
    if (!recipient) {
      return;
    }
    const key = recipient.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    normalized.push(recipient);
  });
  return normalized;
};

const normalizeScheduleEntry = (entry, fallbackId = "") => {
  if (!entry) {
    return null;
  }
  const resolvedId = scheduleIdFor(entry) ?? fallbackId;
  if (!resolvedId) {
    return null;
  }

  const rawCadence =
    typeof entry.cadence === "string" && entry.cadence
      ? entry.cadence
      : typeof entry.frequency === "string"
        ? entry.frequency
        : "";
  const cadenceKey = rawCadence ? rawCadence.trim().toLowerCase() : "";
  const recipients = normalizeRecipientsList(entry.recipients);
  const cadenceLabel = entry.cadenceLabel
    ?? SCHEDULE_CADENCE_LABELS[cadenceKey]
    ?? (cadenceKey
      ? `${cadenceKey.charAt(0).toUpperCase()}${cadenceKey.slice(1)}`
      : SCHEDULE_CADENCE_LABELS.custom);

  return {
    id: resolvedId,
    name:
      (typeof entry.name === "string" && entry.name.trim())
        ? entry.name.trim()
        : (typeof entry.reportName === "string" && entry.reportName.trim())
          ? entry.reportName.trim()
          : "Untitled report",
    cadence: cadenceKey || "custom",
    cadenceLabel,
    nextRun: entry.nextRun ?? entry.nextRunAt ?? null,
    timezone: entry.timezone ?? entry.timeZone ?? "Asia/Manila",
    format:
      (typeof entry.format === "string" && entry.format.trim())
        ? entry.format.trim()
        : (typeof entry.deliveryFormat === "string" && entry.deliveryFormat.trim())
          ? entry.deliveryFormat.trim()
          : null,
    recipients,
    active: typeof entry.active === "boolean" ? entry.active : entry.status !== "paused",
    lastRunStatus: entry.lastRunStatus ?? entry.lastStatus ?? null,
    updatedAt: entry.updatedAt ?? entry.modifiedAt ?? null,
  };
};

const formatScheduleDate = (isoString, timezone) => {
  if (!isoString) {
    return "Next run not set";
  }
  try {
    const formatter = new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: timezone || "Asia/Manila",
    });
    return `Next run ${formatter.format(new Date(isoString))}`;
  } catch (error) {
    return `Next run ${isoString}`;
  }
};

const toDateInputValue = (isoString) => {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const fromDateInputToIso = (dateString) => {
  if (!dateString) {
    return null;
  }
  const base = `${dateString}T09:00:00`;
  const next = new Date(base);
  if (Number.isNaN(next.getTime())) {
    return null;
  }
  return next.toISOString();
};

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [isExportingMembership, setIsExportingMembership] = useState(false);
  const [growthHoverIndex, setGrowthHoverIndex] = useState(null);
  const [distributionHoverIndex, setDistributionHoverIndex] = useState(null);
  const [collectionHoverIndex, setCollectionHoverIndex] = useState(null);
  const [reportBuilderSelections, setReportBuilderSelections] = useState(() => ({
    reportType: DEFAULT_REPORT_BUILDER_OPTIONS.reportTypes[0]?.value ?? "",
    dateRange: DEFAULT_REPORT_BUILDER_OPTIONS.dateRanges[0]?.value ?? "",
    primaryFilter: DEFAULT_REPORT_BUILDER_OPTIONS.filters[0]?.value ?? "",
    format: DEFAULT_REPORT_BUILDER_OPTIONS.formats[0]?.value ?? "",
  }));

  const rangeShortLabels = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 3 months",
    "12m": "Last 12 months",
  };

  const rangeDurationLabels = {
    "7d": "7 days",
    "30d": "30 days",
    "90d": "3 months",
    "12m": "12 months",
  };

  const newJoinerFieldByRange = {
    "7d": "newJoiners7d",
    "30d": "newJoiners30d",
    "90d": "newJoiners90d",
    "12m": "newJoiners12m",
  };

  const [summary, setSummary] = useState(null);
  const [schedulePendingMap, setSchedulePendingMap] = useState({});
  const [scheduleActionError, setScheduleActionError] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(() => ({ ...DEFAULT_SCHEDULE_FORM }));
  const [scheduleFormError, setScheduleFormError] = useState(null);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const summaryMeta = summary?.meta ?? null;

  const overviewAlert = useMemo(() => {
    if (!summary) {
      return {
        type: 'error',
        message: 'Analytics summary failed to load. Please capture this screen and send it to Engineering so we can trace why the report has no data.',
      };
    }

    if (!summaryMeta) {
      return null;
    }

    const normalizedWarnings = Array.isArray(summaryMeta.warnings)
      ? summaryMeta.warnings.filter(Boolean)
      : [];

    let baseMessage = summaryMeta.alertMessage ?? null;
    if (!baseMessage) {
      if (normalizedWarnings.length) {
        [baseMessage] = normalizedWarnings;
      } else if (summaryMeta.error) {
        baseMessage = `Analytics warning: ${summaryMeta.error}`;
      } else if (summaryMeta.isSample) {
        baseMessage = 'Displaying sample analytics until live data is available.';
      }
    }

    const extras = normalizedWarnings.filter((warning) => warning && warning !== baseMessage);
    if (summaryMeta.error && summaryMeta.error !== baseMessage) {
      extras.push(`Error: ${summaryMeta.error}`);
    }

    const message = [baseMessage, ...extras].filter(Boolean).join(' • ');
    if (!message) {
      return null;
    }

    const resolvedType = (() => {
      if (typeof summaryMeta.alertType === 'string' && summaryMeta.alertType.trim()) {
        return summaryMeta.alertType.trim().toLowerCase();
      }
      if (summaryMeta.error) {
        return 'error';
      }
      if (summaryMeta.isSample) {
        return 'info';
      }
      if (normalizedWarnings.length) {
        return 'warning';
      }
      return 'info';
    })();

    return { type: resolvedType, message };
  }, [summary, summaryMeta]);

  const selectedRangeShort = rangeShortLabels[timeRange] ?? "Selected range";
  const selectedRangeDuration = rangeDurationLabels[timeRange] ?? "selected range";

  const getJoinersValue = (membersData, range) => {
    if (!membersData) return null;

    if (membersData.newJoinersByRange && membersData.newJoinersByRange[range] != null) {
      return membersData.newJoinersByRange[range];
    }
    if (membersData.newRegistrationsByRange && membersData.newRegistrationsByRange[range] != null) {
      return membersData.newRegistrationsByRange[range];
    }

    if (membersData.newJoiners && typeof membersData.newJoiners === 'object' && membersData.newJoiners[range] != null) {
      return membersData.newJoiners[range];
    }
    if (membersData.newRegistrations && typeof membersData.newRegistrations === 'object' && membersData.newRegistrations[range] != null) {
      return membersData.newRegistrations[range];
    }

    const field = newJoinerFieldByRange[range];
    if (field && membersData[field] != null) {
      return membersData[field];
    }
    const registrationField = field ? field.replace('newJoiners', 'newRegistrations') : null;
    if (registrationField && membersData[registrationField] != null) {
      return membersData[registrationField];
    }

    if (membersData.newJoiners30d != null) {
      return membersData.newJoiners30d;
    }
    if (membersData.newRegistrations30d != null) {
      return membersData.newRegistrations30d;
    }

    return null;
  };

  const companySnapshot = useMemo(() => {
    if (selectedCompany === 'all') {
      return null;
    }
    const companies = summary?.members?.companyStats ?? [];
    const target = selectedCompany.toLowerCase();
    return companies.find((entry) => (entry.company ?? '').toLowerCase() === target) ?? null;
  }, [selectedCompany, summary]);

  const companyOptions = useMemo(() => {
    const filters = Array.isArray(summary?.members?.companyFilters)
      ? summary.members.companyFilters
      : [];
    const distributionCompanies = Array.isArray(summary?.members?.distribution)
      ? summary.members.distribution.map((item) => item.company).filter(Boolean)
      : [];
    const combined = [...filters, ...distributionCompanies];
    const seen = new Set();
    return combined
      .map((name) => (typeof name === 'string' ? name.trim() : ''))
      .filter((name) => {
        if (!name) {
          return false;
        }
        const key = name.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }, [summary]);

  const reportBuilderOptions = useMemo(() => {
    const builder = summary?.reportBuilder ?? null;

    const slugify = (input) => {
      if (typeof input !== 'string') {
        return '';
      }
      return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const fromList = (list, fallbackList) => {
      const collected = [];
      const seen = new Set();

      const append = (option) => {
        if (!option) {
          return;
        }
        const label = typeof option.label === 'string' ? option.label.trim() : '';
        if (!label) {
          return;
        }
        const description = typeof option.description === 'string' ? option.description.trim() : '';
        const rawValue = typeof option.value === 'string' ? option.value.trim() : '';
        const value = rawValue || slugify(label) || label;
        if (!value || seen.has(value)) {
          return;
        }
        seen.add(value);
        const payload = { value, label };
        if (description) {
          payload.description = description;
        }
        collected.push(payload);
      };

      const appendRaw = (value, label, source = {}) => {
        const descriptor = typeof source.description === 'string' ? source.description : '';
        const rawLabel = typeof label === 'string' ? label : '';
        const rawValue = typeof value === 'string' ? value : '';
        const resolvedLabel = rawLabel.trim() || rawValue.trim();
        append({ value: rawValue.trim() || resolvedLabel, label: resolvedLabel, description: descriptor });
      };

      if (Array.isArray(list)) {
        list.forEach((entry) => {
          if (!entry) {
            return;
          }
          if (typeof entry === 'string') {
            appendRaw(entry, entry);
            return;
          }
          if (typeof entry === 'object') {
            const label = entry.label ?? entry.name ?? entry.title ?? entry.text ?? entry.display ?? entry.value ?? entry.code ?? entry.key;
            const value = entry.value ?? entry.code ?? entry.key ?? entry.slug ?? entry.id;
            appendRaw(value, label, entry);
          }
        });
      } else if (list && typeof list === 'object') {
        Object.entries(list).forEach(([key, value]) => {
          if (typeof value === 'string') {
            appendRaw(key, value);
          }
        });
      }

      if (!collected.length && Array.isArray(fallbackList)) {
        fallbackList.forEach((entry) => {
          if (!entry) {
            return;
          }
          if (typeof entry === 'string') {
            appendRaw(entry, entry);
            return;
          }
          appendRaw(entry.value, entry.label, entry);
        });
      }

      return collected;
    };

    return {
      reportTypes: fromList(builder?.reportTypes, DEFAULT_REPORT_BUILDER_OPTIONS.reportTypes),
      dateRanges: fromList(builder?.dateRanges, DEFAULT_REPORT_BUILDER_OPTIONS.dateRanges),
      filters: fromList(builder?.filters, DEFAULT_REPORT_BUILDER_OPTIONS.filters),
      formats: fromList(builder?.formats, DEFAULT_REPORT_BUILDER_OPTIONS.formats),
    };
  }, [summary]);

  useEffect(() => {
    if (selectedCompany === 'all') {
      return;
    }
    if (!companyOptions.length) {
      setSelectedCompany('all');
      return;
    }
    const exists = companyOptions.some((name) => name === selectedCompany);
    if (!exists) {
      setSelectedCompany('all');
    }
  }, [companyOptions, selectedCompany]);

  useEffect(() => {
    setReportBuilderSelections((previous) => {
      let mutated = false;
      const nextSelections = { ...previous };

      REPORT_BUILDER_OPTION_ENTRIES.forEach(([selectionKey, optionKey]) => {
        const optionsList = reportBuilderOptions[optionKey] ?? [];
        const currentValue = previous[selectionKey];
        if (!optionsList.length) {
          if (currentValue) {
            nextSelections[selectionKey] = '';
            mutated = true;
          }
          return;
        }
        const hasMatch = optionsList.some((option) => option.value === currentValue);
        if (!hasMatch) {
          nextSelections[selectionKey] = optionsList[0].value;
          mutated = true;
        }
      });

      return mutated ? nextSelections : previous;
    });
  }, [reportBuilderOptions]);

  const reportBuilderSelectionLabels = useMemo(() => {
    const resolveLabel = (value, options) => {
      if (!value) {
        return null;
      }
      const match = options.find((option) => option.value === value);
      return match ? match.label : null;
    };

    return {
      reportType: resolveLabel(reportBuilderSelections.reportType, reportBuilderOptions.reportTypes),
      dateRange: resolveLabel(reportBuilderSelections.dateRange, reportBuilderOptions.dateRanges),
      primaryFilter: resolveLabel(reportBuilderSelections.primaryFilter, reportBuilderOptions.filters),
      format: resolveLabel(reportBuilderSelections.format, reportBuilderOptions.formats),
    };
  }, [reportBuilderSelections, reportBuilderOptions]);

  const reportBuilderButtonHint = useMemo(() => {
    const parts = [];
    if (reportBuilderSelectionLabels.reportType) {
      parts.push(reportBuilderSelectionLabels.reportType);
    }
    if (reportBuilderSelectionLabels.dateRange) {
      parts.push(reportBuilderSelectionLabels.dateRange);
    }
    if (reportBuilderSelectionLabels.primaryFilter) {
      parts.push(reportBuilderSelectionLabels.primaryFilter);
    }
    if (reportBuilderSelectionLabels.format) {
      parts.push(reportBuilderSelectionLabels.format);
    }
    if (!parts.length) {
      return 'Select report parameters to enable export.';
    }
    return parts.join(' • ');
  }, [reportBuilderSelectionLabels]);

  const canGenerateReport = useMemo(() => (
    REPORT_BUILDER_OPTION_ENTRIES.every(([selectionKey, optionKey]) => {
      const optionsList = reportBuilderOptions[optionKey] ?? [];
      if (!optionsList.length) {
        return false;
      }
      const value = reportBuilderSelections[selectionKey];
      return typeof value === 'string' && value.trim();
    })
  ), [reportBuilderOptions, reportBuilderSelections]);

  const newJoinersValue = useMemo(
    () => getJoinersValue(companySnapshot ?? summary?.members, timeRange),
    [companySnapshot, summary, timeRange],
  );

  const scopedMembers = companySnapshot ?? summary?.members;

  // helpers available to all hooks in this component
  const formatCount = (v) => (v === null || v === undefined ? '—' : Number(v).toLocaleString());
  const formatCurrency = (v) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(v ?? 0));
  const formatPercent = (v, digits = 1) => {
    if (v === null || v === undefined || Number.isNaN(Number(v))) {
      return '—';
    }
    const numeric = Number(v);
    const sign = numeric >= 0 ? '' : '-';
    return `${sign}${Math.abs(numeric).toFixed(digits)}%`;
  };

  const formatHoursPerDay = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '—';
    }
    const numeric = Number(value);
    if (numeric < 0) {
      return '—';
    }
    if (numeric < 1) {
      const minutes = Math.round(numeric * 60);
      return `${minutes}m`;
    }
    const digits = numeric >= 10 ? 0 : 1;
    return `${numeric.toFixed(digits)}h`;
  };

  const formatStatValue = (value, formatType = 'count') => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '—';
    }
    switch (formatType) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${Number(value).toFixed(1)}%`;
      default:
        return formatCount(value);
    }
  };

  const toFiniteNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const pickFirstFinite = (...values) => {
    const candidate = values
      .map((value) => toFiniteNumber(value))
      .find((value) => value != null);
    return candidate ?? null;
  };

  const clampValue = (value, min, max) => {
    if (value == null || Number.isNaN(value)) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
  };

  const totalMembersValue = summary?.members?.total;
  const retentionRateNumeric = Number(summary?.members?.retentionRate);
  const totalMembersMeta = Number.isFinite(retentionRateNumeric)
    ? `Retention ${formatPercent(retentionRateNumeric)}`
    : null;
  const newJoinersChangeNumeric = Number(summary?.members?.newJoinersChange);
  const newJoinersMetaChange = Number.isFinite(newJoinersChangeNumeric)
    ? `${newJoinersChangeNumeric >= 0 ? '+' : ''}${Math.abs(newJoinersChangeNumeric).toFixed(1)}% vs prior`
    : null;

  const membershipDemographics = summary?.members?.demographics ?? null;
  const unionPositionsSource = membershipDemographics?.unionPositions;
  const tenurePrimarySource = membershipDemographics?.tenure;
  const tenureFallbackSource = membershipDemographics?.tenureBuckets;

  const unionPositionStats = useMemo(() => {
    const records = Array.isArray(unionPositionsSource)
      ? unionPositionsSource
      : [];
    if (!records.length) {
      return [];
    }
    const total = records.reduce((acc, record) => {
      const numeric = Number(record.value ?? record.count ?? record.total ?? 0);
      return acc + (Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
    }, 0);
    if (!(total > 0)) {
      return [];
    }
    return records.map((record, index) => {
      const label = record.label ?? record.position ?? `Entry ${index + 1}`;
      const rawValue = Number(record.value ?? record.count ?? record.total ?? 0);
      const sanitized = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
      const percent = total > 0 ? (sanitized / total) * 100 : 0;
      const width = percent > 0 ? Math.min(Math.max(percent, 6), 100) : 0;
      return {
        id: `union-${index}`,
        label,
        value: sanitized,
        formattedValue: formatCount(sanitized),
        percent,
        width,
      };
    }).filter((entry) => entry.value > 0);
  }, [unionPositionsSource, formatCount]);

  const tenureStats = useMemo(() => {
    const recordsBase = Array.isArray(tenurePrimarySource)
      ? tenurePrimarySource
      : Array.isArray(tenureFallbackSource)
        ? tenureFallbackSource
        : [];
    if (!recordsBase.length) {
      return [];
    }
    const total = recordsBase.reduce((acc, record) => {
      const numeric = Number(record.value ?? record.count ?? 0);
      return acc + (Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
    }, 0);
    if (!(total > 0)) {
      return [];
    }
    return recordsBase.map((record, index) => {
      const label = record.label ?? `Bucket ${index + 1}`;
      const rawValue = Number(record.value ?? record.count ?? 0);
      const sanitized = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
      const percent = total > 0 ? (sanitized / total) * 100 : 0;
      const width = percent > 0 ? Math.min(Math.max(percent, 6), 100) : 0;
      return {
        id: record.id ?? `tenure-${index}`,
        label,
        value: sanitized,
        formattedValue: formatCount(sanitized),
        percent,
        width,
      };
    }).filter((entry) => entry.value > 0);
  }, [tenurePrimarySource, tenureFallbackSource, formatCount]);

  const growthTrend = summary?.members?.growthTrend ?? [];

  const growthChartData = useMemo(() => {
    if (!growthTrend.length) {
      return null;
    }

    const sanitized = growthTrend.map((point) => ({
      label: point.label ?? point.month,
      total: Number(point.totalMembers ?? 0),
      newMembers: Number(point.newMembers ?? point.registrations ?? 0),
    }));

    const ySections = 4;
    const rawMax = Math.max(0, ...sanitized.map((item) => item.total), ...sanitized.map((item) => item.newMembers));

    const computeNiceScale = (value, sections) => {
      const effectiveSections = sections > 0 ? sections : 4;
      if (!Number.isFinite(value) || value <= 0) {
        const fallbackMax = effectiveSections;
        return { max: fallbackMax, step: fallbackMax / effectiveSections };
      }

      const niceNumber = (candidate, round = false) => {
        const exponent = Math.floor(Math.log10(candidate));
        const fraction = candidate / (10 ** exponent);
        let niceFraction;

        if (round) {
          if (fraction < 1.5) niceFraction = 1;
          else if (fraction < 3) niceFraction = 2;
          else if (fraction < 7) niceFraction = 5;
          else niceFraction = 10;
        } else {
          if (fraction <= 1) niceFraction = 1;
          else if (fraction <= 2) niceFraction = 2;
          else if (fraction <= 5) niceFraction = 5;
          else niceFraction = 10;
        }

        return niceFraction * (10 ** exponent);
      };

      const niceMaxEstimate = niceNumber(value, false);
      const tickSpacing = niceNumber(niceMaxEstimate / effectiveSections, true) || 1;
      const niceMax = Math.ceil(value / tickSpacing) * tickSpacing;

      return {
        max: Math.max(tickSpacing, niceMax),
        step: tickSpacing,
      };
    };

    const { max: niceMax, step: yStep } = computeNiceScale(rawMax, ySections);
    const denominator = niceMax > 0 ? niceMax : 1;
    const xDenominator = Math.max(sanitized.length - 1, 1);

    const padding = {
      top: 12,
      bottom: 12,
    };
    const horizontalPadding = sanitized.length > 1 ? 12 : 0;
    const horizontalRange = 100 - (horizontalPadding * 2);
    const effectiveHeight = 100 - padding.top - padding.bottom;
    const projectValue = (value) => {
      if (!Number.isFinite(value)) {
        return padding.top + effectiveHeight;
      }
      const ratio = denominator > 0 ? value / denominator : 0;
      const clampedRatio = clampValue(ratio, 0, 1);
      return padding.top + (effectiveHeight * (1 - clampedRatio));
    };

    const points = sanitized.map((item, index) => {
      const horizontal = sanitized.length === 1
        ? 50
        : horizontalPadding + ((index / xDenominator) * horizontalRange);
      const totalPosition = projectValue(item.total);
      const newPosition = projectValue(item.newMembers);
      return {
        index,
        label: item.label,
        total: item.total,
        newMembers: item.newMembers,
        x: horizontal,
        totalY: Number.isFinite(totalPosition) ? totalPosition : 100,
        newY: Number.isFinite(newPosition) ? newPosition : 100,
        horizontal,
      };
    });

    const totalsPolyline = points.map((point) => `${point.x},${point.totalY}`).join(' ');
    const newPolyline = points.map((point) => `${point.x},${point.newY}`).join(' ');

    const yTicks = Array.from({ length: ySections + 1 }, (_value, idx) => {
      const value = yStep * idx;
      const position = projectValue(value);
      return {
        value,
        position,
      };
    });

    const xTicks = points.map((point, index) => ({
      position: point.x,
      label: point.label,
      isEdge: index === 0 || index === points.length - 1,
    }));

    const hitWidth = sanitized.length === 1 ? 100 : (horizontalRange / xDenominator);
    const hitHalfWidth = sanitized.length === 1 ? 50 : (hitWidth / 2);

    return {
      maxValue: denominator,
      points,
      totalsPolyline,
      newPolyline,
      yTicks,
      xTicks,
      padding,
      hitWidth,
      hitHalfWidth,
      horizontalPadding,
    };
  }, [growthTrend]);

  useEffect(() => {
    setGrowthHoverIndex(null);
  }, [growthChartData]);

  const memberDistribution = useMemo(() => {
    const entries = summary?.members?.distribution ?? [];
    if (!entries.length) {
      return { segments: [], total: 0 };
    }
    const palette = ['#2563eb', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#6b7280', '#14b8a6', '#facc15'];
    const total = entries.reduce((acc, item) => acc + Number(item.count ?? 0), 0);
    if (!total) {
      return { segments: [], total: 0 };
    }

    let cumulativePercent = 0;
    const segments = entries.map((item, index) => {
      const value = Number(item.count ?? 0);
      const percent = (value / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return {
        company: item.company,
        value,
        percent,
        color: palette[index % palette.length],
        startDeg: (startPercent / 100) * 360,
        endDeg: (cumulativePercent / 100) * 360,
      };
    });

    return { segments, total };
  }, [summary]);

  const distributionForDisplay = useMemo(() => {
    if (selectedCompany === 'all' || !memberDistribution.segments.length) {
      return memberDistribution;
    }
    const selectedKey = selectedCompany.toLowerCase();
    const matchedSegment = memberDistribution.segments.find(
      (segment) => (segment.company ?? '').toLowerCase() === selectedKey,
    );
    if (!matchedSegment) {
      return { segments: [], total: 0 };
    }
    return {
      segments: [{
        ...matchedSegment,
        percent: 100,
        startDeg: 0,
        endDeg: 360,
      }],
      total: matchedSegment.value,
    };
  }, [memberDistribution, selectedCompany]);

  const distributionChartData = useMemo(() => {
    const segments = distributionForDisplay.segments ?? [];
    if (!segments.length) {
      return null;
    }

    const totalValue = segments.reduce((acc, segment) => acc + Math.max(0, Number(segment.value ?? 0)), 0);
    if (!(totalValue > 0)) {
      return null;
    }

    const center = 100;
    const outerRadius = 96;

    const toCartesian = (angleDeg, radius) => {
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      const x = center + (radius * Math.cos(angleRad));
      const y = center + (radius * Math.sin(angleRad));
      return {
        x: Number(x.toFixed(3)),
        y: Number(y.toFixed(3)),
      };
    };

    let angleCursor = -90;
    const computedSegments = segments.map((segment) => {
      const value = Math.max(0, Number(segment.value ?? 0));
      const fraction = value > 0 ? value / totalValue : 0;
      const sweep = fraction * 360;
      const startAngle = angleCursor;
      const endAngle = angleCursor + sweep;
      angleCursor = endAngle;

      const displayPercent = Number.isFinite(Number(segment.percent))
        ? Number(segment.percent)
        : fraction * 100;

      if (sweep <= 0) {
        return {
          ...segment,
          path: '',
          centroid: { x: center, y: center },
          tooltipPoint: { x: center, y: center },
          startAngle,
          endAngle,
          sweep,
          fraction,
          midAngle: startAngle,
          displayPercent,
        };
      }

      const outerStart = toCartesian(startAngle, outerRadius);
      const outerEnd = toCartesian(endAngle, outerRadius);
      const largeArc = sweep > 180 ? 1 : 0;
      const path = [
        `M ${center} ${center}`,
        `L ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        'Z',
      ].join(' ');

      const midAngle = startAngle + (sweep / 2);
      const centroidRadius = outerRadius * 0.6;
      const tooltipRadius = outerRadius + 16;
      const centroid = toCartesian(midAngle, centroidRadius);
      const tooltipPoint = toCartesian(midAngle, tooltipRadius);

      return {
        ...segment,
        path,
        centroid,
        tooltipPoint,
        startAngle,
        endAngle,
        sweep,
        fraction,
        midAngle,
        displayPercent,
      };
    });

    return {
      totalValue,
      segments: computedSegments,
    };
  }, [distributionForDisplay]);

  useEffect(() => {
    setDistributionHoverIndex(null);
  }, [distributionChartData]);

  useEffect(() => {
    setScheduleActionError(null);
  }, [summary?.reportSchedules]);

  const performanceHighlights = useMemo(() => {
    const toHighlights = (items) => (items ?? []).map((item) => ({
      label: item.label,
      value: item.value,
      format: item.format ?? 'count',
      meta: item.meta ?? null,
    }));

    return {
      membership: toHighlights(summary?.performance?.membership),
      financial: toHighlights(summary?.performance?.financial),
      operations: toHighlights(summary?.performance?.operations),
    };
  }, [summary]);

  const reportSchedules = useMemo(() => {
    if (!summary || !Array.isArray(summary.reportSchedules)) {
      return [];
    }

    const normalized = summary.reportSchedules
      .map((entry, index) => normalizeScheduleEntry(entry, `schedule-${index}`))
      .filter(Boolean);

    normalized.sort((a, b) => {
      const aTime = a.nextRun ? Date.parse(a.nextRun) : Number.POSITIVE_INFINITY;
      const bTime = b.nextRun ? Date.parse(b.nextRun) : Number.POSITIVE_INFINITY;
      return aTime - bTime;
    });

    return normalized;
  }, [summary]);

  const editingSchedule = useMemo(
    () => reportSchedules.find((schedule) => schedule.id === editingScheduleId) ?? null,
    [reportSchedules, editingScheduleId],
  );

  useEffect(() => {
    if (editingScheduleId && !editingSchedule) {
      setEditingScheduleId(null);
      setScheduleForm({ ...DEFAULT_SCHEDULE_FORM });
      setScheduleFormError(null);
    }
  }, [editingScheduleId, editingSchedule]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.getReportsSummary();
        if (!mounted) return;
        setSummary(res.data);
      } catch (err) {
        console.error('Unable to load reports summary', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleTimeRangeChange = (event) => {
    const value = event.target.value;
    if (rangeShortLabels[value]) {
      setTimeRange(value);
    }
  };

  const handleCompanyChange = (event) => {
    const value = event.target.value;
    if (value === 'all' || companyOptions.includes(value)) {
      setSelectedCompany(value);
    }
  };

  const handleReportBuilderSelectChange = (event) => {
    const { name, value } = event.target;
    if (!name || !(name in REPORT_BUILDER_OPTION_MAP)) {
      return;
    }
    setReportBuilderSelections((previous) => {
      if (previous[name] === value) {
        return previous;
      }
      return { ...previous, [name]: value };
    });
  };

  const handleMembershipExport = async () => {
    const params = { range: timeRange };
    if (selectedCompany !== 'all') {
      params.company = selectedCompany;
    }

    try {
      setIsExportingMembership(true);
      const response = await api.exportMembershipReport(params);
      const contentType = response.headers?.['content-type'] ?? 'text/csv';
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      const companySlug = selectedCompany === 'all'
        ? 'all'
        : selectedCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'selection';
      tempLink.download = `membership-report-${timeRange}-${companySlug}.csv`;
      tempLink.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Unable to export membership report', error);
    } finally {
      setIsExportingMembership(false);
    }
  };

  const setSchedulePending = (scheduleId, flag) => {
    if (!scheduleId) {
      return;
    }
    setSchedulePendingMap((previous) => {
      const next = { ...previous };
      if (!flag) {
        if (next[scheduleId]) {
          delete next[scheduleId];
          return next;
        }
        return previous;
      }
      if (next[scheduleId]) {
        return previous;
      }
      next[scheduleId] = true;
      return next;
    });
  };

  const handleScheduleToggle = async (schedule) => {
    if (!schedule?.id) {
      return;
    }
    setScheduleActionError(null);
    setSchedulePending(schedule.id, true);
    try {
      const response = await api.updateReportSchedule(schedule.id, { active: !schedule.active });
      const updatedSchedule = response?.data?.schedule ?? null;
      setSummary((previous) => {
        if (!previous) {
          return previous;
        }
        const baseList = Array.isArray(previous.reportSchedules)
          ? previous.reportSchedules
          : [];
        let updated = false;
        const nextList = baseList.map((item, index) => {
          const itemId = scheduleIdFor(item) ?? `schedule-${index}`;
          if (itemId !== schedule.id) {
            return item;
          }
          updated = true;
          if (updatedSchedule) {
            return { ...item, ...updatedSchedule };
          }
          return { ...item, active: !schedule.active };
        });
        if (!updated) {
          return updatedSchedule
            ? { ...previous, reportSchedules: [...baseList, updatedSchedule] }
            : previous;
        }
        return { ...previous, reportSchedules: nextList };
      });
      setScheduleActionError(null);
    } catch (error) {
      console.error('Unable to update schedule', error);
      setScheduleActionError('Unable to update the schedule right now. Please try again.');
    } finally {
      setSchedulePending(schedule.id, false);
    }
  };

  const openScheduleDialog = (schedule) => {
    if (!schedule?.id) {
      return;
    }
    setScheduleForm({
      name: schedule.name ?? '',
      cadence: schedule.cadence ?? 'custom',
      nextRun: toDateInputValue(schedule.nextRun),
      timezone: schedule.timezone ?? 'Asia/Manila',
      format: (schedule.format ?? 'pdf').toLowerCase(),
      recipients: schedule.recipients.join(', '),
    });
    setScheduleFormError(null);
    setEditingScheduleId(schedule.id);
  };

  const closeScheduleDialog = () => {
    setEditingScheduleId(null);
    setScheduleForm({ ...DEFAULT_SCHEDULE_FORM });
    setScheduleFormError(null);
  };

  const handleScheduleFormChange = (event) => {
    const { name, value } = event.target;
    if (!name) {
      return;
    }
    setScheduleForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleScheduleSave = async () => {
    if (!editingScheduleId) {
      return;
    }
    const trimmedName = scheduleForm.name.trim();
    if (!trimmedName) {
      setScheduleFormError('Please provide a report name.');
      return;
    }
    if (!scheduleForm.nextRun) {
      setScheduleFormError('Please select the next run date.');
      return;
    }
    const nextRunIso = fromDateInputToIso(scheduleForm.nextRun);
    if (!nextRunIso) {
      setScheduleFormError('Next run date is invalid.');
      return;
    }
    const recipientsList = normalizeRecipientsList(scheduleForm.recipients);
    setIsSavingSchedule(true);
    setScheduleFormError(null);
    try {
      const response = await api.updateReportSchedule(editingScheduleId, {
        name: trimmedName,
        cadence: scheduleForm.cadence,
        nextRun: nextRunIso,
        timezone: scheduleForm.timezone,
        format: scheduleForm.format,
        recipients: recipientsList,
      });
      const updatedSchedule = response?.data?.schedule ?? null;
      setSummary((previous) => {
        if (!previous) {
          return previous;
        }
        const baseList = Array.isArray(previous.reportSchedules)
          ? previous.reportSchedules
          : [];
        let updated = false;
        const nextList = baseList.map((item, index) => {
          const itemId = scheduleIdFor(item) ?? `schedule-${index}`;
          if (itemId !== editingScheduleId) {
            return item;
          }
          updated = true;
          if (updatedSchedule) {
            return { ...item, ...updatedSchedule };
          }
          return {
            ...item,
            name: trimmedName,
            cadence: scheduleForm.cadence,
            nextRun: nextRunIso,
            timezone: scheduleForm.timezone,
            format: scheduleForm.format,
            recipients: recipientsList,
          };
        });
        const reportSchedulesNext = updated
          ? nextList
          : updatedSchedule
            ? [...baseList, updatedSchedule]
            : baseList;
        return { ...previous, reportSchedules: reportSchedulesNext };
      });
      setScheduleActionError(null);
      closeScheduleDialog();
    } catch (error) {
      console.error('Unable to update schedule', error);
      setScheduleFormError('Unable to save changes. Please try again.');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // membership & finance highlights are data-driven where possible; default to empty/placeholder
  const membershipHighlights = performanceHighlights.membership;
  const financialHighlights = performanceHighlights.financial;
  const operationsHighlights = performanceHighlights.operations;
  const financialPrimaryStats = useMemo(() => {
    const monthlyCollections = summary?.financial?.monthlyCollections;
    const monthlyCollectionsPrev = summary?.financial?.monthlyCollectionsPrev;
    const collectedYtd = summary?.financial?.collectedYtd ?? summary?.financial?.revenueYtd;
    const revenueYoYPercent = summary?.financial?.revenueYoYPercent;
    const outstandingDues = pickFirstFinite(
      summary?.dues?.arrears,
      summary?.financial?.outstandingDues,
    );
    const overdueMembers = summary?.dues?.overdueMembers;
    const overdueEntries = summary?.dues?.overdueEntries;
    const collectionRate = summary?.financial?.collectionRate;
    const collectionNote = summary?.financial?.collectionNote;

    const percentChange = (current, previous) => {
      const currentValue = toFiniteNumber(current);
      const previousValue = toFiniteNumber(previous);
      if (currentValue == null || previousValue == null) {
        return null;
      }
      if (previousValue === 0) {
        if (currentValue === 0) {
          return 0;
        }
        return currentValue > 0 ? 100 : -100;
      }
      return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    };

    const formatDeltaPercent = (value) => {
      if (!Number.isFinite(value)) {
        return null;
      }
      const absValue = Math.abs(value);
      const decimals = absValue >= 10 ? 0 : 1;
      const rounded = absValue.toFixed(decimals);
      const sign = value > 0 ? '+' : value < 0 ? '-' : '';
      return `${sign}${rounded}%`;
    };

    const monthsElapsed = Math.max(new Date().getMonth() + 1, 1);
    const averageMonthly = (() => {
      const total = toFiniteNumber(collectedYtd);
      if (total == null || monthsElapsed <= 0) {
        return null;
      }
      return total / monthsElapsed;
    })();

    const monthDelta = percentChange(monthlyCollections, monthlyCollectionsPrev);
    const monthAvgDelta = percentChange(monthlyCollections, averageMonthly);
    const monthMeta = (() => {
      const baselineDelta = Number.isFinite(monthDelta) ? monthDelta : monthAvgDelta;
      if (Number.isFinite(baselineDelta)) {
        const basisLabel = Number.isFinite(monthDelta) ? 'vs prior 30d' : 'vs avg month';
        const formatted = formatDeltaPercent(baselineDelta);
        return formatted ? `${formatted} ${basisLabel}` : 'Collections recorded';
      }
      if (toFiniteNumber(monthlyCollections) != null) {
        return 'Collections recorded';
      }
      return 'No month-to-date data yet';
    })();

    const ytdMeta = (() => {
      const yoyDelta = toFiniteNumber(revenueYoYPercent);
      if (Number.isFinite(yoyDelta)) {
        const formatted = formatDeltaPercent(yoyDelta);
        return formatted ? `${formatted} vs last year` : 'Year-over-year steady';
      }
      if (toFiniteNumber(collectedYtd) != null) {
        return 'Tracking current fiscal year';
      }
      return 'Year-to-date totals unavailable';
    })();

    const outstandingMeta = (() => {
      const overdueMembersValue = toFiniteNumber(overdueMembers);
      const overdueEntriesValue = toFiniteNumber(overdueEntries);
      const arrearsValue = toFiniteNumber(outstandingDues);
      if (Number.isFinite(overdueMembersValue) && overdueMembersValue > 0) {
        return `${formatCount(overdueMembersValue)} members behind on dues`;
      }
      if (Number.isFinite(overdueEntriesValue) && overdueEntriesValue > 0) {
        return `${formatCount(overdueEntriesValue)} overdue ledger items`;
      }
      if (arrearsValue === 0) {
        return 'All accounts current';
      }
      if (Number.isFinite(arrearsValue) && arrearsValue > 0) {
        return 'Arrears detected';
      }
      return 'No arrears recorded';
    })();

    const collectionMeta = (() => {
      if (collectionNote) {
        return collectionNote;
      }
      if (Number.isFinite(collectionRate)) {
        if (collectionRate >= 95) return 'Above target';
        if (collectionRate >= 85) return 'On track';
        return 'Needs attention';
      }
      return 'Collection performance unavailable';
    })();

    return [
      {
        id: 'month',
        label: 'This month',
        value: monthlyCollections,
        format: 'currency',
        meta: monthMeta,
      },
      {
        id: 'ytd',
        label: 'Year to date',
        value: collectedYtd,
        format: 'currency',
        meta: ytdMeta,
      },
      {
        id: 'outstanding',
        label: 'Outstanding',
        value: outstandingDues,
        format: 'currency',
        meta: outstandingMeta,
      },
      {
        id: 'collection-rate',
        label: 'Collection rate',
        value: collectionRate,
        format: 'percent',
        meta: collectionMeta,
      },
    ];
  }, [summary]);

  const duesCollectionSeries = useMemo(() => {
    const source = Array.isArray(summary?.financial?.collectionSeries)
      ? summary.financial.collectionSeries
      : [];
    return source.map((entry, index) => {
      const monthKey = typeof entry?.month === 'string' ? entry.month : null;
      let label = entry?.label;
      if (!label && monthKey) {
        const parsed = new Date(monthKey);
        if (!Number.isNaN(parsed.getTime())) {
          label = parsed.toLocaleString('en-US', { month: 'short' });
        }
      }
      if (!label) {
        label = `M${index + 1}`;
      }
      const collectedRaw = Number(entry?.collected ?? entry?.value ?? 0);
      const billedRaw = Number(entry?.billed ?? entry?.target ?? 0);
      return {
        id: monthKey ?? `collection-${index}`,
        month: monthKey,
        label,
        collected: Number.isFinite(collectedRaw) ? Math.max(collectedRaw, 0) : 0,
        billed: Number.isFinite(billedRaw) ? Math.max(billedRaw, 0) : 0,
      };
    });
  }, [summary]);

  const collectionDiagnostics = summary?.financial?.collectionDiagnostics ?? null;

  const collectionNotice = useMemo(() => {
    if (!collectionDiagnostics) {
      return null;
    }
    if (collectionDiagnostics.fallbackApplied) {
      return collectionDiagnostics.fallbackReason
        || 'Showing sample dues collection trend while we wait for live data.';
    }
    if (Array.isArray(collectionDiagnostics.issues) && collectionDiagnostics.issues.length) {
      return collectionDiagnostics.issues[0];
    }
    const noActivity = (collectionDiagnostics.paymentsPeriods ?? 0) === 0
      && (collectionDiagnostics.ledgerPeriods ?? 0) === 0;
    if (noActivity) {
      return 'No dues payments or billing activity returned by the analytics API.';
    }
    return null;
  }, [collectionDiagnostics]);

  const collectionNoticeTone = (collectionDiagnostics?.fallbackApplied
    || (Array.isArray(collectionDiagnostics?.issues) && collectionDiagnostics.issues.length))
    ? 'warning'
    : 'info';

  const duesCollectionChart = useMemo(() => {
    if (!duesCollectionSeries.length) {
      return null;
    }
    const collectedValues = duesCollectionSeries.map((item) => item.collected ?? 0);
    const billedValues = duesCollectionSeries.map((item) => item.billed ?? 0);
    const peak = Math.max(0, ...collectedValues, ...billedValues);
    if (!(peak > 0)) {
      return null;
    }
    const axis = computeAxisScale(peak, 4);
    const safeStep = axis.step > 0 ? axis.step : Math.max(axis.max / 4, 1);
    const safeMaxCandidate = axis.max > 0 ? axis.max : peak;
    const safeMax = Math.max(safeMaxCandidate, safeStep);
    const tickCount = Math.ceil(safeMax / safeStep);
    const ticks = Array.from({ length: tickCount + 1 }, (_value, index) => {
      const tickValue = Math.min(safeMax, index * safeStep);
      const percent = safeMax > 0 ? (tickValue / safeMax) * 100 : 0;
      return {
        value: tickValue,
        percent,
        label: formatPesoCompact(tickValue),
      };
    });
    const series = duesCollectionSeries.map((item) => ({
      ...item,
      collectedPercent: safeMax > 0 ? Math.min((item.collected / safeMax) * 100, 100) : 0,
      billedPercent: safeMax > 0 ? Math.min((item.billed / safeMax) * 100, 100) : 0,
    }));
    return {
      max: safeMax,
      step: safeStep,
      ticks,
      series,
    };
  }, [duesCollectionSeries]);

  const collectionSeriesLength = duesCollectionChart?.series?.length ?? 0;

  const collectionTooltip = useMemo(() => {
    if (!duesCollectionChart || collectionHoverIndex == null) {
      return null;
    }
    const seriesItem = duesCollectionChart.series[collectionHoverIndex];
    if (!seriesItem) {
      return null;
    }
    const basePercent = collectionSeriesLength > 0
      ? ((collectionHoverIndex + 0.5) / collectionSeriesLength) * 100
      : 50;
    const left = Math.min(94, Math.max(6, basePercent));
    return {
      item: seriesItem,
      left,
    };
  }, [duesCollectionChart, collectionHoverIndex, collectionSeriesLength]);

  useEffect(() => {
    setCollectionHoverIndex(null);
  }, [collectionSeriesLength]);

  const financialCollectionBadges = useMemo(() => {
    const badges = [];

    const collectionRateValue = toFiniteNumber(summary?.financial?.collectionRate);
    if (collectionRateValue != null) {
      const digits = Math.abs(collectionRateValue) >= 10 ? 0 : 1;
      badges.push({
        label: 'Target attainment',
        value: `${collectionRateValue >= 0 ? '' : '-'}${Math.abs(collectionRateValue).toFixed(digits)}%`,
      });
    }

    const collectedYtdValue = toFiniteNumber(summary?.financial?.collectedYtd ?? summary?.financial?.revenueYtd);
    const billedYtdValue = toFiniteNumber(summary?.financial?.billedYtd);
    if (collectedYtdValue != null && billedYtdValue != null) {
      const variance = collectedYtdValue - billedYtdValue;
      const variancePrefix = variance >= 0 ? '+' : '-';
      const varianceFormatted = formatPesoCompact(Math.abs(variance));
      badges.push({
        label: 'Variance',
        value: `${variancePrefix}${varianceFormatted}`,
      });
    }

    const monthlyCollectionsValue = toFiniteNumber(summary?.financial?.monthlyCollections);
    const monthlyCollectionsPrevValue = toFiniteNumber(summary?.financial?.monthlyCollectionsPrev);
    if (monthlyCollectionsValue != null && monthlyCollectionsPrevValue != null && monthlyCollectionsPrevValue !== 0) {
      const change = ((monthlyCollectionsValue - monthlyCollectionsPrevValue) / Math.abs(monthlyCollectionsPrevValue)) * 100;
      const digits = Math.abs(change) >= 10 ? 0 : 1;
      const prefix = change >= 0 ? '+' : '-';
      badges.push({
        label: 'MoM change',
        value: `${prefix}${Math.abs(change).toFixed(digits)}%`,
      });
    }

    return badges;
  }, [summary]);

  const financialTopCompanies = useMemo(() => {
    const rawEntries = Array.isArray(summary?.financial?.topCompanies)
      ? summary.financial.topCompanies
      : [];

    const normalized = rawEntries
      .map((entry) => {
        const company = entry.company ?? 'Unspecified';
        const collected = toFiniteNumber(entry.collected ?? entry.amount ?? 0) ?? 0;
        const billed = toFiniteNumber(entry.billed ?? entry.target);
        const rateSource = toFiniteNumber(entry.collectionRate ?? entry.rate);
        const computedRate = billed && billed > 0
          ? (collected / billed) * 100
          : rateSource;
        const members = toFiniteNumber(entry.members ?? entry.memberCount ?? entry.totalMembers);
        return {
          company,
          collected,
          billed,
          collectionRate: computedRate,
          members,
        };
      })
      .filter((entry) => Number.isFinite(entry.collected) || Number.isFinite(entry.billed));

    const maxCollected = normalized.reduce(
      (accumulator, entry) => Math.max(accumulator, entry.collected ?? 0),
      0,
    );

    return {
      items: normalized,
      maxCollected,
    };
  }, [summary]);

  const paymentMethodStats = useMemo(() => {
    const fallback = [
      { label: 'Payroll Deduction', amount: 4700000 },
      { label: 'Bank Transfer', amount: 1800000 },
      { label: 'Check Payment', amount: 580000 },
      { label: 'Cash', amount: 145000 },
    ];

    const rawEntries = summary?.financial?.paymentMethods ?? [];
    const sourceEntries = rawEntries.length ? rawEntries : (summary?.meta?.isSample ? fallback : []);

    const normalized = sourceEntries
      .map((entry) => {
        const label = entry.label ?? entry.method ?? 'Unspecified';
        const value = Number(entry.amount ?? entry.value ?? 0);
        if (!Number.isFinite(value) || value < 0) {
          return null;
        }
        const key = typeof entry.method === 'string' && entry.method
          ? entry.method
          : label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { key, label, value };
      })
      .filter(Boolean);

    const total = normalized.reduce((acc, item) => acc + item.value, 0);

    const items = normalized.map((item) => ({
      key: item.key,
      label: item.label,
      amount: item.value,
      percent: total > 0 ? (item.value / total) * 100 : 0,
      formattedAmount: formatCurrency(item.value),
    }));

    const maxValue = normalized.reduce((acc, item) => Math.max(acc, item.value), 0);

    return {
      items,
      total,
      maxValue,
    };
  }, [summary]);

  const operationsPrimaryStats = useMemo(() => {
    const operations = performanceHighlights.operations ?? [];
    const findOperation = (keyword) => operations.find((item) => item.label?.toLowerCase().includes(keyword));

    const totalMembers = Number(summary?.members?.total ?? summary?.members?.totalAllStatuses);
    const physical = findOperation('physical');
    const physicalValue = Number(physical?.value ?? summary?.performance?.operations?.[0]?.value);
    const physicalMeta = Number.isFinite(physicalValue) && Number.isFinite(totalMembers) && totalMembers > 0
      ? `${((physicalValue / totalMembers) * 100).toFixed(1)}% of members`
      : (physical?.meta ?? '—');

    const assistanceValueRaw = Number(summary?.benefits?.approved ?? findOperation('assistance')?.value);
    const totalDisbursed = summary?.benefits?.totalDisbursed;
    const assistanceMeta = Number.isFinite(totalDisbursed)
      ? `${formatPesoCompact(totalDisbursed)} disbursed`
      : (findOperation('assistance')?.meta ?? '—');

    const eventsTotalRaw = Number(summary?.events?.total ?? findOperation('events')?.value);
    const attendanceRate = summary?.events?.attendanceRate;
    const eventsMeta = Number.isFinite(attendanceRate)
      ? `${attendanceRate.toFixed(0)}% avg attendance`
      : (findOperation('events')?.meta ?? '0% avg attendance');

    return [
      {
        id: 'physical-cards',
        label: 'Physical Cards',
        value: Number.isFinite(physicalValue) ? physicalValue : null,
        format: 'count',
        meta: physicalMeta,
        metaColor: 'text-blue',
      },
      {
        id: 'assistance-beneficiaries',
        label: 'Assistance Beneficiaries',
        value: Number.isFinite(assistanceValueRaw) ? assistanceValueRaw : null,
        format: 'count',
        meta: assistanceMeta,
        metaColor: 'text-green',
      },
      {
        id: 'events-this-year',
        label: 'Events This Year',
        value: Number.isFinite(eventsTotalRaw) ? eventsTotalRaw : null,
        format: 'count',
        meta: eventsMeta,
        metaColor: 'text-green',
      },
    ];
  }, [performanceHighlights.operations, summary]);

  const registrationMetrics = useMemo(() => {
    const registration = summary?.registration ?? {};

    const toNumber = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    };

    const normalizeMeta = (value) => {
      if (typeof value !== 'string') {
        return null;
      }
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const match = trimmed.match(/^\((.*)\)$/);
      return match ? match[1].trim() : trimmed;
    };

    const avgProcessingDisplay = typeof registration.avgProcessingTime === 'string'
      ? registration.avgProcessingTime.trim()
      : registration.avgProcessingTime != null
        ? `${registration.avgProcessingTime}`
        : '—';

    const approvalRateValue = toNumber(registration.approvalRate);
    const pendingReviewsValue = toNumber(registration.pendingReviews);
    const duplicateDetectionsValue = toNumber(registration.duplicateDetections);

    const approvalTone = approvalRateValue != null
      ? (approvalRateValue >= 90 ? 'positive' : approvalRateValue >= 75 ? 'warning' : 'negative')
      : null;

    const pendingTone = pendingReviewsValue != null
      ? (pendingReviewsValue <= 25 ? 'positive' : pendingReviewsValue <= 60 ? 'warning' : 'negative')
      : null;

    const duplicateTone = duplicateDetectionsValue != null
      ? (duplicateDetectionsValue <= 5 ? 'positive' : duplicateDetectionsValue <= 10 ? 'warning' : 'negative')
      : null;

    return [
      {
        id: 'avg-processing',
        label: 'Avg. Processing Time',
        value: avgProcessingDisplay || '—',
        tone: null,
        meta: normalizeMeta(registration.avgProcessingMeta),
      },
      {
        id: 'approval-rate',
        label: 'Approval Rate',
        value: approvalRateValue != null ? formatPercent(approvalRateValue, 0) : '—',
        tone: approvalTone,
        meta: normalizeMeta(registration.approvalRateMeta),
      },
      {
        id: 'pending-reviews',
        label: 'Pending Reviews',
        value: pendingReviewsValue != null ? formatCount(pendingReviewsValue) : '—',
        tone: pendingTone,
        meta: normalizeMeta(registration.pendingReviewsMeta),
      },
      {
        id: 'duplicate-detections',
        label: 'Duplicate Detections',
        value: duplicateDetectionsValue != null ? formatCount(duplicateDetectionsValue) : '—',
        tone: duplicateTone,
        meta: normalizeMeta(registration.duplicateDetectionsMeta),
      },
    ];
  }, [summary]);

  const systemHealthMetrics = useMemo(() => {
    const system = summary?.systemHealth ?? {};

    const toNumber = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    };

    const normalizeMeta = (value) => {
      if (typeof value !== 'string') {
        return null;
      }
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const match = trimmed.match(/^\((.*)\)$/);
      return match ? match[1].trim() : trimmed;
    };

    const databaseHealthValue = toNumber(system.databaseHealth);
    const apiResponseValue = toNumber(system.apiResponseTime);
    const storageUsageValue = toNumber(system.storageUsage);
    const uptimeValue = toNumber(system.uptime30d ?? system.uptime);

    const responseDisplay = apiResponseValue != null
      ? `${apiResponseValue.toLocaleString()} ms`
      : (typeof system.apiResponseTime === 'string' ? system.apiResponseTime : '—');

    const uptimeDigits = uptimeValue != null && Math.abs(uptimeValue) >= 100 ? 0 : 1;

    return [
      {
        id: 'database-health',
        label: 'Database Health',
        value: databaseHealthValue != null ? formatPercent(databaseHealthValue, 0) : '—',
        tone: databaseHealthValue != null
          ? (databaseHealthValue >= 97 ? 'positive' : databaseHealthValue >= 92 ? 'warning' : 'negative')
          : null,
        meta: normalizeMeta(system.databaseHealthMeta),
      },
      {
        id: 'api-response',
        label: 'API Response Time',
        value: responseDisplay || '—',
        tone: apiResponseValue != null
          ? (apiResponseValue <= 200 ? 'positive' : apiResponseValue <= 350 ? 'warning' : 'negative')
          : null,
        meta: normalizeMeta(system.apiResponseTimeMeta),
      },
      {
        id: 'storage-usage',
        label: 'Storage Usage',
        value: storageUsageValue != null ? formatPercent(storageUsageValue, 0) : '—',
        tone: storageUsageValue != null
          ? (storageUsageValue <= 70 ? 'positive' : storageUsageValue <= 85 ? 'warning' : 'negative')
          : null,
        meta: normalizeMeta(system.storageUsageMeta),
      },
      {
        id: 'uptime',
        label: 'Uptime (30d)',
        value: uptimeValue != null ? formatPercent(uptimeValue, uptimeDigits) : '—',
        tone: uptimeValue != null
          ? (uptimeValue >= 99 ? 'positive' : uptimeValue >= 97 ? 'warning' : 'negative')
          : null,
        meta: normalizeMeta(system.uptimeMeta ?? system.uptime30dMeta),
      },
    ];
  }, [summary]);

  const aiSummaryCards = useMemo(() => {
    const ai = summary?.ai ?? {};

    const autoAssignDigits = Math.abs(Number(ai.autoAssignRate ?? 0)) >= 10 ? 0 : 1;
    const overrideDigits = Math.abs(Number(ai.overrideRate ?? 0)) >= 10 ? 0 : 1;
    const confidenceDigits = Math.abs(Number(ai.avgConfidence ?? 0)) >= 10 ? 0 : 1;

    return [
      {
        id: 'auto-assign-rate',
        label: 'Auto-assign Rate',
        value: ai.autoAssignRate != null ? formatPercent(ai.autoAssignRate, autoAssignDigits) : '—',
        meta: ai.autoAssignRateMeta ?? null,
        tone: ai.autoAssignRateTone ?? null,
        accent: 'primary',
      },
      {
        id: 'avg-ai-confidence',
        label: 'Avg AI Confidence',
        value: ai.avgConfidence != null ? formatPercent(ai.avgConfidence, confidenceDigits) : '—',
        meta: ai.avgConfidenceMeta ?? null,
        tone: ai.avgConfidenceTone ?? null,
        accent: 'success',
      },
      {
        id: 'override-rate',
        label: 'Override Rate',
        value: ai.overrideRate != null ? formatPercent(ai.overrideRate, overrideDigits) : '—',
        meta: ai.overrideRateMeta ?? null,
        tone: ai.overrideRateTone ?? null,
        accent: 'warning',
      },
      {
        id: 'time-saved',
        label: 'Time Saved/Day',
        value: ai.timeSavedPerDayHours != null ? formatHoursPerDay(ai.timeSavedPerDayHours) : '—',
        meta: ai.timeSavedMeta ?? null,
        tone: ai.timeSavedTone ?? null,
        accent: 'accent',
      },
    ];
  }, [summary]);

  const performanceSections = [
    {
      id: 'membership',
      title: 'Membership Metrics',
      items: membershipHighlights,
      emptyLabel: 'No membership KPIs yet.',
    },
    {
      id: 'financial',
      title: 'Financial Performance',
      items: financialHighlights,
      emptyLabel: 'No financial KPIs yet.',
    },
    {
      id: 'operations',
      title: 'Operations',
      items: operationsHighlights,
      emptyLabel: 'No operations KPIs yet.',
    },
  ];


  const topKpis = useMemo(() => {
    const membersTotal = toFiniteNumber(summary?.members?.total);
    const newJoiners30d = toFiniteNumber(summary?.members?.newJoiners30d);
    const membersGrowthPercent = toFiniteNumber(summary?.members?.growthPercent);

    const revenueYtd = toFiniteNumber(summary?.financial?.revenueYtd ?? summary?.financial?.collectedYtd);
    const revenuePrevYear = toFiniteNumber(summary?.financial?.revenuePrevYear);
    const computedRevenueYoY = (() => {
      if (revenuePrevYear != null && revenuePrevYear > 0 && revenueYtd != null) {
        return ((revenueYtd - revenuePrevYear) / revenuePrevYear) * 100;
      }
      return null;
    })();
    const revenueYoYPercent = toFiniteNumber(summary?.financial?.revenueYoYPercent ?? computedRevenueYoY);

    const collectionRate = toFiniteNumber(summary?.financial?.collectionRate);
    const collectionNote = summary?.financial?.collectionNote;

    const activeCompanies = toFiniteNumber(summary?.members?.activeEmployers);
    const payingEmployers = toFiniteNumber(summary?.members?.payingEmployers);
    const companiesValueNumber = activeCompanies ?? payingEmployers;

    const formatCurrencyMaybe = (value) => (value != null ? formatCurrency(value) : '—');

    const membersDelta = (() => {
      if (membersGrowthPercent != null) {
        const sign = membersGrowthPercent >= 0 ? '+' : '';
        return `${sign}${membersGrowthPercent.toFixed(1)}% vs prior 30d`;
      }
      if (newJoiners30d != null) {
        return `+${formatCount(newJoiners30d)} in last 30 days`;
      }
      return '—';
    })();

    const revenueDelta = (() => {
      if (revenueYoYPercent != null) {
        const sign = revenueYoYPercent >= 0 ? '+' : '-';
        return `${sign}${Math.abs(revenueYoYPercent).toFixed(1)}% vs last year`;
      }
      if (revenuePrevYear != null && revenuePrevYear > 0) {
        return '0% vs last year';
      }
      return '—';
    })();

    const collectionDelta = (() => {
      if (collectionNote) {
        return collectionNote;
      }
      if (collectionRate != null) {
        if (collectionRate >= 95) return 'Above target';
        if (collectionRate >= 85) return 'On track';
        return 'Needs attention';
      }
      return '—';
    })();

    const companiesDelta = (() => {
      if (payingEmployers != null && payingEmployers > 0) {
        return `${formatCount(payingEmployers)} remitting this year`;
      }
      if (activeCompanies != null && activeCompanies > 0) {
        return 'Distinct employers represented';
      }
      return '—';
    })();

    const membersTone = membersGrowthPercent != null
      ? (membersGrowthPercent >= 0 ? 'positive' : 'negative')
      : 'neutral';

    const revenueTone = revenueYoYPercent != null
      ? (revenueYoYPercent >= 0 ? 'positive' : 'negative')
      : 'neutral';

    const collectionTone = collectionRate != null
      ? (collectionRate >= 90 ? 'positive' : collectionRate >= 75 ? 'neutral' : 'negative')
      : 'neutral';

    return [
      {
        id: 'members',
        label: 'Total Members',
        value: formatCount(membersTotal),
        delta: membersDelta,
        tone: membersTone,
      },
      {
        id: 'revenue',
        label: 'Revenue (YTD)',
        value: formatCurrencyMaybe(revenueYtd),
        delta: revenueDelta,
        tone: revenueTone,
      },
      {
        id: 'collection',
        label: 'Collection Rate',
        value: collectionRate != null ? `${collectionRate.toFixed(1)}%` : '—',
        delta: collectionDelta,
        tone: collectionTone,
      },
      {
        id: 'companies',
        label: 'Active Companies',
        value: formatCount(companiesValueNumber),
        delta: companiesDelta,
        tone: 'neutral',
      },
    ];
  }, [summary]);

  return (
    <div className="admin-page admin-stack-xl reports-page">
      <section className="reports-header">
        <div className="reports-header__text">
          <h1>Reports & Analytics</h1>
          <p className="admin-muted">Comprehensive insights and reporting for ALUzon operations.</p>
        </div>
        <div className="reports-header__actions">
          <button type="button" className="admin-button">
            <Calendar size={16} /> Schedule Report
          </button>
          <button type="button" className="admin-button">
            <Filter size={16} /> Custom Filter
          </button>
          <button type="button" className="admin-button is-primary">
            <Download size={16} /> Export All
          </button>
        </div>
      </section>

      {overviewAlert ? (
        <div className={`admin-alert admin-alert--${overviewAlert.type}`}>
          {overviewAlert.message}
        </div>
      ) : null}


      <div className="reports-tab-strip">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`reports-tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="reports-tab-content">
        {activeTab === "overview" ? (
            <>
              <section className="reports-kpi-grid">
                {topKpis.map((kpi) => (
                  <article key={kpi.id} className="reports-kpi-card">
                    <span className="reports-kpi-card__label">{kpi.label}</span>
                    <strong className="reports-kpi-card__value">{kpi.value}</strong>
                    <span className={`reports-kpi-card__delta ${kpi.tone === 'positive' ? 'is-positive' : kpi.tone === 'negative' ? 'is-negative' : ''}`}>
                      {kpi.delta}
                    </span>
                  </article>
                ))}
              </section>

              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <LineChart size={18} />
                    <div>
                      <h2>Membership growth</h2>
                      <p className="admin-muted">Member count and new joiners for the past {selectedRangeDuration}.</p>
                    </div>
                  </header>
                  {growthChartData ? (
                    <div className="reports-growth-card">
                      <div className="reports-line-chart reports-line-chart--growth">
                        <div className="reports-line-chart__frame">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                          {growthChartData.yTicks.map((tick, index) => (
                            index === 0 ? null : (
                              <line
                                key={`h-grid-${index}`}
                                x1="0"
                                x2="100"
                                y1={tick.position}
                                y2={tick.position}
                                className="reports-line-chart__grid is-horizontal"
                              />
                            )
                          ))}
                          {growthChartData.xTicks.map((tick, index) => (
                            tick.isEdge ? null : (
                              <line
                                key={`v-grid-${index}`}
                                y1="0"
                                y2="100"
                                x1={tick.position}
                                x2={tick.position}
                                className="reports-line-chart__grid is-vertical"
                              />
                            )
                          ))}
                          <polyline points="0,0 0,100 100,100" className="reports-line-chart__axis" />
                          <polyline points={growthChartData.totalsPolyline} className="reports-line-chart__series is-total" />
                          <polyline points={growthChartData.newPolyline} className="reports-line-chart__series is-new" />
                          {growthHoverIndex != null ? (
                            <line
                              x1={growthChartData.points[growthHoverIndex].x}
                              x2={growthChartData.points[growthHoverIndex].x}
                              y1="0"
                              y2="100"
                              className="reports-line-chart__cursor"
                            />
                          ) : null}
                          {growthChartData.points.map((point, index) => {
                            const isActive = growthHoverIndex === index;
                            return (
                              <g key={`points-${point.label}`}>
                                <circle
                                  cx={point.x}
                                  cy={point.totalY}
                                  r={isActive ? 2.3 : 1.7}
                                  className={`reports-line-chart__point ${isActive ? 'is-active' : ''}`}
                                />
                                <circle
                                  cx={point.x}
                                  cy={point.newY}
                                  r={isActive ? 2.1 : 1.5}
                                  className={`reports-line-chart__point is-new ${isActive ? 'is-active' : ''}`}
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {growthChartData.points.map((point, index) => (
                          <button
                            key={`hit-${point.label}`}
                            type="button"
                            className="reports-line-chart__hit"
                              style={{
                                left: `${clampValue(point.x - growthChartData.hitHalfWidth, 0, 100 - growthChartData.hitWidth)}%`,
                                width: `${growthChartData.hitWidth}%`,
                              }}
                            onMouseEnter={() => setGrowthHoverIndex(index)}
                            onMouseMove={() => setGrowthHoverIndex(index)}
                            onFocus={() => setGrowthHoverIndex(index)}
                            onMouseLeave={() => setGrowthHoverIndex(null)}
                            onBlur={() => setGrowthHoverIndex(null)}
                            aria-label={`Show metrics for ${point.label}`}
                          />
                        ))}

                        {growthHoverIndex != null ? (
                          (() => {
                            const point = growthChartData.points[growthHoverIndex];
                            const horizontalPadding = growthChartData.horizontalPadding ?? 0;
                            const leftClampMin = horizontalPadding + 4;
                            const leftClampMax = 100 - horizontalPadding - 4;
                            const tooltipLeft = clampValue(point.x, leftClampMin, leftClampMax);
                            const alignment = point.x >= 75
                              ? 'is-right'
                              : point.x <= 25
                                ? 'is-left'
                                : 'is-center';
                            const padTop = growthChartData.padding.top;
                            const padBottom = growthChartData.padding.bottom;
                            const rawTooltipY = Math.min(point.totalY, point.newY) - 10;
                            const isTop = rawTooltipY < 15;
                            const tooltipY = clampValue(
                              rawTooltipY,
                              padTop + 2,
                              100 - padBottom - 6,
                            );
                            return (
                              <div
                                key="tooltip"
                                className={`reports-line-chart__tooltip ${alignment} ${isTop ? 'is-bottom' : ''}`}
                                style={{ left: `${tooltipLeft}%`, top: `${tooltipY}%` }}
                              >
                                <div className="reports-line-chart__tooltip-label">{point.label}</div>
                                <div className="reports-line-chart__tooltip-row is-total">
                                  <span>Total Members</span>
                                  <strong>{formatCount(point.total)}</strong>
                                </div>
                                <div className="reports-line-chart__tooltip-row is-new">
                                  <span>New Members</span>
                                  <strong>{formatCount(point.newMembers)}</strong>
                                </div>
                              </div>
                            );
                          })()
                        ) : null}

                        {growthChartData.yTicks.map((tick, index) => {
                          const padTop = growthChartData.padding.top;
                          const padBottom = growthChartData.padding.bottom;
                          const labelPosition = clampValue(
                            tick.position,
                            padTop + 2,
                            100 - padBottom - 2,
                          );
                          return (
                            <span
                              key={`tick-label-${index}`}
                              className="reports-line-chart__ytick"
                              style={{ top: `${labelPosition}%` }}
                            >
                              {formatCount(tick.value)}
                            </span>
                          );
                        })}
                        </div>
                        <div className="reports-line-chart__legend">
                          <span><span className="reports-line-chart__dot is-total" /> Members</span>
                          <span><span className="reports-line-chart__dot is-new" /> New joiners</span>
                        </div>
                        <div
                          className="reports-line-chart__labels"
                          style={{ gridTemplateColumns: `repeat(${growthChartData.points.length}, minmax(40px, 1fr))` }}
                        >
                          {growthChartData.points.map((point) => (
                            <span key={`label-${point.label}`}>{point.label}</span>
                          ))}
                        </div>
                      </div>
                      <div className="reports-growth-card__footer">
                        <div className="reports-growth-pill is-members">
                          <span className="reports-growth-pill__label">TOTAL MEMBERS</span>
                          <span className="reports-growth-pill__value">{formatCount(totalMembersValue)}</span>
                          {totalMembersMeta ? (
                            <span className="reports-growth-pill__meta">{totalMembersMeta}</span>
                          ) : null}
                        </div>
                        <div className="reports-growth-pill is-joiners">
                          <span className="reports-growth-pill__label">NEW JOINERS (LAST 30 DAYS)</span>
                          <span className="reports-growth-pill__value">{newJoinersValue != null ? formatCount(newJoinersValue) : '—'}</span>
                          {newJoinersMetaChange ? (
                            <span className="reports-growth-pill__meta">{newJoinersMetaChange}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No member growth data yet.</div>
                  )}
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <PieChart size={18} />
                    <div>
                      <h2>Member distribution</h2>
                      <p className="admin-muted">Breakdown by employer segments.</p>
                    </div>
                  </header>
                  {distributionChartData ? (
                    <div className="reports-pie-card">
                      <div
                        className="reports-pie-card__chart"
                        onMouseLeave={() => setDistributionHoverIndex(null)}
                      >
                        <svg
                          className="reports-pie-chart__svg"
                          viewBox="0 0 200 200"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {distributionChartData.segments.map((segment, index) => {
                            if (!segment.path) {
                              return null;
                            }
                            const isActive = distributionHoverIndex === index;
                            const companyName = segment.company ?? 'Unspecified';
                            const accessibleLabel = `${companyName}: ${formatCount(segment.value)} members (${segment.displayPercent.toFixed(1)}%)`;
                            return (
                              <path
                                key={segment.company ?? index}
                                d={segment.path}
                                fill={segment.color}
                                className={`reports-pie-chart__segment ${isActive ? 'is-hovered' : ''}`}
                                tabIndex={0}
                                role="button"
                                aria-label={accessibleLabel}
                                onMouseEnter={() => setDistributionHoverIndex(index)}
                                onMouseMove={() => setDistributionHoverIndex(index)}
                                onFocus={() => setDistributionHoverIndex(index)}
                                onMouseLeave={() => setDistributionHoverIndex(null)}
                                onBlur={() => setDistributionHoverIndex(null)}
                              />
                            );
                          })}
                        </svg>
                        {distributionHoverIndex != null ? (() => {
                          const segment = distributionChartData.segments[distributionHoverIndex];
                          if (!segment || !segment.path) {
                            return null;
                          }
                          const companyName = segment.company ?? 'Unspecified';
                          const tooltipLeft = clampValue((segment.tooltipPoint.x / 200) * 100, 14, 86);
                          const tooltipTop = clampValue((segment.tooltipPoint.y / 200) * 100, 12, 86);
                          return (
                            <div
                              className="reports-pie-chart__tooltip"
                              style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%` }}
                            >
                              <strong style={{ color: segment.color }}>
                                {companyName} : {formatCount(segment.value)}
                              </strong>
                              <span>{segment.displayPercent.toFixed(1)}% of total</span>
                            </div>
                          );
                        })() : null}
                      </div>
                      <ul className="reports-pie-card__legend">
                        {distributionChartData.segments.map((segment, index) => {
                          const companyName = segment.company ?? 'Unspecified';
                          return (
                            <li
                              key={segment.company ?? index}
                              className={distributionHoverIndex === index ? 'is-active' : ''}
                              onMouseEnter={() => setDistributionHoverIndex(index)}
                              onMouseMove={() => setDistributionHoverIndex(index)}
                              onMouseLeave={() => setDistributionHoverIndex(null)}
                              onFocus={() => setDistributionHoverIndex(index)}
                              onBlur={() => setDistributionHoverIndex(null)}
                              tabIndex={0}
                              role="button"
                              aria-label={`${companyName}: ${formatCount(segment.value)} members (${segment.displayPercent.toFixed(1)}%)`}
                            >
                              <span className="reports-pie-card__swatch" style={{ backgroundColor: segment.color }} />
                              <span className="reports-pie-card__label">{companyName}</span>
                              <strong>{formatCount(segment.value)}</strong>
                              <span className="reports-pie-card__percent">{segment.displayPercent.toFixed(1)}%</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No employer distribution data yet.</div>
                  )}
                </article>
              </div>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <TrendingUp size={18} />
                  <div>
                    <h2>Performance summary</h2>
                    <p className="admin-muted">Cross-functional KPIs monitored in the latest reporting cycle.</p>
                  </div>
                </header>
                <div className="reports-performance">
                  {performanceSections.map((section) => (
                    <section key={section.id} className="reports-performance__section">
                      <h3>{section.title}</h3>
                      {section.items.length ? (
                        <ul className="reports-performance__list">
                          {section.items.map((item) => (
                            <li key={item.label}>
                              <div className="reports-performance__row">
                                <span className="reports-performance__label">{item.label}</span>
                                <div className="reports-performance__metrics">
                                  <span className="reports-performance__value">{formatStatValue(item.value, item.format)}</span>
                                  <span className="reports-performance__meta">{item.meta ?? '—'}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="admin-empty-state is-minimal">{section.emptyLabel}</div>
                      )}
                    </section>
                  ))}
                </div>
              </article>

            </>
            ) : null}

        {activeTab === "membership" ? (
            <>
              <div className="admin-filter-bar">
                <div className="admin-filter-bar__filters">
                  <label className="admin-select">
                    <span>Days</span>
                    <select value={timeRange} onChange={handleTimeRangeChange}>
                      {Object.entries(rangeShortLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-select">
                    <span>Company</span>
                    <select value={selectedCompany} onChange={handleCompanyChange}>
                      <option value="all">All companies</option>
                      {companyOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="admin-button is-primary admin-filter-bar__action"
                    onClick={handleMembershipExport}
                    disabled={isExportingMembership}
                  >
                    <Download size={16} /> {isExportingMembership ? 'Preparing...' : 'Export report'}
                  </button>
                </div>
              </div>

              <section className="reports-metric-strip">
                {(() => {
                  const totalAllStatuses = scopedMembers?.totalAllStatuses ?? summary?.members?.totalAllStatuses;
                  const activeTotal = scopedMembers?.total ?? summary?.members?.total;
                  const explicitInactive = scopedMembers?.inactive
                    ?? scopedMembers?.inactiveMembers
                    ?? summary?.members?.inactive
                    ?? summary?.members?.inactiveMembers;
                  const computedInactive = (() => {
                    if (explicitInactive != null) {
                      const numeric = Number(explicitInactive);
                      return Number.isFinite(numeric) ? Math.max(numeric, 0) : null;
                    }
                    if (totalAllStatuses == null || activeTotal == null) {
                      return null;
                    }
                    const allNumeric = Number(totalAllStatuses);
                    const activeNumeric = Number(activeTotal);
                    if (!Number.isFinite(allNumeric) || !Number.isFinite(activeNumeric)) {
                      return null;
                    }
                    return Math.max(allNumeric - activeNumeric, 0);
                  })();

                  const retentionRateValue = scopedMembers?.retentionRate ?? summary?.members?.retentionRate;
                  const retentionMeta = selectedCompany !== 'all'
                    ? `${selectedCompany} retention`
                    : 'Trailing 12 months';

                  const comparisonLabelMap = {
                    '7d': 'previous week',
                    '30d': 'prev month',
                    '90d': 'prev quarter',
                    '12m': 'prior year',
                  };
                  const rangeCodeMap = {
                    '7d': '7d',
                    '30d': '30d',
                    '90d': '90d',
                    '12m': '12m',
                  };
                  const comparisonLabel = comparisonLabelMap[timeRange] ?? 'previous period';
                  const rangeCode = rangeCodeMap[timeRange] ?? timeRange;

                  const newJoinersDeltaPercent = pickFirstFinite(
                    summary?.members?.newJoinersChangePercent,
                    summary?.members?.newJoinersDeltaPercent,
                    summary?.members?.newJoinersPercentChange,
                    summary?.members?.growthPercent,
                  );
                  const newJoinersMetaBaseline = `Past ${selectedRangeDuration}${selectedCompany !== 'all' ? ` • ${selectedCompany}` : ''}`;
                  const previousJoiners = pickFirstFinite(
                    summary?.members?.newJoinersPrevPeriod,
                    summary?.members?.previousNewJoiners,
                    summary?.members?.newJoinersPreviousRange,
                  );
                  const newJoinersMeta = (() => {
                    if (newJoinersDeltaPercent != null) {
                      const sign = newJoinersDeltaPercent >= 0 ? '+' : '-';
                      return `${sign}${Math.abs(newJoinersDeltaPercent).toFixed(1)}% vs ${comparisonLabel}`;
                    }
                    if (previousJoiners != null) {
                      return `${formatCount(previousJoiners)} previous period`;
                    }
                    return newJoinersMetaBaseline;
                  })();
                  const newJoinersTone = newJoinersDeltaPercent != null
                    ? (newJoinersDeltaPercent >= 0 ? 'positive' : 'negative')
                    : 'neutral';

                  const inactiveValue = toFiniteNumber(computedInactive);
                  const totalForInactive = pickFirstFinite(
                    totalAllStatuses,
                    activeTotal != null && inactiveValue != null ? Number(activeTotal) + Number(inactiveValue) : null,
                  );
                  const inactivePercentOfTotal = (() => {
                    if (inactiveValue == null || totalForInactive == null || totalForInactive <= 0) {
                      return null;
                    }
                    return (inactiveValue / totalForInactive) * 100;
                  })();
                  const inactiveMetaBaseline = totalAllStatuses != null
                    ? `${formatCount(totalAllStatuses)} total records${selectedCompany !== 'all' ? ` • ${selectedCompany}` : ''}`
                    : 'Non-active records';
                  const inactiveMeta = inactivePercentOfTotal != null
                    ? `${inactivePercentOfTotal.toFixed(1)}% of total`
                    : inactiveMetaBaseline;
                  const inactiveTone = inactivePercentOfTotal != null && inactivePercentOfTotal > 0 ? 'negative' : 'neutral';

                  const retentionRateNumber = toFiniteNumber(retentionRateValue);
                  const retentionDisplayValue = retentionRateNumber != null ? `${retentionRateNumber.toFixed(1)}%` : '—';
                  const retentionTone = retentionRateNumber != null
                    ? (retentionRateNumber >= 96 ? 'positive' : retentionRateNumber >= 90 ? 'neutral' : 'negative')
                    : 'neutral';
                  const retentionMetaLabel = retentionRateNumber != null
                    ? (retentionTone === 'positive'
                      ? 'Above industry avg'
                      : retentionTone === 'negative'
                        ? 'Needs retention focus'
                        : 'In line with industry')
                    : retentionMeta;

                  const cards = [
                    {
                      title: `New Members (${rangeCode})`,
                      value: newJoinersValue != null ? formatCount(newJoinersValue) : '—',
                      meta: newJoinersMeta,
                      accent: 'primary',
                      tone: newJoinersTone,
                    },
                    {
                      title: 'Inactive Members',
                      value: inactiveValue != null ? formatCount(inactiveValue) : '—',
                      meta: inactiveMeta,
                      accent: 'danger',
                      tone: inactiveTone,
                    },
                    {
                      title: 'Retention Rate',
                      value: retentionDisplayValue,
                      meta: retentionMetaLabel,
                      accent: 'success',
                      tone: retentionTone,
                    },
                  ];

                  return cards.map((card) => {
                    const classes = [
                      'reports-metric-card',
                      `reports-metric-card--accent-${card.accent}`,
                      card.tone ? `reports-metric-card--${card.tone}` : null,
                    ].filter(Boolean).join(' ');
                    return (
                      <article key={card.title} className={classes}>
                        <span className="reports-metric-card__value">{card.value}</span>
                        <span className="reports-metric-card__label">{card.title}</span>
                        <span className="reports-metric-card__meta">{card.meta}</span>
                      </article>
                    );
                  });
                })()}
              </section>

              <section className="reports-demographics">
                <div className="admin-section-title">
                  <h2>Membership Demographics</h2>
                </div>
                <div className="reports-demographics-grid">
                  <article className="admin-card reports-demographics-card">
                    <header className="reports-demographics-card__header">
                      <Users size={18} />
                      <div>
                        <h3>By union position</h3>
                        <p className="admin-muted">Active members holding union roles.</p>
                      </div>
                    </header>
                    {unionPositionStats.length ? (
                      <ul className="reports-demographics-list">
                        {unionPositionStats.map((item) => (
                          <li key={item.id} className="reports-demographics-item">
                            <div className="reports-demographics-item__header">
                              <span>{item.label}</span>
                              <strong>{item.formattedValue}</strong>
                            </div>
                            <div className="reports-demographics-progress">
                              <span
                                className="reports-demographics-progress__fill is-union"
                                style={{ width: `${item.width}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="admin-empty-state is-minimal">No union position data yet.</div>
                    )}
                  </article>

                  <article className="admin-card reports-demographics-card">
                    <header className="reports-demographics-card__header">
                      <BarChart3 size={18} />
                      <div>
                        <h3>By years employed</h3>
                        <p className="admin-muted">Experience distribution for approved members.</p>
                      </div>
                    </header>
                    {tenureStats.length ? (
                      <ul className="reports-demographics-list">
                        {tenureStats.map((item) => (
                          <li key={item.id} className="reports-demographics-item">
                            <div className="reports-demographics-item__header">
                              <span>{item.label}</span>
                              <strong>{item.formattedValue}</strong>
                            </div>
                            <div className="reports-demographics-progress">
                              <span
                                className="reports-demographics-progress__fill is-tenure"
                                style={{ width: `${item.width}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="admin-empty-state is-minimal">No tenure data yet.</div>
                    )}
                  </article>
                </div>
              </section>
            </>
            ) : null}

        {activeTab === "financial" ? (
            <>
              <section className="reports-financial-strip">
                {financialPrimaryStats.map((item) => {
                  const value = formatStatValue(item.value, item.format);
                  const toneClass = (() => {
                    switch (item.id) {
                      case 'month':
                        return 'is-success';
                      case 'ytd':
                        return 'is-primary';
                      case 'outstanding':
                        return 'is-danger';
                      case 'collection-rate':
                        return 'is-accent';
                      default:
                        return 'is-neutral';
                    }
                  })();
                  return (
                    <article key={item.id} className={`reports-financial-card ${toneClass}`}>
                      <span className="reports-financial-card__value">{value}</span>
                      <div className="reports-financial-card__footer">
                        <span className="reports-financial-card__label">{item.label}</span>
                        <span className="reports-financial-card__meta">{item.meta}</span>
                      </div>
                    </article>
                  );
                })}
              </section>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <DollarSign size={18} />
                  <div>
                    <h2>Dues Collection Performance</h2>
                    <p className="admin-muted">Collected vs target by month.</p>
                  </div>
                </header>
                {duesCollectionChart ? (
                  <div className="reports-collection-chart">
                    <div className="reports-collection-chart__plot">
                      <div className="reports-collection-chart__grid">
                        {duesCollectionChart.ticks.map((tick, index) => (
                          <div
                            key={`collection-tick-${tick.value}-${index}`}
                            className={`reports-collection-chart__grid-line ${index === 0 ? 'is-base' : ''}`}
                            style={{ bottom: `${tick.percent}%` }}
                          >
                            <span>{tick.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="reports-collection-chart__columns">
                        {duesCollectionChart.series.map((entry, index) => {
                          const isActive = collectionHoverIndex === index;
                          return (
                            <button
                              type="button"
                              key={entry.id ?? `collection-${index}`}
                              className={`reports-collection-chart__column ${isActive ? 'is-active' : ''}`}
                              onMouseEnter={() => setCollectionHoverIndex(index)}
                              onFocus={() => setCollectionHoverIndex(index)}
                              onMouseLeave={() => setCollectionHoverIndex(null)}
                              onBlur={() => setCollectionHoverIndex(null)}
                            >
                              <div className="reports-collection-chart__bar-group">
                                <span
                                  className="reports-collection-chart__bar is-actual"
                                  style={{ height: `${Math.max(0, Math.min(entry.collectedPercent, 100))}%` }}
                                />
                                <span
                                  className="reports-collection-chart__bar is-target"
                                  style={{ height: `${Math.max(0, Math.min(entry.billedPercent, 100))}%` }}
                                />
                              </div>
                              <span className="reports-collection-chart__month">{entry.label}</span>
                            </button>
                          );
                        })}
                        {collectionTooltip ? (
                          <div
                            className="reports-collection-chart__tooltip"
                            style={{ left: `${collectionTooltip.left}%` }}
                          >
                            <strong>{formatCurrency(collectionTooltip.item.collected)}</strong>
                            <span>{collectionTooltip.item.label}</span>
                            {Number.isFinite(collectionTooltip.item.billed) && collectionTooltip.item.billed > 0 ? (
                              <span>Target {formatCurrency(collectionTooltip.item.billed)}</span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="reports-collection-chart__legend">
                      <span className="reports-collection-chart__legend-item">
                        <span className="reports-collection-chart__legend-swatch is-actual" />
                        Collected
                      </span>
                      <span className="reports-collection-chart__legend-item">
                        <span className="reports-collection-chart__legend-swatch is-target" />
                        Target
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="admin-empty-state is-minimal">No dues collection data yet.</div>
                )}
                {financialCollectionBadges.length ? (
                  <div className="admin-inline-list">
                    {financialCollectionBadges.map((badge) => (
                      <span key={badge.label}>{badge.label}: {badge.value}</span>
                    ))}
                  </div>
                ) : null}
              </article>

              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <Building2 size={18} />
                    <div>
                      <h2>Top performing companies</h2>
                      <p className="admin-muted">Collections vs target over the last quarter.</p>
                    </div>
                  </header>
                  {financialTopCompanies.items.length ? (
                    <div className="reports-top-list">
                      {financialTopCompanies.items.map((item) => {
                        const progressBasis = financialTopCompanies.maxCollected > 0
                          ? (item.collected / financialTopCompanies.maxCollected) * 100
                          : 0;
                        const progress = Math.max(6, Math.min(progressBasis, 100));
                        const collectionRateLabel = item.collectionRate != null
                          ? `${formatPercent(item.collectionRate, Math.abs(item.collectionRate) >= 100 ? 0 : 1)} collection rate`
                          : 'No billing data yet';
                        const membersLabel = Number.isFinite(item.members) && item.members > 0
                          ? `${formatCount(item.members)} members`
                          : null;
                        const metaLabel = membersLabel ? `${collectionRateLabel} • ${membersLabel}` : collectionRateLabel;
                        return (
                          <div key={item.company} className="reports-top-list__item">
                            <div className="reports-top-list__row">
                              <div className="reports-top-list__info">
                                <span className="reports-top-list__company">{item.company}</span>
                                <span className="reports-top-list__meta">{metaLabel}</span>
                              </div>
                              <div className="reports-top-list__value">
                                <strong>{formatCurrency(item.collected ?? 0)}</strong>
                                {Number.isFinite(item.billed) && item.billed > 0 ? (
                                  <span>Billed {formatCurrency(item.billed)}</span>
                                ) : null}
                              </div>
                            </div>
                            <div className="reports-top-list__bar">
                              <span style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No company performance data yet.</div>
                  )}
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <Target size={18} />
                    <div>
                      <h2>Payment methods</h2>
                      <p className="admin-muted">Contribution split by remittance channel.</p>
                    </div>
                  </header>
                  {paymentMethodStats.items.length ? (
                    <div className="reports-payment-list">
                      {paymentMethodStats.items.map((item) => {
                        const progressBasis = paymentMethodStats.maxValue > 0
                          ? (item.amount / paymentMethodStats.maxValue) * 100
                          : 0;
                        const progress = Math.max(6, Math.min(progressBasis, 100));
                        const percentLabel = item.percent > 0
                          ? `${item.percent >= 10 ? item.percent.toFixed(0) : item.percent.toFixed(1)}% of collections`
                          : 'No collections recorded';
                        return (
                          <div key={item.key ?? item.label} className="reports-payment-item">
                            <div className="reports-payment-item__header">
                              <span>{item.label}</span>
                              <strong>{item.formattedAmount}</strong>
                            </div>
                            <div className="reports-payment-item__bar">
                              <span style={{ width: `${progress}%` }} />
                            </div>
                            <div className="reports-payment-item__meta">
                              <span>{percentLabel}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No payment method data yet.</div>
                  )}
                </article>
              </div>
            </>
            ) : null}

        {activeTab === "operations" ? (
            <>
              <section className="reports-operation-strip">
                {operationsPrimaryStats.map((item) => {
                  const colorClass = (() => {
                    switch (item.id) {
                      case 'physical-cards': return 'text-purple';
                      case 'assistance-beneficiaries': return 'text-green';
                      case 'events-this-year': return 'text-orange';
                      default: return '';
                    }
                  })();
                  return (
                    <article key={item.id} className="reports-operation-card">
                      <span className={`reports-operation-card__value ${colorClass}`}>
                        {formatStatValue(item.value, item.format)}
                      </span>
                      <span className="reports-operation-card__label">{item.label}</span>
                      <span className={`reports-operation-card__meta ${item.metaColor || ''}`}>{item.meta}</span>
                    </article>
                  );
                })}
              </section>

              <div className="reports-operations-panels">
                <article className="admin-card reports-operations-panel">
                  <header className="admin-card__heading reports-operations-panel__header">
                    <ClipboardList size={18} />
                    <div>
                      <h2>Registration processing</h2>
                      <p className="admin-muted">Queue health metrics from the last review cycle.</p>
                    </div>
                  </header>
                  {registrationMetrics.length ? (
                    <div className="reports-operations-panel__metrics">
                      {registrationMetrics.map((metric) => (
                        <div key={metric.id} className="reports-operations-panel__metric">
                          <span className="reports-operations-panel__metric-label">{metric.label}</span>
                          <span className={`reports-operations-panel__metric-value${metric.tone ? ` is-${metric.tone}` : ''}`}>
                            {metric.value}
                            {metric.meta ? (
                              <span className="reports-operations-panel__metric-hint">({metric.meta})</span>
                            ) : null}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No registration metrics yet.</div>
                  )}
                </article>

                <article className="admin-card reports-operations-panel">
                  <header className="admin-card__heading reports-operations-panel__header">
                    <ShieldCheck size={18} />
                    <div>
                      <h2>System performance</h2>
                      <p className="admin-muted">Platform uptime and service reliability.</p>
                    </div>
                  </header>
                  {systemHealthMetrics.length ? (
                    <div className="reports-operations-panel__metrics">
                      {systemHealthMetrics.map((metric) => (
                        <div key={metric.id} className="reports-operations-panel__metric">
                          <span className="reports-operations-panel__metric-label">{metric.label}</span>
                          <span className={`reports-operations-panel__metric-value${metric.tone ? ` is-${metric.tone}` : ''}`}>
                            {metric.value}
                            {metric.meta ? (
                              <span className="reports-operations-panel__metric-hint">({metric.meta})</span>
                            ) : null}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty-state is-minimal">No system health data yet.</div>
                  )}
                </article>
              </div>
            </>
            ) : null}

        {activeTab === "custom" ? (
            <>
              <section className="reports-ai-summary">
                {aiSummaryCards.map((card) => (
                  <article key={card.id} className={`reports-ai-card ${card.accent ? `is-${card.accent}` : ''}`}>
                    <strong className="reports-ai-card__value">{card.value}</strong>
                    <span className="reports-ai-card__label">{card.label}</span>
                    {card.meta ? (
                      <span className={`reports-ai-card__meta ${card.tone ? `is-${card.tone}` : ''}`}>
                        {card.meta}
                      </span>
                    ) : null}
                  </article>
                ))}
              </section>

              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <BarChart3 size={18} />
                    <div>
                      <h2>Report builder</h2>
                      <p className="admin-muted">Choose data sources, filters, and formats.</p>
                    </div>
                  </header>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      <span>Report type</span>
                      <select
                        name="reportType"
                        value={reportBuilderSelections.reportType}
                        onChange={handleReportBuilderSelectChange}
                        disabled={!reportBuilderOptions.reportTypes.length}
                      >
                        {reportBuilderOptions.reportTypes.length
                          ? reportBuilderOptions.reportTypes.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                title={option.description ?? undefined}
                              >
                                {option.label}
                              </option>
                            ))
                          : (
                            <option value="">No report types available</option>
                          )}
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Date range</span>
                      <select
                        name="dateRange"
                        value={reportBuilderSelections.dateRange}
                        onChange={handleReportBuilderSelectChange}
                        disabled={!reportBuilderOptions.dateRanges.length}
                      >
                        {reportBuilderOptions.dateRanges.length
                          ? reportBuilderOptions.dateRanges.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                title={option.description ?? undefined}
                              >
                                {option.label}
                              </option>
                            ))
                          : (
                            <option value="">No ranges available</option>
                          )}
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Primary filter</span>
                      <select
                        name="primaryFilter"
                        value={reportBuilderSelections.primaryFilter}
                        onChange={handleReportBuilderSelectChange}
                        disabled={!reportBuilderOptions.filters.length}
                      >
                        {reportBuilderOptions.filters.length
                          ? reportBuilderOptions.filters.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                title={option.description ?? undefined}
                              >
                                {option.label}
                              </option>
                            ))
                          : (
                            <option value="">No filters available</option>
                          )}
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Output format</span>
                      <select
                        name="format"
                        value={reportBuilderSelections.format}
                        onChange={handleReportBuilderSelectChange}
                        disabled={!reportBuilderOptions.formats.length}
                      >
                        {reportBuilderOptions.formats.length
                          ? reportBuilderOptions.formats.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                title={option.description ?? undefined}
                              >
                                {option.label}
                              </option>
                            ))
                          : (
                            <option value="">No formats available</option>
                          )}
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="admin-button is-primary admin-report-action"
                    disabled={!canGenerateReport}
                    title={reportBuilderButtonHint}
                  >
                    <BarChart3 size={16} />
                    <span>
                      {` Generate ${reportBuilderSelectionLabels.reportType ?? 'report'}`}
                    </span>
                  </button>
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <Calendar size={18} />
                    <div>
                      <h2>Scheduled reports</h2>
                      <p className="admin-muted">Automated deliveries to stakeholders.</p>
                    </div>
                  </header>
                  <div className="admin-stack-sm">
                    {scheduleActionError ? (
                      <p className="admin-text-error">{scheduleActionError}</p>
                    ) : null}
                    {!reportSchedules.length ? (
                      <div className="admin-empty-state">
                        <p className="admin-muted">No scheduled reports yet.</p>
                        <p className="admin-muted">Create automated deliveries once reports are finalized.</p>
                      </div>
                    ) : reportSchedules.map((schedule) => {
                      const metaParts = [
                        schedule.cadenceLabel,
                        formatScheduleDate(schedule.nextRun, schedule.timezone),
                      ];
                      if (schedule.recipients.length) {
                        const recipientCount = schedule.recipients.length;
                        metaParts.push(`${recipientCount} recipient${recipientCount === 1 ? '' : 's'}`);
                      }
                      if (schedule.format) {
                        metaParts.push(String(schedule.format).toUpperCase());
                      }
                      const metaText = metaParts.filter(Boolean).join(' • ');
                      const isPending = Boolean(schedulePendingMap[schedule.id]);
                      const buttonLabel = isPending
                        ? 'Updating...'
                        : schedule.active
                          ? 'Pause'
                          : 'Resume';
                      return (
                        <div key={schedule.id} className="admin-scheduled-row">
                          <div>
                            <div className="admin-scheduled-row__header">
                              <strong>{schedule.name}</strong>
                              {!schedule.active ? (
                                <span className="admin-chip admin-chip--ghost">Paused</span>
                              ) : null}
                            </div>
                            <p className="admin-scheduled-row__meta">{metaText}</p>
                          </div>
                          <div className="admin-scheduled-row__actions">
                            <button
                              type="button"
                              className="admin-button admin-button--ghost"
                              onClick={() => handleScheduleToggle(schedule)}
                              disabled={isPending}
                            >
                              {buttonLabel}
                            </button>
                            <button
                              type="button"
                              className="admin-button admin-button--ghost"
                              onClick={() => openScheduleDialog(schedule)}
                              disabled={isPending}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <Download size={18} />
                  <div>
                    <h2>Export history</h2>
                    <p className="admin-muted">Track completed downloads and formats.</p>
                  </div>
                </header>
                <div className="admin-table-wrapper">
                  <table className="admin-table admin-table--condensed">
                    <thead>
                      <tr>
                        <th>Report</th>
                        <th>Date</th>
                        <th>Size</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {exportHistory.map((row) => (
                        <tr key={row.id}>
                          <td>{row.name}</td>
                          <td>{row.date}</td>
                          <td>{row.size}</td>
                          <td>
                            <span className="admin-chip is-green">{row.status}</span>
                          </td>
                          <td>
                            <button type="button" className="admin-button admin-button--ghost">
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </>
            ) : null}
      </div>
      {editingScheduleId && editingSchedule ? (
        <div className="admin-dialog" role="dialog" aria-modal="true">
          <div className="admin-dialog__backdrop" onClick={closeScheduleDialog} />
          <div className="admin-dialog__panel">
            <header className="admin-dialog__header">
              <div>
                <h3>Edit scheduled report</h3>
                <p className="admin-muted">{editingSchedule.name}</p>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={closeScheduleDialog}
                aria-label="Close scheduled report editor"
              >
                <X size={16} />
              </button>
            </header>
            <div className="admin-dialog__body admin-stack-md">
              <label className="admin-field">
                <span>Report name</span>
                <input
                  type="text"
                  name="name"
                  value={scheduleForm.name}
                  onChange={handleScheduleFormChange}
                  required
                />
              </label>
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Cadence</span>
                  <select
                    name="cadence"
                    value={scheduleForm.cadence}
                    onChange={handleScheduleFormChange}
                  >
                    {SCHEDULE_CADENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  <span>Next run date</span>
                  <input
                    type="date"
                    name="nextRun"
                    value={scheduleForm.nextRun}
                    onChange={handleScheduleFormChange}
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Timezone</span>
                  <input
                    type="text"
                    name="timezone"
                    value={scheduleForm.timezone}
                    onChange={handleScheduleFormChange}
                  />
                </label>
                <label className="admin-field">
                  <span>Format</span>
                  <select
                    name="format"
                    value={scheduleForm.format}
                    onChange={handleScheduleFormChange}
                  >
                    <option value="pdf">PDF report</option>
                    <option value="excel">Excel spreadsheet</option>
                    <option value="csv">CSV export</option>
                    <option value="dashboard">Interactive dashboard</option>
                  </select>
                </label>
              </div>
              <label className="admin-field">
                <span>Recipients</span>
                <textarea
                  name="recipients"
                  value={scheduleForm.recipients}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  placeholder="Separate email addresses with commas"
                />
              </label>
              {scheduleFormError ? (
                <p className="admin-text-error">{scheduleFormError}</p>
              ) : null}
            </div>
            <footer className="admin-dialog__footer">
              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={closeScheduleDialog}
                disabled={isSavingSchedule}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-button is-primary"
                onClick={handleScheduleSave}
                disabled={isSavingSchedule}
              >
                {isSavingSchedule ? 'Saving...' : 'Save changes'}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
