import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import "../styles/admin-base.css";

const pendingRegistrations = [
  {
    id: "REG-2024-001",
    fullName: "Maria Santos",
    email: "maria.santos@sm.com.ph",
    phone: "+63 917 234 5678",
    company: "SM Investments Corporation",
    department: "Human Resources",
    position: "Assistant Manager",
    unionAffiliation: "SM Workers Union",
    submittedDate: "2024-09-20",
    status: "Pending Review",
    priority: "Normal",
    duplicateFlag: false,
    address: "Makati City, Metro Manila",
    yearsEmployed: 5,
    membershipType: "Regular",
    payrollConsent: true,
    idPhoto: "1.3 MB • JPG",
    employmentCertificate: "0.9 MB • PDF",
    unionForm: "1.1 MB • PDF",
    validationChecks: {
      emailValid: true,
      phoneValid: true,
      documentsComplete: true,
      companyVerified: true,
      noDuplicates: true,
    },
    riskNotes: [
      "AI confidence score: 0.92 (low risk)",
      "Employment verified via payroll API",
      "All documents submitted within SLAs",
    ],
    timeline: [
      { time: "Sep 20, 9:14 AM", detail: "Registration submitted by member" },
      { time: "Sep 20, 9:16 AM", detail: "AI pre-screen passed" },
      { time: "Sep 20, 9:24 AM", detail: "Payroll consent confirmed" },
      { time: "Sep 20, 10:01 AM", detail: "Queued for admin review" },
    ],
  },
  {
    id: "REG-2024-002",
    fullName: "Carlos Mendoza",
    email: "carlos.mendoza@ayala.com.ph",
    phone: "+63 918 765 4321",
    company: "Ayala Corporation",
    department: "Finance",
    position: "Senior Analyst",
    unionAffiliation: "Ayala Employees Association",
    submittedDate: "2024-09-19",
    status: "Under Review",
    priority: "High",
    duplicateFlag: true,
    address: "Quezon City, Metro Manila",
    yearsEmployed: 7,
    membershipType: "Regular",
    payrollConsent: false,
    idPhoto: "1.1 MB • JPG",
    employmentCertificate: "—",
    unionForm: "0.8 MB • PDF",
    validationChecks: {
      emailValid: true,
      phoneValid: true,
      documentsComplete: false,
      companyVerified: true,
      noDuplicates: false,
    },
    riskNotes: [
      "Potential duplicate detected: ALU-2023-0156",
      "Payroll consent missing – requires manual follow-up",
      "Employment certificate not uploaded",
    ],
    timeline: [
      { time: "Sep 19, 8:42 AM", detail: "Registration submitted by member" },
      { time: "Sep 19, 8:50 AM", detail: "AI flagged missing documentation" },
      { time: "Sep 19, 9:15 AM", detail: "Duplicate detected: similar email domain" },
      { time: "Sep 19, 10:30 AM", detail: "Awaiting manual verification" },
    ],
  },
  {
    id: "REG-2024-003",
    fullName: "Lisa Rodriguez",
    email: "lisa.rodriguez@jollibee.com.ph",
    phone: "+63 917 555 7788",
    company: "Jollibee Foods Corporation",
    department: "Operations",
    position: "Store Manager",
    unionAffiliation: "Fast Food Workers Union",
    submittedDate: "2024-09-18",
    status: "Pending Review",
    priority: "Normal",
    duplicateFlag: false,
    address: "Pasig City, Metro Manila",
    yearsEmployed: 3,
    membershipType: "Associate",
    payrollConsent: true,
    idPhoto: "1.0 MB • JPG",
    employmentCertificate: "1.2 MB • PDF",
    unionForm: "0.9 MB • PDF",
    validationChecks: {
      emailValid: true,
      phoneValid: false,
      documentsComplete: true,
      companyVerified: true,
      noDuplicates: true,
    },
    riskNotes: [
      "Phone number flagged – verification SMS bounced",
      "All documents submitted and signed",
      "Payroll consent confirmed",
    ],
    timeline: [
      { time: "Sep 18, 7:40 AM", detail: "Registration submitted by member" },
      { time: "Sep 18, 7:46 AM", detail: "AI flagged invalid phone format" },
      { time: "Sep 18, 8:05 AM", detail: "Email verification completed" },
      { time: "Sep 18, 9:22 AM", detail: "Awaiting contact correction" },
    ],
  },
];

const rejectionReasons = [
  "Incomplete documentation",
  "Invalid company information",
  "Duplicate registration detected",
  "Invalid contact information",
  "Photo quality issues",
  "Employment verification failed",
  "Other (specify below)",
];

export default function RegistrationReview() {
  const [selectedId, setSelectedId] = useState(pendingRegistrations[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("details");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(rejectionReasons[0]);
  const [customReason, setCustomReason] = useState("");

  const selectedRegistration = useMemo(
    () => pendingRegistrations.find((entry) => entry.id === selectedId),
    [selectedId],
  );

  const summary = useMemo(() => {
    const totalPending = pendingRegistrations.length;
    const highPriority = pendingRegistrations.filter((entry) => entry.priority === "High").length;
    const duplicates = pendingRegistrations.filter((entry) => entry.duplicateFlag).length;
    const docIssues = pendingRegistrations.filter((entry) => !entry.validationChecks.documentsComplete).length;
    return { totalPending, highPriority, duplicates, docIssues };
  }, []);

  const resetRejectionForm = () => {
    setRejectionReason(rejectionReasons[0]);
    setCustomReason("");
  };

  const handleApprove = () => {
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    setShowRejectDialog(false);
    resetRejectionForm();
  };

  const renderValidationRow = (label, valid) => (
    <div className="admin-validation-row" key={label}>
      <span>{label}</span>
      <span className={`admin-validation-status ${valid ? "is-valid" : "is-invalid"}`}>
        {valid ? <Check size={14} /> : <X size={14} />}
        {valid ? "Valid" : "Needs attention"}
      </span>
    </div>
  );

  return (
    <div className="admin-page admin-stack-xl">
      <header className="admin-row admin-align-start">
        <div>
          <h1>Registration Review</h1>
          <p className="admin-muted">
            Review and approve pending member registrations ({summary.totalPending} waiting in queue).
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button">
            Bulk actions
          </button>
          <button type="button" className="admin-button">
            <Download size={16} /> Export queue
          </button>
        </div>
      </header>

      <section className="admin-card-grid cols-4">
        <article className="admin-card">
          <div className="admin-card__label">Pending approvals</div>
          <div className="admin-card__value">{summary.totalPending}</div>
          <div className="admin-card__meta">AI pre-screen suggests 6 fast track</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">High risk cases</div>
          <div className="admin-card__value">{summary.highPriority}</div>
          <div className="admin-card__meta">Need manual verification</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Potential duplicates</div>
          <div className="admin-card__value">{summary.duplicates}</div>
          <div className="admin-card__meta">Auto-matched via email + employer</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Incomplete documents</div>
          <div className="admin-card__value">{summary.docIssues}</div>
          <div className="admin-card__meta">AI flagged missing uploads</div>
        </article>
      </section>

      <div className="admin-registration-layout">
        <aside className="admin-queue">
          <div className="admin-queue__header">
            <h2>Review queue</h2>
            <span className="admin-pill">
              <Clock size={14} /> Auto-sorted by priority
            </span>
          </div>
          <div className="admin-queue__list">
            {pendingRegistrations.map((registration) => {
              const isActive = registration.id === selectedId;
              return (
                <button
                  type="button"
                  key={registration.id}
                  className={`admin-queue__item ${isActive ? "is-active" : ""}`}
                  onClick={() => {
                    setSelectedId(registration.id);
                    setActiveTab("details");
                  }}
                >
                  <div className="admin-queue__item-header">
                    <div className="admin-queue__identity">
                      <div className="admin-avatar admin-avatar--sm">
                        {registration.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="admin-queue__name">{registration.fullName}</p>
                        <p className="admin-muted">{registration.company}</p>
                      </div>
                    </div>
                    <span
                      className={`admin-badge ${
                        registration.priority === "High"
                          ? "is-red"
                          : registration.priority === "Normal"
                          ? "is-blue"
                          : "is-purple"
                      }`}
                    >
                      {registration.priority}
                    </span>
                  </div>
                  <div className="admin-queue__meta">
                    <span>{registration.submittedDate}</span>
                    <span>{registration.status}</span>
                  </div>
                  <div className="admin-queue__flags">
                    {registration.duplicateFlag ? (
                      <span className="admin-chip is-orange">
                        <AlertTriangle size={14} /> Duplicate warning
                      </span>
                    ) : null}
                    {!registration.validationChecks.documentsComplete ? (
                      <span className="admin-chip is-red">
                        <FileText size={14} /> Document issue
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="admin-registration-detail">
          {selectedRegistration ? (
            <div className="admin-surface admin-stack-lg">
              <header className="admin-registration-detail__header">
                <div className="admin-registration-detail__identity">
                  <div className="admin-avatar admin-avatar--lg">
                    {selectedRegistration.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2>{selectedRegistration.fullName}</h2>
                    <p className="admin-muted">{selectedRegistration.email}</p>
                    <div className="admin-inline-list">
                      <span>
                        <Phone size={14} /> {selectedRegistration.phone}
                      </span>
                      <span>
                        <Building2 size={14} /> {selectedRegistration.company}
                      </span>
                      <span>
                        <MapPin size={14} /> {selectedRegistration.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="admin-registration-detail__actions">
                  <button type="button" className="admin-button" onClick={() => setShowRejectDialog(true)}>
                    <X size={16} /> Reject
                  </button>
                  <button
                    type="button"
                    className="admin-button is-primary"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    <Check size={16} /> Approve registration
                  </button>
                </div>
              </header>

              <div className="admin-tabs">
                <div className="admin-tabs__list">
                  <button
                    type="button"
                    className={`admin-tabs__trigger ${activeTab === "details" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className={`admin-tabs__trigger ${activeTab === "validation" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("validation")}
                  >
                    Validation
                  </button>
                  <button
                    type="button"
                    className={`admin-tabs__trigger ${activeTab === "documents" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("documents")}
                  >
                    Documents
                  </button>
                </div>

                <div className="admin-tabs__content">
                  {activeTab === "details" ? (
                    <div className="admin-detail-grid">
                      <article className="admin-card">
                        <div className="admin-card__label">
                          <User size={16} /> Member profile
                        </div>
                        <div className="admin-stat">
                          <span>Position</span>
                          <span>{selectedRegistration.position}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Department</span>
                          <span>{selectedRegistration.department}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Union affiliation</span>
                          <span>{selectedRegistration.unionAffiliation}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Membership type</span>
                          <span>{selectedRegistration.membershipType}</span>
                        </div>
                      </article>

                      <article className="admin-card">
                        <div className="admin-card__label">
                          <Shield size={16} /> Compliance summary
                        </div>
                        <div className="admin-stat">
                          <span>Payroll consent</span>
                          <span>{selectedRegistration.payrollConsent ? "Confirmed" : "Missing"}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Years employed</span>
                          <span>{selectedRegistration.yearsEmployed}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Submitted</span>
                          <span>{selectedRegistration.submittedDate}</span>
                        </div>
                        <div className="admin-stat">
                          <span>Status</span>
                          <span>{selectedRegistration.status}</span>
                        </div>
                      </article>

                      <article className="admin-card admin-stack-md">
                        <div className="admin-card__label">
                          <Clock size={16} /> Activity timeline
                        </div>
                        <div className="admin-timeline">
                          {selectedRegistration.timeline.map((item) => (
                            <div key={`${selectedRegistration.id}-${item.time}`} className="admin-timeline__item">
                              <span>{item.time}</span>
                              <p>{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="admin-card admin-stack-md">
                        <div className="admin-card__label">
                          <AlertTriangle size={16} /> Risk notes
                        </div>
                        <ul className="admin-list">
                          {selectedRegistration.riskNotes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                        {selectedRegistration.duplicateFlag ? (
                          <div className="admin-callout is-warning">
                            <AlertTriangle size={16} />
                            <div>
                              <strong>Potential duplicate detected</strong>
                              <p>
                                Similar member found with matching company and domain. Review list before approving.
                              </p>
                              <button type="button" className="admin-button admin-button--ghost">
                                View similar member <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    </div>
                  ) : null}

                  {activeTab === "validation" ? (
                    <div className="admin-grid-two">
                      <article className="admin-card admin-stack-md">
                        <div className="admin-card__label">
                          <CheckCircle2 size={16} /> Validation checks
                        </div>
                        {renderValidationRow("Email address valid", selectedRegistration.validationChecks.emailValid)}
                        {renderValidationRow("Phone number valid", selectedRegistration.validationChecks.phoneValid)}
                        {renderValidationRow(
                          "Documents complete",
                          selectedRegistration.validationChecks.documentsComplete,
                        )}
                        {renderValidationRow(
                          "Company verified",
                          selectedRegistration.validationChecks.companyVerified,
                        )}
                        {renderValidationRow(
                          "No duplicate conflicts",
                          selectedRegistration.validationChecks.noDuplicates,
                        )}
                      </article>

                      <article className="admin-card admin-stack-md">
                        <div className="admin-card__label">
                          <Mail size={16} /> Follow-up actions
                        </div>
                        <p className="admin-muted">
                          Document each contact attempt when requesting missing requirements.
                        </p>
                        <div className="admin-inline-list">
                          <span>
                            <Mail size={14} /> Send email reminder
                          </span>
                          <span>
                            <Phone size={14} /> Log phone follow-up
                          </span>
                          <span>
                            <Calendar size={14} /> Schedule onsite submission
                          </span>
                        </div>
                        <button type="button" className="admin-button admin-button--ghost">
                          Open contact log
                        </button>
                      </article>
                    </div>
                  ) : null}

                  {activeTab === "documents" ? (
                    <div className="admin-documents-grid">
                      <article className="admin-card admin-stack-sm">
                        <div className="admin-card__label">
                          <FileText size={16} /> Registration form
                        </div>
                        <p className="admin-muted">{selectedRegistration.unionForm}</p>
                        <div className="admin-row">
                          <button type="button" className="admin-button admin-button--ghost">
                            <Eye size={14} /> View form
                          </button>
                          <button type="button" className="admin-button admin-button--ghost">
                            <Download size={14} /> Download
                          </button>
                        </div>
                      </article>

                      <article className="admin-card admin-stack-sm">
                        <div className="admin-card__label">
                          <FileText size={16} /> Employment certificate
                        </div>
                        <p className="admin-muted">
                          {selectedRegistration.employmentCertificate !== "—"
                            ? selectedRegistration.employmentCertificate
                            : "Missing upload"}
                        </p>
                        <div className="admin-row">
                          <button type="button" className="admin-button admin-button--ghost" disabled>
                            <Eye size={14} /> View
                          </button>
                          <button type="button" className="admin-button admin-button--ghost" disabled>
                            <Download size={14} /> Download
                          </button>
                        </div>
                      </article>

                      <article className="admin-card admin-stack-sm">
                        <div className="admin-card__label">
                          <FileText size={16} /> ID photo
                        </div>
                        <p className="admin-muted">{selectedRegistration.idPhoto}</p>
                        <div className="admin-row">
                          <button type="button" className="admin-button admin-button--ghost">
                            <Eye size={14} /> View photo
                          </button>
                          <button type="button" className="admin-button admin-button--ghost">
                            <Download size={14} /> Download
                          </button>
                        </div>
                      </article>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-placeholder">
              <User size={32} />
              <h3>Select a registration</h3>
              <p className="admin-muted">
                Choose a registration from the queue to review details and take action.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="admin-surface admin-stack-md">
        <h2>Guided actions</h2>
        <div className="admin-card-grid cols-3">
          <article className="admin-card">
            <div className="admin-card__label">Fast-track approvals</div>
            <p className="admin-muted">
              AI flagged 6 low-risk applications with complete documents. Approve them together to save time.
            </p>
          </article>
          <article className="admin-card">
            <div className="admin-card__label">Manual review alerts</div>
            <p className="admin-muted">
              Three applications require additional verification due to consent mismatches or duplicate warnings.
            </p>
          </article>
          <article className="admin-card">
            <div className="admin-card__label">Weekly summary</div>
            <p className="admin-muted">
              54 registrations received this week • 47 approved • 3 rejected • 4 awaiting documents.
            </p>
          </article>
        </div>
      </section>

      {showApproveDialog ? (
        <div className="admin-dialog" role="dialog" aria-modal="true">
          <div className="admin-dialog__backdrop" onClick={() => setShowApproveDialog(false)} />
          <div className="admin-dialog__panel">
            <header className="admin-dialog__header">
              <h3>Approve registration</h3>
            </header>
            <div className="admin-dialog__body admin-stack-md">
              <p>Confirm approval for {selectedRegistration?.fullName}. This will:</p>
              <ul className="admin-list admin-list--bullet">
                <li>Generate a digital ID for the member</li>
                <li>Send approval notification via email</li>
                <li>Activate the member account</li>
                <li>Add member to the active directory</li>
              </ul>
            </div>
            <footer className="admin-dialog__footer">
              <button type="button" className="admin-button" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </button>
              <button type="button" className="admin-button is-primary" onClick={handleApprove}>
                Approve registration
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {showRejectDialog ? (
        <div className="admin-dialog" role="dialog" aria-modal="true">
          <div className="admin-dialog__backdrop" onClick={() => setShowRejectDialog(false)} />
          <div className="admin-dialog__panel">
            <header className="admin-dialog__header">
              <h3>Reject registration</h3>
            </header>
            <div className="admin-dialog__body admin-stack-md">
              <label className="admin-field">
                <span>Rejection reason</span>
                <select value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)}>
                  {rejectionReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </label>
              {rejectionReason === "Other (specify below)" ? (
                <label className="admin-field">
                  <span>Custom reason</span>
                  <textarea
                    rows={4}
                    value={customReason}
                    onChange={(event) => setCustomReason(event.target.value)}
                    placeholder="Please specify the reason for rejection…"
                  />
                </label>
              ) : null}
            </div>
            <footer className="admin-dialog__footer">
              <button type="button" className="admin-button" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </button>
              <button type="button" className="admin-button is-danger" onClick={handleReject}>
                Reject registration
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
