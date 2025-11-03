import "../styles/admin-base.css";
import { BadgeCheck, Printer, Smartphone, RefreshCcw } from "lucide-react";

const productionQueue = [
  { id: "card-001", member: "member-1973-ALU", type: "Physical", status: "Printing", requested: "2025-10-01" },
  { id: "card-002", member: "member-2841-ALU", type: "Digital", status: "Active", requested: "2025-09-28" },
  { id: "card-003", member: "member-4177-ALU", type: "Replacement", status: "Pending Photo", requested: "2025-09-27" },
];

const guides = [
  "Digital IDs activate instantly after verification",
  "Physical card replacements require notarized affidavit",
  "Use member photos captured within the last 12 months",
  "Scan QR codes to validate membership in the field",
];

export default function IDCardManagement() {
  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>ID Card Management</h1>
          <p className="admin-muted">
            Manage physical and digital membership IDs, including replacements and activation status.
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button">
            <RefreshCcw size={16} /> Sync with member DB
          </button>
        </div>
      </header>

      <section className="admin-card-grid cols-3">
        <article className="admin-card">
          <div className="admin-card__label">Digital IDs active</div>
          <div className="admin-card__value">5,812</div>
          <div className="admin-card__meta">Members using mobile wallet access</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Physical cards queued</div>
          <div className="admin-card__value">312</div>
          <div className="admin-card__meta">In production with print vendor</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Replacements today</div>
          <div className="admin-card__value">28</div>
          <div className="admin-card__meta">Lost card claims approved</div>
        </article>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "10px" }}>
          <Printer size={18} />
          <div>
            <h2>Production queue</h2>
            <p className="admin-muted">Track progress across physical printing and digital activation.</p>
          </div>
        </div>
        <div className="admin-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Member</th>
                <th>Type</th>
                <th>Status</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {productionQueue.map((item) => (
                <tr key={item.id}>
                  <td className="admin-proponent__mono">{item.id}</td>
                  <td>{item.member}</td>
                  <td>{item.type}</td>
                  <td>
                    <span className="admin-chip is-blue">{item.status}</span>
                  </td>
                  <td>{item.requested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Guidelines</h2>
        <div className="admin-pill-group">
          {guides.map((guide) => (
            <span key={guide}>{guide}</span>
          ))}
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Digital experience</h2>
        <div className="admin-card-grid cols-2">
          <article className="admin-card">
            <div className="admin-card__label">Verification pass rate</div>
            <div className="admin-card__value">98.4%</div>
            <div className="admin-card__meta">Powered by biometric checks</div>
          </article>
          <article className="admin-card">
            <div className="admin-card__label">Mobile wallet adoption</div>
            <div className="admin-card__value">72%</div>
            <div className="admin-card__meta">Members using digital IDs weekly</div>
          </article>
        </div>
        <div className="admin-inline-list">
          <span><BadgeCheck size={14} /> Verified</span>
          <span><Smartphone size={14} /> Tap to show ID</span>
        </div>
      </section>
    </div>
  );
}
