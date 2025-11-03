import "../styles/admin-base.css";
import { mockAITickets } from "../components/ai/mockAiData";
import ConfidenceBar from "../components/ai/ConfidenceBar";

const metrics = [
  { id: "active", label: "Active benefit cases", value: 42, tone: "is-blue" },
  { id: "approval", label: "Approval rate", value: "92%", tone: "is-green" },
  { id: "processing", label: "Avg processing time", value: "3.4 days" },
  { id: "funds", label: "Funds disbursed", value: "₱1.8M" },
];

const kanbanGroups = [
  { key: "auto-assigned", label: "Auto-assigned", tone: "is-green" },
  { key: "needs-assignment", label: "Needs assignment", tone: "is-orange" },
  { key: "in-progress", label: "In progress", tone: "is-blue" },
];

export default function BenefitsAssistance() {
  const grouped = kanbanGroups.map((group) => ({
    ...group,
    items: mockAITickets.filter((ticket) => ticket.status === group.key).slice(0, 4),
  }));

  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Benefits Assistance</h1>
          <p className="admin-muted">
            Monitor and triage incoming benefits requests with AI-assisted routing and approval signals.
          </p>
        </div>
        <span className="admin-pill">Data snapshot: today</span>
      </header>

      <section className="admin-card-grid cols-4">
        {metrics.map((metric) => (
          <article key={metric.id} className="admin-card">
            <div className="admin-card__label">{metric.label}</div>
            <div className="admin-card__value">{metric.value}</div>
            {metric.tone ? <span className={`admin-chip ${metric.tone}`.trim()}>Live</span> : null}
          </article>
        ))}
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Queue overview</h2>
        <div className="admin-kanban">
          {grouped.map((column) => (
            <div key={column.key} className="admin-kanban__column">
              <h3>
                {column.label}
                <span className={`admin-chip ${column.tone}`.trim()}>
                  {column.items.length}
                </span>
              </h3>
              {column.items.map((ticket) => (
                <div key={ticket.id} className="admin-kanban__card">
                  <div className="admin-kanban__meta">{ticket.ticketId}</div>
                  <strong>{ticket.title}</strong>
                  <p className="admin-muted">{ticket.memberPseudonym}</p>
                  <ConfidenceBar confidence={ticket.suggestion.confidence} size="sm" />
                </div>
              ))}
              {!column.items.length ? (
                <div className="admin-empty-state">
                  <p>No tickets in this state</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Latest submissions</h2>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Member</th>
                <th>Category</th>
                <th>Status</th>
                <th>AI Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {mockAITickets.slice(0, 8).map((ticket) => (
                <tr key={ticket.id}>
                  <td className="admin-proponent__mono">{ticket.ticketId}</td>
                  <td>{ticket.memberPseudonym}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className="admin-chip is-blue">{ticket.status}</span>
                  </td>
                  <td>{ticket.suggestion.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
