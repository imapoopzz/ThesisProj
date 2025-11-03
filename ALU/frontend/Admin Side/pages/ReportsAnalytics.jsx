import { useMemo, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  ClipboardList,
  DollarSign,
  Download,
  Filter,
  LineChart,
  PieChart,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import "../styles/admin-base.css";
import { aiAnalytics } from "../components/ai/mockAiData";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "membership", label: "Membership" },
  { id: "financial", label: "Financial" },
  { id: "operations", label: "Operations" },
  { id: "custom", label: "Custom Reports" },
];

const reportHistory = [
  {
    id: "weekly",
    title: "Weekly Workforce Update",
    summary: "Tickets closed, member engagements, escalations by region.",
    generated: "2025-10-02 08:15",
    format: "PDF",
  },
  {
    id: "ai",
    title: "AI Decisioning Insights",
    summary: "Confidence, overrides, top misclassifications (30 days).",
    generated: "2025-10-01 18:00",
    format: "Dashboard",
  },
  {
    id: "benefits",
    title: "Benefits Assistance Report",
    summary: "Disbursements, SLA tracking, member satisfaction trends.",
    generated: "2025-09-30 17:45",
    format: "Excel",
  },
  {
    id: "finance",
    title: "Monthly Collections Summary",
    summary: "Payroll deductions, arrears, variance against targets.",
    generated: "2025-09-29 09:30",
    format: "CSV",
  },
];

const exportHistory = [
  { id: "exp-1047", name: "Membership Growth Report", date: "2025-09-30", size: "2.3 MB", status: "Completed" },
  { id: "exp-1046", name: "Financial Summary Q3", date: "2025-09-28", size: "1.8 MB", status: "Completed" },
  { id: "exp-1045", name: "AI Override Audit", date: "2025-09-27", size: "1.2 MB", status: "Completed" },
  { id: "exp-1044", name: "Benefits Utilization", date: "2025-09-25", size: "3.1 MB", status: "Completed" },
];

const scheduledReports = [
  { id: "sched-01", name: "Monthly Membership Summary", cadence: "Monthly", nextRun: "2025-11-01" },
  { id: "sched-02", name: "Weekly Collection Report", cadence: "Weekly", nextRun: "2025-10-07" },
  { id: "sched-03", name: "Quarterly Analytics", cadence: "Quarterly", nextRun: "2025-12-31" },
  { id: "sched-04", name: "Benefits & Assistance Digest", cadence: "Bi-weekly", nextRun: "2025-10-14" },
];

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [comparisonRange, setComparisonRange] = useState("previous-period");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const rangeLabels = {
    "7d": "the last 7 days",
    "30d": "the last 30 days",
    "90d": "the last 90 days",
    "12m": "the last 12 months",
  };

  const comparisonLabels = {
    "previous-period": "versus the previous period",
    "previous-year": "versus the same period last year",
    baseline: "versus the quarterly baseline",
  };

  const segmentLabels = {
    all: "all employers",
    top: "the top 25 employers",
    transport: "transport & logistics",
    retail: "retail & services",
  };

  const contextDescription = [
    rangeLabels[timeRange] ? `Showing ${rangeLabels[timeRange]}` : "Showing the selected range",
    comparisonLabels[comparisonRange] ?? "",
    segmentLabels[segmentFilter] ? `for ${segmentLabels[segmentFilter]}` : "for all data",
  ]
    .filter(Boolean)
    .join(" ")
    .concat(".");

  const overviewMetrics = useMemo(
    () => [
      {
        id: "members",
        label: "Total members",
        value: "18,240",
        delta: "+3.2% vs last month",
        icon: Users,
        tone: "is-blue",
      },
      {
        id: "unions",
        label: "Active locals",
        value: "128",
        delta: "+4 new charters",
        icon: ShieldCheck,
        tone: "is-purple",
      },
      {
        id: "auto-assign",
        label: "AI auto-assign rate",
        value: `${aiAnalytics.autoAssignRate}%`,
        delta: "+12% vs last month",
        icon: TrendingUp,
        tone: "is-green",
      },
      {
        id: "resolution",
        label: "Avg resolution time",
        value: "2.4 days",
        delta: "Goal: under 3 days",
        icon: Clock,
        tone: "is-amber",
      },
    ],
    [],
  );

  const insightCards = useMemo(
    () => [
      {
        id: "growth",
        title: "Growth outpacing target",
        summary: "+326 members ahead of quarterly plan",
        detail: "AI-assisted outreach improved conversion in retail locals.",
        tone: "is-indigo",
        icon: Sparkles,
      },
      {
        id: "assistance",
        title: "Benefits disbursement surge",
        summary: "₱540K released in the last 7 days",
        detail: "Emergency aid requests were resolved 22% faster than SLA.",
        tone: "is-teal",
        icon: Activity,
      },
      {
        id: "collections",
        title: "Collections stability",
        summary: "Target attainment holding at 108%",
        detail: "Transport companies are driving a +9% uplift in payroll deductions.",
        tone: "is-amber",
        icon: DollarSign,
      },
    ],
    [],
  );

  const membershipSegments = useMemo(
    () => [
      { label: "Retail & services", value: 6210, percentage: 34 },
      { label: "Manufacturing", value: 5480, percentage: 30 },
      { label: "Transport & logistics", value: 3120, percentage: 17 },
      { label: "Healthcare", value: 2044, percentage: 11 },
      { label: "Other sectors", value: 1386, percentage: 8 },
    ],
    [],
  );

  const membershipHighlights = useMemo(
    () => [
      { label: "Active members", value: "18,203", meta: "94.6% of total" },
      { label: "New registrations (30d)", value: "47", meta: "+8 vs prior period" },
      { label: "Retention rate", value: "97.8%", meta: "Stable" },
      { label: "Duplicate detections", value: "3", meta: "6.4% flagged" },
    ],
    [],
  );

  const financialHighlights = useMemo(
    () => [
      { label: "This month", value: "₱1.02M", meta: "+8% vs target", tone: "is-green" },
      { label: "Year-to-date", value: "₱7.3M", meta: "+12% YoY", tone: "is-blue" },
      { label: "Outstanding dues", value: "₱482K", meta: "9.5% of total", tone: "is-red" },
      { label: "Disbursements", value: "₱2.57M", meta: "Benefits assistance", tone: "is-purple" },
    ],
    [],
  );

  const operationsHighlights = useMemo(
    () => [
      { label: "Physical cards", value: "1,247", meta: "6.5% of members", tone: "is-purple" },
      { label: "Digital IDs", value: "17,421", meta: "92% adoption", tone: "is-blue" },
      { label: "Assistance beneficiaries", value: "323", meta: "₱2.57M disbursed", tone: "is-green" },
      { label: "Events this year", value: "12", meta: "87% avg attendance", tone: "is-amber" },
    ],
    [],
  );

  const registrationKPIs = [
    { label: "Avg processing time", value: "2.3 days" },
    { label: "Approval rate", value: "94%" },
    { label: "Pending reviews", value: "47" },
    { label: "Duplicate detections", value: "3 (6.4%)" },
  ];

  return (
    <div className="admin-page admin-stack-xl">
      <header className="admin-row admin-align-start">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="admin-muted">
            Comprehensive insights across membership, finances, and operations with AI-assisted guidance.
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button">
            <Calendar size={16} /> Schedule report
          </button>
          <button type="button" className="admin-button">
            <Filter size={16} /> Custom filter
          </button>
          <button type="button" className="admin-button is-primary">
            <Download size={16} /> Export all
          </button>
        </div>
      </header>

      <section className="admin-filter-bar">
        <div className="admin-filter-bar__group">
          <span className="admin-chip is-blue">AI summary refreshed 2m ago</span>
          <span className="admin-chip--ghost">{contextDescription}</span>
        </div>
        <div className="admin-filter-bar__filters">
          <label className="admin-select">
            <span>Time range</span>
            <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
          </label>
          <label className="admin-select">
            <span>Compare to</span>
            <select value={comparisonRange} onChange={(event) => setComparisonRange(event.target.value)}>
              <option value="previous-period">Previous period</option>
              <option value="previous-year">Same period last year</option>
              <option value="baseline">Quarterly baseline</option>
            </select>
          </label>
          <label className="admin-select">
            <span>Segment</span>
            <select value={segmentFilter} onChange={(event) => setSegmentFilter(event.target.value)}>
              <option value="all">All employers</option>
              <option value="top">Top 25 employers</option>
              <option value="transport">Transport & logistics</option>
              <option value="retail">Retail & services</option>
            </select>
          </label>
        </div>
      </section>

      <section className="admin-card-grid cols-4">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.id} className={`admin-metric-card ${metric.tone}`}>
              <span className="admin-metric-card__icon">
                <Icon size={18} />
              </span>
              <div className="admin-metric-card__content">
                <span className="admin-metric-card__label">{metric.label}</span>
                <strong className="admin-metric-card__value">{metric.value}</strong>
                <span className="admin-metric-card__delta">{metric.delta}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-insight-grid">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className={`admin-insight-card ${card.tone}`}>
              <span className="admin-insight-card__icon">
                <Icon size={18} />
              </span>
              <div className="admin-insight-card__content">
                <strong>{card.title}</strong>
                <span>{card.summary}</span>
                <p>{card.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="admin-tabs">
        <div className="admin-tabs__list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tabs__trigger ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-tabs__content">
          {activeTab === "overview" ? (
            <>
              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <LineChart size={18} />
                    <div>
                      <h2>Membership growth</h2>
                      <p className="admin-muted">Member count and new joiners for the past 8 months.</p>
                    </div>
                  </header>
                  <div className="admin-chart-placeholder">
                    <div className="admin-chart-placeholder__content">
                      <span>Line chart placeholder – plug in analytics library</span>
                      <div className="admin-chart-legend">
                        <span className="is-primary">Members</span>
                        <span className="is-muted">New joiners</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-inline-list">
                    <span>Total members: 18,240</span>
                    <span>New joiners (30d): 47</span>
                    <span>Churn: 1.8%</span>
                  </div>
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <PieChart size={18} />
                    <div>
                      <h2>Member distribution</h2>
                      <p className="admin-muted">Breakdown by employer segments.</p>
                    </div>
                  </header>
                  <div className="admin-stack-sm">
                    {membershipSegments.map((segment) => (
                      <div key={segment.label} className="admin-progress-row">
                        <div className="admin-progress-row__label">
                          <span>{segment.label}</span>
                          <strong>{segment.value.toLocaleString()}</strong>
                        </div>
                        <div className="admin-progress">
                          <span style={{ width: `${segment.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="admin-card">
                <header className="admin-card__heading">
                  <TrendingUp size={18} />
                  <div>
                    <h2>Performance summary</h2>
                    <p className="admin-muted">Cross-functional KPIs monitored in the latest reporting cycle.</p>
                  </div>
                </header>
                <div className="admin-summary-grid">
                  <div className="admin-summary-column">
                    <h3>Membership metrics</h3>
                    <ul className="admin-stat-list">
                      {membershipHighlights.map((item) => (
                        <li key={item.label}>
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                          <small>{item.meta}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="admin-summary-column">
                    <h3>Financial performance</h3>
                    <ul className="admin-stat-list">
                      {financialHighlights.map((item) => (
                        <li key={item.label}>
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                          <small>{item.meta}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="admin-summary-column">
                    <h3>Operational health</h3>
                    <ul className="admin-stat-list">
                      {operationsHighlights.map((item) => (
                        <li key={item.label}>
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                          <small>{item.meta}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <ClipboardList size={18} />
                  <div>
                    <h2>Latest reports</h2>
                    <p className="admin-muted">Quick access to the most recent exports and dashboards.</p>
                  </div>
                </header>
                <div className="admin-report-grid">
                  {reportHistory.map((report) => (
                    <div key={report.id} className="admin-report-tile">
                      <div className="admin-report-tile__body">
                        <strong>{report.title}</strong>
                        <p>{report.summary}</p>
                      </div>
                      <div className="admin-report-tile__meta">
                        <span><Clock size={14} /> {report.generated}</span>
                        <span className="admin-chip is-blue">{report.format}</span>
                      </div>
                      <button type="button" className="admin-button admin-button--ghost">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : null}

          {activeTab === "membership" ? (
            <>
              <section className="admin-card-grid cols-3">
                {["18,203", "47", "97.8%"].map((value, index) => {
                  const labels = [
                    { title: "Active members", meta: "Across 128 locals" },
                    { title: "New registrations", meta: "Past 30 days" },
                    { title: "Retention", meta: "Trailing 12 months" },
                  ];
                  return (
                    <article key={labels[index].title} className="admin-card admin-stack-sm">
                      <span className="admin-card__label">{labels[index].title}</span>
                      <span className="admin-highlight-value">{value}</span>
                      <span className="admin-muted">{labels[index].meta}</span>
                    </article>
                  );
                })}
              </section>

              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <Users size={18} />
                    <div>
                      <h2>By union position</h2>
                      <p className="admin-muted">Active members holding union leadership roles.</p>
                    </div>
                  </header>
                  <div className="admin-stack-sm">
                    {[
                      { label: "Board member", value: 1234, percent: 6 },
                      { label: "Treasurer", value: 567, percent: 3 },
                      { label: "Secretary", value: 389, percent: 2 },
                      { label: "Vice president", value: 156, percent: 1 },
                      { label: "President", value: 112, percent: 1 },
                    ].map((item) => (
                      <div key={item.label} className="admin-progress-row">
                        <div className="admin-progress-row__label">
                          <span>{item.label}</span>
                          <strong>{item.value.toLocaleString()}</strong>
                        </div>
                        <div className="admin-progress">
                          <span style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <BarChart3 size={18} />
                    <div>
                      <h2>By years employed</h2>
                      <p className="admin-muted">Experience distribution across active members.</p>
                    </div>
                  </header>
                  <div className="admin-stack-sm">
                    {[
                      { label: "1-5 years", value: 7698, percent: 40 },
                      { label: "6-10 years", value: 5774, percent: 30 },
                      { label: "11-15 years", value: 3849, percent: 20 },
                      { label: "16-20 years", value: 1540, percent: 8 },
                      { label: "20+ years", value: 386, percent: 2 },
                    ].map((item) => (
                      <div key={item.label} className="admin-progress-row">
                        <div className="admin-progress-row__label">
                          <span>{item.label}</span>
                          <strong>{item.value.toLocaleString()}</strong>
                        </div>
                        <div className="admin-progress">
                          <span style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <ClipboardList size={18} />
                  <div>
                    <h2>Member journey touchpoints</h2>
                    <p className="admin-muted">Monitor onboarding throughput and conversion.</p>
                  </div>
                </header>
                <div className="admin-timeline">
                  {[
                    { time: "Step 1", detail: "Registration submitted (94% completion rate)" },
                    { time: "Step 2", detail: "Payroll consent collected (88% on first contact)" },
                    { time: "Step 3", detail: "AI validation (67% fast-track approvals)" },
                    { time: "Step 4", detail: "Orientation attendance (72% confirmed)" },
                    { time: "Step 5", detail: "ID issuance (2.3 days average)" },
                  ].map((item) => (
                    <div key={item.detail} className="admin-timeline__item">
                      <span>{item.time}</span>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : null}

          {activeTab === "financial" ? (
            <>
              <section className="admin-card-grid cols-4">
                {financialHighlights.map((item) => (
                  <article key={item.label} className={`admin-card admin-stack-sm admin-card--center ${item.tone}`}>
                    <span className="admin-card__value">{item.value}</span>
                    <span className="admin-muted">{item.label}</span>
                    <span className="admin-card__meta">{item.meta}</span>
                  </article>
                ))}
              </section>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <DollarSign size={18} />
                  <div>
                    <h2>Dues collection performance</h2>
                    <p className="admin-muted">Collected vs target by month.</p>
                  </div>
                </header>
                <div className="admin-chart-placeholder">
                  <div className="admin-chart-placeholder__content">
                    <span>Bar chart placeholder – connect your BI chart</span>
                    <div className="admin-chart-legend">
                      <span className="is-primary">Collected</span>
                      <span className="is-muted">Target</span>
                    </div>
                  </div>
                </div>
                <div className="admin-inline-list">
                  <span>Target attainment: 108%</span>
                  <span>Variance: +₱120K</span>
                  <span>Payroll imports: 92%</span>
                </div>
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
                  <div className="admin-stack-sm">
                    {[
                      { label: "SM Investments", value: "₱1.2M", percent: 96 },
                      { label: "Ayala Corporation", value: "₱980K", percent: 90 },
                      { label: "Jollibee Foods", value: "₱742K", percent: 82 },
                      { label: "LRT Operations", value: "₱615K", percent: 78 },
                    ].map((row) => (
                      <div key={row.label} className="admin-progress-row">
                        <div className="admin-progress-row__label">
                          <span>{row.label}</span>
                          <strong>{row.value}</strong>
                        </div>
                        <div className="admin-progress">
                          <span style={{ width: `${row.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <Target size={18} />
                    <div>
                      <h2>Collection focus areas</h2>
                      <p className="admin-muted">Priorities surfaced by AI monitoring.</p>
                    </div>
                  </header>
                  <ul className="admin-list-plain">
                    <li>
                      <span>Outstanding payroll uploads</span>
                      <strong>12 companies</strong>
                    </li>
                    <li>
                      <span>Members with 2+ missed deductions</span>
                      <strong>428 accounts</strong>
                    </li>
                    <li>
                      <span>Manual remittances awaiting reconciliation</span>
                      <strong>₱186K</strong>
                    </li>
                    <li>
                      <span>Projected arrears (next 30d)</span>
                      <strong>₱92K</strong>
                    </li>
                  </ul>
                </article>
              </div>
            </>
          ) : null}

          {activeTab === "operations" ? (
            <>
              <section className="admin-card-grid cols-4">
                {operationsHighlights.map((item) => (
                  <article key={item.label} className={`admin-card admin-stack-sm admin-card--center ${item.tone}`}>
                    <span className="admin-card__value">{item.value}</span>
                    <span className="admin-muted">{item.label}</span>
                    <span className="admin-card__meta">{item.meta}</span>
                  </article>
                ))}
              </section>

              <div className="admin-grid-two">
                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <ClipboardList size={18} />
                    <div>
                      <h2>Registration processing</h2>
                      <p className="admin-muted">Queue health metrics from the last review cycle.</p>
                    </div>
                  </header>
                  <div className="admin-grid-two">
                    {registrationKPIs.map((entry) => (
                      <div key={entry.label} className="admin-kpi-tile">
                        <strong>{entry.value}</strong>
                        <span>{entry.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="admin-inline-list">
                    <span>Fast-track approvals: 67%</span>
                    <span>Manual escalations: 9 cases</span>
                    <span>Consent follow-ups: 14 pending</span>
                  </div>
                </article>

                <article className="admin-card admin-stack-md">
                  <header className="admin-card__heading">
                    <ShieldCheck size={18} />
                    <div>
                      <h2>System performance</h2>
                      <p className="admin-muted">Platform uptime and service reliability.</p>
                    </div>
                  </header>
                  <ul className="admin-list-plain">
                    <li>
                      <span>Database health</span>
                      <strong>98%</strong>
                    </li>
                    <li>
                      <span>API response time</span>
                      <strong>142 ms</strong>
                    </li>
                    <li>
                      <span>Storage usage</span>
                      <strong>67%</strong>
                    </li>
                    <li>
                      <span>Uptime (30d)</span>
                      <strong>99.9%</strong>
                    </li>
                  </ul>
                </article>
              </div>

              <article className="admin-card admin-stack-md">
                <header className="admin-card__heading">
                  <Award size={18} />
                  <div>
                    <h2>Assistance programs</h2>
                    <p className="admin-muted">Benefit disbursements and satisfaction scores.</p>
                  </div>
                </header>
                <div className="admin-grid-two">
                  <div className="admin-assistance-tile">
                    <strong>247</strong>
                    <span>Total requests (30d)</span>
                    <small>+18% vs prior</small>
                  </div>
                  <div className="admin-assistance-tile">
                    <strong>₱2.57M</strong>
                    <span>Funds released</span>
                    <small>Avg turn-around: 3.2 days</small>
                  </div>
                  <div className="admin-assistance-tile">
                    <strong>91%</strong>
                    <span>Member satisfaction</span>
                    <small>Survey sample: 186</small>
                  </div>
                  <div className="admin-assistance-tile">
                    <strong>12</strong>
                    <span>Escalated cases</span>
                    <small>Flagged for manual audit</small>
                  </div>
                </div>
              </article>
            </>
          ) : null}

          {activeTab === "custom" ? (
            <>
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
                      <select defaultValue="membership">
                        <option value="membership">Membership report</option>
                        <option value="financial">Financial summary</option>
                        <option value="attendance">Event attendance</option>
                        <option value="assistance">Benefits & assistance</option>
                        <option value="ai">AI analytics</option>
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Date range</span>
                      <select defaultValue="month">
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="quarter">Last 3 months</option>
                        <option value="year">Last 12 months</option>
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Primary filter</span>
                      <select defaultValue="company">
                        <option value="company">By company</option>
                        <option value="union">By union position</option>
                        <option value="status">By status</option>
                        <option value="region">By region</option>
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Output format</span>
                      <select defaultValue="pdf">
                        <option value="pdf">PDF report</option>
                        <option value="excel">Excel spreadsheet</option>
                        <option value="csv">CSV file</option>
                        <option value="dashboard">Interactive dashboard</option>
                      </select>
                    </label>
                  </div>
                  <button type="button" className="admin-button is-primary admin-report-action">
                    <BarChart3 size={16} /> Generate report
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
                    {scheduledReports.map((entry) => (
                      <div key={entry.id} className="admin-scheduled-row">
                        <div>
                          <strong>{entry.name}</strong>
                          <p className="admin-muted">{entry.cadence} • Next run {entry.nextRun}</p>
                        </div>
                        <div className="admin-scheduled-row__actions">
                          <button type="button" className="admin-button admin-button--ghost">Pause</button>
                          <button type="button" className="admin-button admin-button--ghost">Edit</button>
                        </div>
                      </div>
                    ))}
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
      </div>
    </div>
  );
}
