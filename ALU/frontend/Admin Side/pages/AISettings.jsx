import { useMemo, useState } from "react";
import { Gauge, Rocket, Shield, RefreshCcw, TrendingUp } from "lucide-react";
import "../styles/admin-base.css";
import { aiAnalytics } from "../components/ai/mockAiData";
import ConfidenceBar from "../components/ai/ConfidenceBar";

const modelRollouts = [
  {
    id: "gpt4",
    name: "OpenAI GPT-4 Turbo",
    capabilities: ["Routing", "Drafting", "Summaries"],
    coverage: 0.78,
    lastUpdate: "2025-09-15",
  },
  {
    id: "claude",
    name: "Anthropic Claude Admin",
    capabilities: ["Policy Guardrails", "Audit Notes"],
    coverage: 0.32,
    lastUpdate: "2025-08-20",
  },
];

export default function AISettings() {
  const [controls, setControls] = useState({
    autoAssign: true,
    autoResolve: true,
    auditLogging: true,
    suggestionDiff: true,
  });

  const toggle = (key) => setControls((prev) => ({ ...prev, [key]: !prev[key] }));

  const coverageAverage = useMemo(() => {
    if (!modelRollouts.length) {
      return 0;
    }
    return (
      modelRollouts.reduce((acc, item) => acc + item.coverage, 0) /
      modelRollouts.length
    );
  }, []);

  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>AI Assistance Settings</h1>
          <p className="admin-muted">
            Configure automation coverage, guardrails, and audit policies for the admin AI copilots.
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button">
            <RefreshCcw size={16} /> Sync Models
          </button>
          <button type="button" className="admin-button is-primary">
            <Shield size={16} /> Publish Updates
          </button>
        </div>
      </header>

      <section className="admin-card-grid cols-3">
        <article className="admin-card">
          <div className="admin-card__label">Auto assignment rate</div>
          <div className="admin-row" style={{ gap: "10px" }}>
            <div className="admin-card__value">{aiAnalytics.autoAssignRate}%</div>
            <span className="admin-chip is-green">
              <TrendingUp size={14} /> +3%
            </span>
          </div>
          <div className="admin-card__meta">Tickets routed without manual touch</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Average confidence</div>
          <ConfidenceBar confidence={aiAnalytics.avgConfidence} />
          <div className="admin-card__meta">Across last 30 days of AI decisions</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Override rate</div>
          <div className="admin-card__value">{aiAnalytics.overrideRate}%</div>
          <div className="admin-card__meta">Lower is better; training feeds adjust daily</div>
        </article>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "12px" }}>
          <Gauge size={18} />
          <div>
            <h2>Automation controls</h2>
            <p className="admin-muted">
              Toggle which AI features are active for admins and which require manual review.
            </p>
          </div>
        </div>

        <div className="admin-setting-list">
          <label className="admin-setting-item" htmlFor="autoAssign">
            <div>
              <strong>Auto assignment</strong>
              <p className="admin-muted">
                Route tickets with confidence above 0.80 directly to departments.
              </p>
            </div>
            <button
              type="button"
              id="autoAssign"
              className={`admin-toggle ${controls.autoAssign ? "active" : ""}`}
              onClick={() => toggle("autoAssign")}
            >
              <span />
            </button>
          </label>

          <label className="admin-setting-item" htmlFor="autoResolve">
            <div>
              <strong>Auto resolve FAQs</strong>
              <p className="admin-muted">
                Send approved responses for repetitive inquiries without agent intervention.
              </p>
            </div>
            <button
              type="button"
              id="autoResolve"
              className={`admin-toggle ${controls.autoResolve ? "active" : ""}`}
              onClick={() => toggle("autoResolve")}
            >
              <span />
            </button>
          </label>

          <label className="admin-setting-item" htmlFor="auditLogging">
            <div>
              <strong>Audit logging</strong>
              <p className="admin-muted">
                Require two-factor confirmation before viewing redacted source text.
              </p>
            </div>
            <button
              type="button"
              id="auditLogging"
              className={`admin-toggle ${controls.auditLogging ? "active" : ""}`}
              onClick={() => toggle("auditLogging")}
            >
              <span />
            </button>
          </label>

          <label className="admin-setting-item" htmlFor="suggestionDiff">
            <div>
              <strong>Show diff view</strong>
              <p className="admin-muted">
                Display AI vs proponent edits with inline highlights during approvals.
              </p>
            </div>
            <button
              type="button"
              id="suggestionDiff"
              className={`admin-toggle ${controls.suggestionDiff ? "active" : ""}`}
              onClick={() => toggle("suggestionDiff")}
            >
              <span />
            </button>
          </label>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "12px" }}>
          <Rocket size={18} />
          <div>
            <h2>Model rollout coverage</h2>
            <p className="admin-muted">
              Track which copilots are live across departments and plan next enablements.
            </p>
          </div>
        </div>

  <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Capabilities</th>
                <th> coverage</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {modelRollouts.map((model) => (
                <tr key={model.id}>
                  <td>{model.name}</td>
                  <td>
                    <div className="admin-inline-list">
                      {model.capabilities.map((cap) => (
                        <span key={cap}>{cap}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <ConfidenceBar confidence={model.coverage} showNumeric />
                  </td>
                  <td>{model.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-metric">
          <span>Average coverage</span>
          <strong>{Math.round(coverageAverage * 100)}%</strong>
        </div>
      </section>
    </div>
  );
}
