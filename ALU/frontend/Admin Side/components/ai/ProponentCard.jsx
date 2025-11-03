import PropTypes from "prop-types";
import { Check, X, Edit, Clock } from "lucide-react";
import "../../styles/admin-base.css";
import ConfidenceBar from "./ConfidenceBar";
import AIBadge from "./AIBadge";

const statusLabels = {
  pending: { label: "Pending Review", tone: "is-blue" },
  approved: { label: "Approved", tone: "is-green" },
  rejected: { label: "Rejected", tone: "is-red" },
  editing: { label: "In Edit", tone: "" },
};

export default function ProponentCard({
  proponent,
  ticketId,
  memberPseudonym,
  suggestedResponse,
  dueDate,
  status,
  confidence,
  onApprove,
  onReject,
  onEdit,
}) {
  const statusConfig = statusLabels[status] || statusLabels.pending;
  const initials = proponent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const due = new Date(dueDate);
  const now = new Date();
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isOverdue = diffHours < 0;
  const isDueSoon = diffHours >= 0 && diffHours <= 24;

  return (
    <article className={`admin-card admin-proponent ${isOverdue ? "is-danger" : isDueSoon ? "is-warning" : ""}`.trim()}>
      <header className="admin-proponent__header">
        <div className="admin-proponent__person">
          <span className="admin-avatar">{initials}</span>
          <div>
            <strong>{proponent.name}</strong>
            <p className="admin-muted">
              {proponent.role} • {proponent.department}
            </p>
          </div>
        </div>
        <span className={`admin-chip ${statusConfig.tone || ""}`.trim()}>
          {statusConfig.label}
        </span>
      </header>

      <div className="admin-proponent__grid">
        <div>
          <span className="admin-muted">Ticket ID</span>
          <p className="admin-proponent__mono">{ticketId}</p>
        </div>
        <div>
          <span className="admin-muted">Member</span>
          <p>{memberPseudonym}</p>
        </div>
      </div>

      <div className="admin-proponent__due">
        <Clock size={16} />
        <span className="admin-muted">Due:</span>
        <strong className={isOverdue ? "is-red" : isDueSoon ? "is-orange" : ""}>
          {new Date(dueDate).toLocaleString()}
        </strong>
        {isOverdue ? <span className="admin-chip is-red">Overdue</span> : null}
        {!isOverdue && isDueSoon ? <span className="admin-chip is-orange">Due soon</span> : null}
      </div>

      {typeof confidence === "number" ? (
        <div className="admin-proponent__confidence">
          <AIBadge showTooltip={false} />
          <ConfidenceBar confidence={confidence} size="sm" />
        </div>
      ) : null}

      <div className="admin-proponent__response">
        <p className="admin-muted">Suggested response</p>
        <div className="admin-proponent__response-box">
          <p>{suggestedResponse}</p>
        </div>
      </div>

      {status === "pending" ? (
        <div className="admin-proponent__actions">
          <button type="button" className="admin-button is-success" onClick={onApprove}>
            <Check size={14} /> Approve
          </button>
          <button type="button" className="admin-button" onClick={onEdit}>
            <Edit size={14} /> Edit
          </button>
          <button type="button" className="admin-button is-danger" onClick={onReject}>
            <X size={14} />
          </button>
        </div>
      ) : null}

      {status === "editing" ? (
        <div className="admin-proponent__note">
          <p className="admin-muted">Editing in progress. Continue refining response before resubmitting.</p>
        </div>
      ) : null}

      {(status === "approved" || status === "rejected") ? (
        <div className="admin-proponent__note">
          <p className="admin-muted">
            {status === "approved"
              ? "Sent to admin for final approval."
              : "Response rejected and returned to proponent."}
          </p>
        </div>
      ) : null}
    </article>
  );
}

ProponentCard.propTypes = {
  proponent: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
  }).isRequired,
  ticketId: PropTypes.string.isRequired,
  memberPseudonym: PropTypes.string.isRequired,
  suggestedResponse: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["pending", "approved", "rejected", "editing"]).isRequired,
  confidence: PropTypes.number,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onEdit: PropTypes.func,
};
