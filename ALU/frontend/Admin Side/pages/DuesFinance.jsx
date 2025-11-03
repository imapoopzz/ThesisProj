import "../styles/admin-base.css";
import { WalletCards, BarChart3, Receipt, ArrowDownCircle } from "lucide-react";

const duesMetrics = [
  { id: "collected", label: "Collected this month", value: "₱1.2M", tone: "is-green" },
  { id: "pending", label: "Pending payroll", value: "₱280K", tone: "is-orange" },
  { id: "backlog", label: "Arrears", value: "₱95K" },
  { id: "members", label: "Active members", value: "3,218" },
];

const payrollBatches = [
  {
    id: "batch-01",
    employer: "SM Retail Group",
    amount: "₱420,000",
    dueDate: "2025-10-05",
    status: "Processing",
  },
  {
    id: "batch-02",
    employer: "ABC Manufacturing",
    amount: "₱195,500",
    dueDate: "2025-10-06",
    status: "Awaiting file",
  },
  {
    id: "batch-03",
    employer: "TUCP Coop",
    amount: "₱86,900",
    dueDate: "2025-10-07",
    status: "Scheduled",
  },
];

const arrearsMembers = [
  { id: "member-2145", name: "member-2145-ALU", employer: "SM Retail", days: 45, amount: "₱1,850" },
  { id: "member-3001", name: "member-3001-ALU", employer: "ABC Manufacturing", days: 32, amount: "₱1,200" },
  { id: "member-4177", name: "member-4177-ALU", employer: "LRT Operations", days: 60, amount: "₱2,400" },
];

export default function DuesFinance() {
  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Dues & Finance</h1>
          <p className="admin-muted">
            Track payroll deduction status, arrears, and cash flow to keep the union financially healthy.
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button is-primary">
            <ArrowDownCircle size={16} /> Export report
          </button>
        </div>
      </header>

      <section className="admin-card-grid cols-4">
        {duesMetrics.map((metric) => (
          <article key={metric.id} className="admin-card">
            <div className="admin-card__label">{metric.label}</div>
            <div className="admin-card__value">{metric.value}</div>
            {metric.tone ? <span className={`admin-chip ${metric.tone}`.trim()}>Live</span> : null}
          </article>
        ))}
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "10px" }}>
          <WalletCards size={18} />
          <div>
            <h2>Upcoming payroll batches</h2>
            <p className="admin-muted">
              Confirm employer remittances and follow up before they fall behind.
            </p>
          </div>
        </div>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Employer</th>
                <th>Amount</th>
                <th>Due date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="admin-proponent__mono">{batch.id}</td>
                  <td>{batch.employer}</td>
                  <td>{batch.amount}</td>
                  <td>{batch.dueDate}</td>
                  <td>
                    <span className="admin-chip is-blue">{batch.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "10px" }}>
          <BarChart3 size={18} />
          <div>
            <h2>Arrears watchlist</h2>
            <p className="admin-muted">
              Highest-risk members automatically flagged with aging and employer context.
            </p>
          </div>
        </div>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Employer</th>
                <th>Days overdue</th>
                <th>Amount</th>
                <th>Next step</th>
              </tr>
            </thead>
            <tbody>
              {arrearsMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.employer}</td>
                  <td>{member.days} days</td>
                  <td>{member.amount}</td>
                  <td>
                    <span className="admin-chip is-orange">Send reminder</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "10px" }}>
          <Receipt size={18} />
          <div>
            <h2>Finance guidance</h2>
            <p className="admin-muted">
              Align finance ops with union policy. These guardrails help explain how data should be handled.
            </p>
          </div>
        </div>
        <div className="admin-list">
          <span>Verify payroll batch files within 12 hours of receipt.</span>
          <span>Escalate any arrears beyond 45 days to the finance committee.</span>
          <span>Send monthly statements to employers summarizing deductions and remittances.</span>
        </div>
      </section>
    </div>
  );
}
