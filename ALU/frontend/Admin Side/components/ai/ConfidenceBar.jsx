import PropTypes from "prop-types";
import "../../styles/admin-base.css";

const SIZE_HEIGHT = {
  sm: "6px",
  md: "8px",
  lg: "10px",
};

const sizeFont = {
  sm: "11px",
  md: "13px",
  lg: "15px",
};

export default function ConfidenceBar({ confidence, showNumeric = true, size = "md", model = "OpenAI GPT-4" }) {
  const percentage = Math.max(0, Math.min(100, Math.round(confidence * 100)));

  const color = (() => {
    if (percentage >= 85) return "linear-gradient(135deg, #22c55e, #16a34a)";
    if (percentage >= 60) return "linear-gradient(135deg, #f59e0b, #d97706)";
    return "linear-gradient(135deg, #ef4444, #b91c1c)";
  })();

  return (
    <span title={`Confidence ${confidence.toFixed(2)} powered by ${model}`} className="admin-confidence">
      {showNumeric ? (
        <span style={{ fontSize: sizeFont[size] || sizeFont.md }} className="admin-confidence__value">
          {percentage}%
        </span>
      ) : null}
      <span
        className="admin-confidence__bar"
        style={{ height: SIZE_HEIGHT[size] || SIZE_HEIGHT.md }}
      >
        <span style={{ width: `${percentage}%`, background: color }} />
      </span>
    </span>
  );
}

ConfidenceBar.propTypes = {
  confidence: PropTypes.number.isRequired,
  showNumeric: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  model: PropTypes.string,
};
