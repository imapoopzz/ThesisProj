import { useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCcw,
  Clock,
  Send,
} from "lucide-react";
import "../styles/admin-base.css";

const approvalItems = [
  {
    id: "1",
    ticketId: "TCK-2025-0123",
    member: "member-1973-ALU",
    category: "Medical Assistance",
    proponent: "Dr. Ana Rodriguez",
    proponentRole: "Medical Program Director",
    aiConfidence: 0.91,
    timeSince: "2 hours ago",
    status: "Pending Final Approval",
  },
  {
    id: "2",
    ticketId: "TCK-2025-0127",
    member: "member-4521-ALU",
    category: "Legal Consultation",
    proponent: "Atty. Carlos Mendoza",
    proponentRole: "Legal Affairs Head",
    aiConfidence: 0.78,
    timeSince: "4 hours ago",
    status: "Pending Final Approval",
  },
  {
    id: "3",
    ticketId: "TCK-2025-0119",
    member: "member-5024-ALU",
    category: "Financial Assistance",
    proponent: "Maria Gomez",
    proponentRole: "Benefits Coordinator",
    aiConfidence: 0.66,
    timeSince: "6 hours ago",
    status: "Returned to Proponent",
  },
  {
    id: "4",
    ticketId: "TCK-2025-0111",
    member: "member-6520-ALU",
    category: "Grievance Response",
    proponent: "Josefina Ramos",
    proponentRole: "Industrial Relations",
    aiConfidence: 0.83,
    timeSince: "8 hours ago",
    status: "Approved & Sent",
  },
];

const statusTone = {
  "Pending Final Approval": "is-orange",
  "Approved & Sent": "is-green",
  Rejected: "is-red",
  "Returned to Proponent": "is-blue",
};

export default function AdminFinalApprovalQueue() {
  const pending = useMemo(
    () => approvalItems.filter((item) => item.status === "Pending Final Approval"),
    [],
  );

  const approvedToday = approvalItems.filter(
    (item) => item.status === "Approved & Sent",
  ).length;
  const returned = approvalItems.filter(
    (item) => item.status === "Returned to Proponent",
  ).length;
  const rejected = approvalItems.filter((item) => item.status === "Rejected").length;

  return (
    <div className="admin-page">
      <header className="admin-row">
        <div>
          <h1>Final Approval Queue</h1>
          <p className="admin-muted">
            Review proponent-approved responses and confirm the final version
            before they reach members.
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button">
            <RefreshCcw size={16} /> Refresh Data
          </button>
        </div>
      </header>

      <section className="admin-card-grid cols-4">
        <article className="admin-card">
          <div className="admin-card__label">Pending Final Approval</div>
          <div className="admin-row" style={{ gap: "10px" }}>
            <div className="admin-card__value">{pending.length}</div>
            <span className="admin-chip is-orange">
              <Clock size={16} /> Queue
            </span>
          </div>
          <div className="admin-card__meta">
            Responses that still need the admin signature
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__label">Approved Today</div>
          <div className="admin-row">
            <div className="admin-card__value">{approvedToday}</div>
            <span className="admin-chip is-green">
              <Send size={16} /> Sent
            </span>
          </div>
          <div className="admin-card__meta">Messages released to members</div>
        </article>

        <article className="admin-card">
          <div className="admin-card__label">Returned for Revision</div>
          <div className="admin-row">
            <div className="admin-card__value">{returned}</div>
            <span className="admin-chip is-blue">
              <RefreshCcw size={16} /> Feedback
            </span>
          </div>
          <div className="admin-card__meta">Awaiting proponent adjustment</div>
        </article>

        <article className="admin-card">
          <div className="admin-card__label">Rejected Responses</div>
          <div className="admin-row">
            <div className="admin-card__value">{rejected}</div>
            <span className="admin-chip is-red">
              <XCircle size={16} /> Rejected
            </span>
          </div>
          <div className="admin-card__meta">Flagged for policy review</div>
        </article>
      </section>

      <section className="admin-surface">
        <div className="admin-row">
          <h2>Responses Awaiting Final Approval</h2>
          <span className="admin-pill">Confidence & timestamps from AI assistance</span>
        </div>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Member Alias</th>
                <th>Category</th>
                <th>Proponent</th>
                <th>AI Confidence</th>
                <th>Time Since Approval</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvalItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.ticketId}</td>
                  <td>{item.member}</td>
                  <td>{item.category}</td>
                  <td>
                    <div className="admin-stat">
                      <span>Proponent</span>
                      <span>{item.proponent}</span>
                      <span className="admin-muted">{item.proponentRole}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-progress" style={{ width: "140px" }}>
                      <span style={{ width: `${Math.round(item.aiConfidence * 100)}%` }} />
                    </div>
                    <div className="admin-muted" style={{ fontSize: "12px" }}>
                      {Math.round(item.aiConfidence * 100)}% match
                    </div>
                  </td>
                  <td>{item.timeSince}</td>
                  <td>
                    <span className={statusTone[item.status] || "admin-chip"}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-surface">
        <h2>Guidelines</h2>
        <div className="admin-tag-list">
          <div className="admin-card">
            <div className="admin-row" style={{ gap: "8px" }}>
              <CheckCircle size={18} color="#16a34a" />
              <strong>Approve when tone, accuracy, and policy all align.</strong>
            </div>
            <p className="admin-muted" style={{ marginTop: "6px" }}>
              Double-check that any monetary amounts and deadlines match the
              attached documents before sending.
            </p>
          </div>
          <div className="admin-card">
            <div className="admin-row" style={{ gap: "8px" }}>
              <RefreshCcw size={18} color="#1d4ed8" />
              <strong>Return to proponent with actionable feedback.</strong>
            </div>
            <p className="admin-muted" style={{ marginTop: "6px" }}>
              Summarize what needs to change (tone, phrasing, missing details)
              so responses are revised quickly.
            </p>
          </div>
          <div className="admin-card">
            <div className="admin-row" style={{ gap: "8px" }}>
              <XCircle size={18} color="#b91c1c" />
              <strong>Reject only when necessary.</strong>
            </div>
            <p className="admin-muted" style={{ marginTop: "6px" }}>
              Rejections should be reserved for policy breaches or sensitive
              cases that require offline handling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
