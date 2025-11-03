import PropTypes from "prop-types";
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import "../styles/admin-base.css";

const kpiData = [
  {
    title: "Total Members",
    value: "19,247",
    change: "+124 this month",
    icon: Users,
    tone: "is-blue",
  },
  {
    title: "Pending Registrations",
    value: "47",
    change: "Requires review",
    icon: UserCheck,
    tone: "is-orange",
  },
  {
    title: "Active Members",
    value: "18,203",
    change: "94.6% active rate",
    icon: TrendingUp,
    tone: "is-green",
  },
  {
    title: "Dues Overdue",
    value: "1,832",
    change: "9.5% of total",
    icon: AlertTriangle,
    tone: "is-red",
  },
  {
    title: "ID Issuance Queue",
    value: "156",
    change: "Processing time: 2-3 days",
    icon: CreditCard,
    tone: "is-purple",
  },
  {
    title: "Card Requests",
    value: "89",
    change: "23 paid, 66 pending",
    icon: FileText,
    tone: "is-blue",
  },
];

const quickActions = [
  { label: "Approve Registrations", action: "registration-review", count: 47 },
  { label: "Bulk Import Excel", action: "members", count: null },
  { label: "Reconcile Dues", action: "dues-finance", count: 23 },
  { label: "Export Reports", action: "reports-analytics", count: null },
];

const recentActivity = [
  {
    action: "Member Registration Approved",
    member: "Juan dela Cruz - BDO Makati",
    time: "5 minutes ago",
    tone: "is-green",
  },
  {
    action: "Bulk Payment Imported",
    member: "47 payments from Metrobank",
    time: "1 hour ago",
    tone: "is-blue",
  },
  {
    action: "ID Cards Printed",
    member: "Batch #2024-001 (25 cards)",
    time: "2 hours ago",
    tone: "is-purple",
  },
  {
    action: "Member Registration Submitted",
    member: "Maria Santos - SM Corp",
    time: "3 hours ago",
    tone: "is-orange",
  },
  {
    action: "Assistance Request",
    member: "Legal consultation - Pedro Reyes",
    time: "4 hours ago",
    tone: "is-red",
  },
];

const systemStatus = [
  { label: "Database Health", value: 98, accent: "is-green" },
  { label: "API Response Time", value: 142, unit: "ms", accent: "is-green" },
  { label: "Storage Usage", value: 67, accent: "is-orange" },
];

const badgeClassByTone = {
  "is-green": "admin-chip is-green",
  "is-blue": "admin-chip is-blue",
  "is-purple": "admin-chip is-info",
  "is-orange": "admin-chip is-orange",
  "is-red": "admin-chip is-red",
};

export default function Dashboard({ onNavigate }) {
  const navigate = (target) => {
    if (typeof onNavigate === "function") {
      onNavigate(target);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-row">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-muted">
            Welcome to ALUzon Admin. Monitor member growth, finance health, and
            operations at a glance.
          </p>
        </div>
        <div className="admin-actions">
          <button
            type="button"
            className="admin-button is-primary"
            onClick={() => navigate("members")}
          >
            View All Members
          </button>
          <button
            type="button"
            className="admin-button"
            onClick={() => navigate("registration-review")}
          >
            Review Pending
          </button>
        </div>
      </header>

      <section className="admin-surface">
        <h2>Key Metrics</h2>
        <div className="admin-card-grid cols-3">
          {kpiData.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="admin-card">
                <div className="admin-card__label">{item.title}</div>
                <div className="admin-row" style={{ gap: "12px" }}>
                  <div className="admin-card__value">{item.value}</div>
                  <span className={badgeClassByTone[item.tone] || "admin-chip"}>
                    <Icon size={18} />
                  </span>
                </div>
                <div className="admin-card__meta">{item.change}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-card-grid cols-2">
        <article className="admin-surface">
          <div className="admin-row">
            <h2>Quick Actions</h2>
            <span className="admin-pill">Shortcuts</span>
          </div>
          <div className="admin-tag-list">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="admin-button"
                onClick={() => navigate(action.action)}
              >
                <div style={{ flex: 1, textAlign: "left" }}>{action.label}</div>
                {typeof action.count === "number" && (
                  <span className="admin-pill">{action.count}</span>
                )}
              </button>
            ))}
          </div>
        </article>

        <article className="admin-surface">
          <h2>Recent Activity</h2>
          <div className="admin-tag-list">
            {recentActivity.map((activity) => (
              <div key={activity.action} className="admin-card" style={{ gap: "6px" }}>
                <div className="admin-row" style={{ gap: "8px" }}>
                  <span
                    className={badgeClassByTone[activity.tone] || "admin-chip"}
                    style={{ fontSize: "10px" }}
                  >
                    {activity.time}
                  </span>
                  <strong style={{ fontSize: "14px" }}>{activity.action}</strong>
                </div>
                <p className="admin-muted" style={{ margin: 0 }}>
                  {activity.member}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-surface">
        <div className="admin-row">
          <h2>System Status</h2>
          <span className="admin-pill">Infrastructure</span>
        </div>
        <div className="admin-tag-list">
          {systemStatus.map((status) => (
            <div key={status.label} className="admin-metric">
              <span>{status.label}</span>
              <strong>
                {status.value}
                {status.unit ? status.unit : "%"}
              </strong>
            </div>
          ))}
        </div>
        <p className="admin-muted" style={{ marginTop: "12px" }}>
          Status data refreshes automatically every 5 minutes.
        </p>
      </section>

      <footer className="admin-muted" style={{ textAlign: "center", fontSize: "12px" }}>
        © {new Date().getFullYear()} Associated Labor Unions – Luzon Regional.
        Empowering 19,000+ members nationwide.
      </footer>
    </div>
  );
}

Dashboard.propTypes = {
  onNavigate: PropTypes.func,
};
