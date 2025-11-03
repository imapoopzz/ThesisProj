import PropTypes from "prop-types";
import { User, Bot, Eye, UserCheck, Settings } from "lucide-react";
import "../../styles/admin-base.css";

const actionTone = {
  "auto-assign": "is-blue",
  override: "is-orange",
  "view-original": "",
  "model-call": "is-blue",
  approve: "is-green",
  reject: "is-red",
  "settings-change": "",
};

function formatTimestamp(timestamp, compact) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  if (compact) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleString();
}

function getActionDescription(entry) {
  const { action, metadata = {}, reason, ticketId } = entry;
  switch (action) {
    case "auto-assign":
      return `auto-assigned ticket ${ticketId} to ${metadata.assignedTo || "queue"}`;
    case "override":
      return `overrode ticket ${ticketId} routing to ${metadata.assignedTo || "manual"}${reason ? ` — ${reason}` : ""}`;
    case "view-original":
      return `viewed original content for ${ticketId || "record"}`;
    case "model-call":
      return `processed ticket ${ticketId} with ${metadata.model || "AI model"}`;
    case "approve":
      return `approved ticket ${ticketId}${reason ? ` — ${reason}` : ""}`;
    case "reject":
      return `rejected ticket ${ticketId}${reason ? ` — ${reason}` : ""}`;
    case "settings-change":
      return `changed ${metadata.previousValue || "setting"} to ${metadata.newValue || "new value"}`;
    default:
      return `performed ${action} on ${ticketId || "system"}`;
  }
}

function ActorIcon({ actor }) {
  switch (actor) {
    case "AI":
      return <Bot size={16} color="#2563eb" />;
    case "admin":
      return <UserCheck size={16} color="#16a34a" />;
    case "proponent":
      return <User size={16} color="#7c3aed" />;
    case "system":
    default:
      return <Settings size={16} color="#475569" />;
  }
}

ActorIcon.propTypes = {
  actor: PropTypes.string.isRequired,
};

export default function AuditRow({ entry, onViewTicket, compact = false, className = "" }) {
  const tone = actionTone[entry.action] || "";
  const description = getActionDescription(entry);

  if (compact) {
    return (
      <div className={`admin-audit-row compact ${className}`.trim()}>
        <div className="admin-audit-row__meta">
          <ActorIcon actor={entry.actor} />
          <span>{formatTimestamp(entry.timestamp, true)}</span>
        </div>
        <div className="admin-audit-row__body" title={description}>
          <strong>{entry.actorName || entry.actor}</strong> {description}
        </div>
        {entry.ticketId && onViewTicket ? (
          <button
            type="button"
            onClick={() => onViewTicket(entry.ticketId)}
            className="admin-button"
          >
            <Eye size={14} /> View
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`admin-audit-row ${className}`.trim()}>
      <div className="admin-audit-row__side">
        <ActorIcon actor={entry.actor} />
        <span className="admin-muted">{formatTimestamp(entry.timestamp)}</span>
        <span className={`admin-chip ${tone}`.trim()}>{entry.action.replace("-", " ")}</span>
      </div>
      <div className="admin-audit-row__body">
        <p>
          <strong>{entry.actorName || entry.actor}</strong> {description}
        </p>
        {entry.metadata && Object.keys(entry.metadata).length ? (
          <div className="admin-pill-group">
            {entry.metadata.model ? (
              <span className="admin-pill">Model: {entry.metadata.model}</span>
            ) : null}
            {entry.metadata.confidence ? (
              <span className="admin-pill">Confidence: {(entry.metadata.confidence * 100).toFixed(0)}%</span>
            ) : null}
          </div>
        ) : null}
      </div>
      {entry.ticketId && onViewTicket ? (
        <button
          type="button"
          onClick={() => onViewTicket(entry.ticketId)}
          className="admin-button"
        >
          <Eye size={14} /> View Ticket
        </button>
      ) : null}
    </div>
  );
}

AuditRow.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    actor: PropTypes.oneOf(["AI", "admin", "proponent", "system"]).isRequired,
    actorName: PropTypes.string,
    action: PropTypes.string.isRequired,
    ticketId: PropTypes.string,
    reason: PropTypes.string,
    metadata: PropTypes.object,
  }).isRequired,
  onViewTicket: PropTypes.func,
  compact: PropTypes.bool,
  className: PropTypes.string,
};
