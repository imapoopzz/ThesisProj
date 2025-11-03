import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import "../../styles/admin-base.css";

function diffWords(original, edited) {
  const originalWords = original.split(/(\s+)/);
  const editedWords = edited.split(/(\s+)/);
  const diff = [];
  let i = 0;
  let j = 0;

  while (i < originalWords.length || j < editedWords.length) {
    if (i >= originalWords.length) {
      diff.push({ type: "addition", text: editedWords[j++] });
      continue;
    }
    if (j >= editedWords.length) {
      diff.push({ type: "deletion", text: originalWords[i++] });
      continue;
    }
    if (originalWords[i] === editedWords[j]) {
      diff.push({ type: "unchanged", text: originalWords[i] });
      i += 1;
      j += 1;
      continue;
    }

    let matched = false;
    for (let lookahead = 1; lookahead <= 4; lookahead += 1) {
      if (editedWords[j + lookahead] === originalWords[i]) {
        for (let k = 0; k < lookahead; k += 1) {
          diff.push({ type: "addition", text: editedWords[j + k] });
        }
        j += lookahead;
        matched = true;
        break;
      }
    }

    if (matched) {
      continue;
    }

    diff.push({ type: "deletion", text: originalWords[i++] });
    diff.push({ type: "addition", text: editedWords[j++] });
  }

  return diff;
}

export default function SuggestionDiffView({
  aiSuggestion,
  proponentEdit,
  title = "Response comparison",
}) {
  const [viewMode, setViewMode] = useState("diff");

  const diff = useMemo(() => diffWords(aiSuggestion, proponentEdit), [aiSuggestion, proponentEdit]);

  return (
    <section className="admin-surface admin-diff">
      <header className="admin-diff__header">
        <h2>{title}</h2>
        <div className="admin-diff__toggle">
          <button
            type="button"
            className={`admin-button ${viewMode === "diff" ? "is-primary" : ""}`.trim()}
            onClick={() => setViewMode("diff")}
          >
            <Eye size={14} /> Diff view
          </button>
          <button
            type="button"
            className={`admin-button ${viewMode === "side" ? "is-primary" : ""}`.trim()}
            onClick={() => setViewMode("side")}
          >
            <EyeOff size={14} /> Side by side
          </button>
        </div>
      </header>

      {viewMode === "diff" ? (
        <div className="admin-diff__body">
          <div className="admin-diff__legend">
            <span className="admin-diff__badge is-add">Added</span>
            <span className="admin-diff__badge is-remove">Removed</span>
          </div>
          <div className="admin-diff__text">
            {diff.map((item, index) => {
              if (item.type === "addition") {
                return (
                  <mark key={`add-${index}`} className="admin-diff__add">
                    {item.text}
                  </mark>
                );
              }
              if (item.type === "deletion") {
                return (
                  <mark key={`del-${index}`} className="admin-diff__remove">
                    {item.text}
                  </mark>
                );
              }
              return <span key={`plain-${index}`}>{item.text}</span>;
            })}
          </div>
        </div>
      ) : (
        <div className="admin-diff__split">
          <article>
            <header>AI suggestion</header>
            <p>{aiSuggestion}</p>
          </article>
          <article>
            <header>Proponent edit</header>
            <p>{proponentEdit}</p>
          </article>
        </div>
      )}
    </section>
  );
}

SuggestionDiffView.propTypes = {
  aiSuggestion: PropTypes.string.isRequired,
  proponentEdit: PropTypes.string.isRequired,
  title: PropTypes.string,
};
