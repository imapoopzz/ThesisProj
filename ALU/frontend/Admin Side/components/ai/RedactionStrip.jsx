import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import "../../styles/admin-base.css";

function highlightRedactions(text) {
  const pattern = /(\[REDACTED:[^\]]+\])/g;
  return text.split(pattern).map((part, idx) => {
    if (pattern.test(part)) {
      return (
        <span key={idx} className="admin-redaction" title="Redacted for privacy">
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function RedactionStrip({
  text,
  redactionSummary,
  canViewOriginal = false,
  onViewOriginal,
}) {
  const total =
    (redactionSummary.names || 0) +
    (redactionSummary.ids || 0) +
    (redactionSummary.addresses || 0) +
    (redactionSummary.phones || 0) +
    (redactionSummary.emails || 0);

  return (
    <section className="admin-redaction-strip">
      <header className="admin-redaction-strip__summary">
        <div className="admin-redaction-strip__summary-left">
          <EyeOff size={16} />
          <strong>{total} items redacted for privacy</strong>
        </div>
        <div className="admin-inline-list">
          {Object.entries(redactionSummary)
            .filter(([, count]) => count)
            .map(([key, count]) => (
              <span key={key} className="admin-chip is-orange">
                {count} {key}
              </span>
            ))}
          {canViewOriginal ? (
            <button type="button" className="admin-button" onClick={onViewOriginal}>
              <Eye size={14} /> View original
            </button>
          ) : null}
        </div>
      </header>
      <div className="admin-redaction-strip__body">
        <p>{highlightRedactions(text)}</p>
      </div>
    </section>
  );
}

RedactionStrip.propTypes = {
  text: PropTypes.string.isRequired,
  redactionSummary: PropTypes.shape({
    names: PropTypes.number,
    ids: PropTypes.number,
    addresses: PropTypes.number,
    phones: PropTypes.number,
    emails: PropTypes.number,
  }).isRequired,
  canViewOriginal: PropTypes.bool,
  onViewOriginal: PropTypes.func,
};
