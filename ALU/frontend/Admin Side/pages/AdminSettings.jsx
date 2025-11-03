import { useState } from "react";
import { Check, Shield, Bell, Database, Save } from "lucide-react";
import "../styles/admin-base.css";

const escalationLevels = [
  {
    id: "level-1",
    name: "Standard Requests",
    owner: "Benefits Team",
    response: "24 hours",
    fallback: "AI summary only",
  },
  {
    id: "level-2",
    name: "Sensitive Cases",
    owner: "Senior Officer",
    response: "12 hours",
    fallback: "Manual review required",
  },
  {
    id: "level-3",
    name: "Critical Issues",
    owner: "Director",
    response: "4 hours",
    fallback: "Auto-escalate to hotline",
  },
];

export default function AdminSettings() {
  const [notifications, setNotifications] = useState({
    dailyDigest: true,
    aiSummary: true,
    escalationSms: false,
  });

  const toggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Admin Settings</h1>
          <p className="admin-muted">
            Manage platform-wide defaults, escalation policies, and security
            controls to keep the admin experience consistent.
          </p>
        </div>
        <button type="button" className="admin-button">
          <Save size={16} /> Save Changes
        </button>
      </header>

      <section className="admin-card-grid cols-3">
        <article className="admin-card">
          <div className="admin-card__label">Environment</div>
          <div className="admin-card__value">Production</div>
          <div className="admin-card__meta">
            Connected to live member services data
          </div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Default Response SLA</div>
          <div className="admin-card__value">24h</div>
          <div className="admin-card__meta">Applies to untagged requests</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">AI Assist Rollout</div>
          <div className="admin-card__value">78%</div>
          <div className="admin-card__meta">
            Admins with AI suggestions enabled
          </div>
        </article>
      </section>

      <section className="admin-surface admin-stack-md">
        <header className="admin-row">
          <div className="admin-row" style={{ gap: "8px" }}>
            <Bell size={18} />
            <div>
              <h2>Notifications</h2>
              <p className="admin-muted">
                Configure alerts sent to the admin team when critical events occur.
              </p>
            </div>
          </div>
        </header>
        <div className="admin-setting-list">
          <label htmlFor="dailyDigest" className="admin-setting-item">
            <div>
              <strong>Daily email digest</strong>
              <p className="admin-muted">
                Receive a morning summary of pending approvals and escalations.
              </p>
            </div>
            <button
              type="button"
              id="dailyDigest"
              className={`admin-toggle ${notifications.dailyDigest ? "active" : ""}`}
              onClick={() => toggle("dailyDigest")}
            >
              <span />
            </button>
          </label>

          <label htmlFor="aiSummary" className="admin-setting-item">
            <div>
              <strong>Include AI summary with alerts</strong>
              <p className="admin-muted">
                Attach short bullet points of AI-detected highlights when sending notifications.
              </p>
            </div>
            <button
              type="button"
              id="aiSummary"
              className={`admin-toggle ${notifications.aiSummary ? "active" : ""}`}
              onClick={() => toggle("aiSummary")}
            >
              <span />
            </button>
          </label>

          <label htmlFor="escalationSms" className="admin-setting-item">
            <div>
              <strong>Escalation SMS alerts</strong>
              <p className="admin-muted">
                Text-message the duty officer if a ticket remains unassigned after escalation.
              </p>
            </div>
            <button
              type="button"
              id="escalationSms"
              className={`admin-toggle ${notifications.escalationSms ? "active" : ""}`}
              onClick={() => toggle("escalationSms")}
            >
              <span />
            </button>
          </label>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "8px" }}>
          <Shield size={18} />
          <div>
            <h2>Access & Role Controls</h2>
            <p className="admin-muted">
              Map personas to capabilities to simplify onboarding and audits.
            </p>
          </div>
        </div>
        <div className="admin-role-grid">
          <div className="admin-role-card">
            <h3>Admin Supervisor</h3>
            <ul>
              <li>Approve final responses</li>
              <li>Override AI redactions</li>
              <li>Manage union-wide settings</li>
            </ul>
            <span className="admin-chip is-green">12 assigned</span>
          </div>
          <div className="admin-role-card">
            <h3>Benefits Officer</h3>
            <ul>
              <li>Handle benefits-related tickets</li>
              <li>Access member documents</li>
              <li>Submit feedback to AI team</li>
            </ul>
            <span className="admin-chip is-blue">24 assigned</span>
          </div>
          <div className="admin-role-card">
            <h3>Guest Auditor</h3>
            <ul>
              <li>Read-only access</li>
              <li>Export reports</li>
              <li>Leave compliance notes</li>
            </ul>
            <span className="admin-chip">6 assigned</span>
          </div>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "8px" }}>
          <Database size={18} />
          <div>
            <h2>Escalation Matrix</h2>
            <p className="admin-muted">
              Define who is accountable at each severity level and how quickly they must respond.
            </p>
          </div>
        </div>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Primary Owner</th>
                <th>Response Time</th>
                <th>Fallback</th>
                <th>Confirmation</th>
              </tr>
            </thead>
            <tbody>
              {escalationLevels.map((level) => (
                <tr key={level.id}>
                  <td>{level.name}</td>
                  <td>{level.owner}</td>
                  <td>{level.response}</td>
                  <td>{level.fallback}</td>
                  <td>
                    <span className="admin-chip is-green">
                      <Check size={14} /> On track
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
