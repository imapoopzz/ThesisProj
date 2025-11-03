import "../styles/admin-base.css";
import { mockAuditEntries } from "../components/ai/mockAiData";
import AuditRow from "../components/ai/AuditRow";
import { ShieldAlert } from "lucide-react";

export default function AuditLog() {
  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>AI Audit Log</h1>
          <p className="admin-muted">
            Every automated action and manual override is captured here to meet compliance requirements.
          </p>
        </div>
        <span className="admin-pill">Retention: 90 days</span>
      </header>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "8px" }}>
          <ShieldAlert size={18} />
          <div>
            <h2>Recent entries</h2>
            <p className="admin-muted">Existing sample data highlights how entries appear to reviewers.</p>
          </div>
        </div>
        <div>
          {mockAuditEntries.map((entry) => (
            <AuditRow key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
