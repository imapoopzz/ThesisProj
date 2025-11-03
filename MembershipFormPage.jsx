import PropTypes from "prop-types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, FileText, Info } from "lucide-react";
import AppLayout from "@components/AppLayout";
import "../styles/membership-form.css";

const formatDate = (value, options = { month: "long", day: "numeric", year: "numeric" }) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", options);
};

const safeText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

export default function MembershipFormPage({ user, onLogout }) {
  const navigate = useNavigate();
  const isApproved = Boolean(user?.isApproved);
  const emergencyContact = user?.emergencyContact ?? {};

  const fullName = useMemo(
    () =>
      [user?.firstName, user?.middleInitial ? `${user.middleInitial}.` : null, user?.lastName]
        .filter(Boolean)
        .join(" ") || "",
    [user?.firstName, user?.middleInitial, user?.lastName],
  );

  const membershipYear = useMemo(() => {
    if (!user?.membershipDate) return "";
    const date = new Date(user.membershipDate);
    return Number.isNaN(date.getTime()) ? "" : date.getFullYear();
  }, [user?.membershipDate]);

  const dateOfBirthParts = useMemo(() => {
    if (!user?.dateOfBirth) return ["", "", ""];
    const date = new Date(user.dateOfBirth);
    if (Number.isNaN(date.getTime())) return ["", "", ""];
    return [
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
      String(date.getFullYear()),
    ];
  }, [user?.dateOfBirth]);

  const maritalStatuses = ["Single", "Married", "Widowed", "Separated", "Divorced"];
  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const requiredDocuments = [
    "Recent 2x2 ID photo (attach to printed form)",
    "Valid government-issued ID",
    "Employment verification (company ID or payslip)",
  ];

  const processingNotes = [
    "Form processing takes 5-7 business days",
    "Youll receive an email notification upon approval",
    "Keep a copy of your completed form for records",
  ];

  const handleDownload = () => {
    if (typeof document === "undefined") return;
    const link = document.createElement("a");
    link.href = "data:application/pdf;base64,JVBERi0xLjQK";
    link.download = "ALU_Membership_Form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleBack = () => navigate("/dashboard");
  const handleViewAll = () => navigate("/news");

  return (
    <AppLayout title="Membership Registration" user={user} onLogout={onLogout}>
      <div className="membership-form-page">
        <div className="membership-form-page__container">
          <header className="membership-form-page__header">
            <button type="button" className="membership-form-page__back" onClick={handleBack}>
              <ArrowLeft size={18} />
              Back
            </button>
            <div>
              <h1>Membership Registration Form</h1>
              <p>Complete your ALU membership application</p>
            </div>
          </header>

          <section
            className={`membership-form-page__status membership-form-page__status--${isApproved ? "approved" : "pending"}`}
          >
            <div className="membership-form-page__status-icon">
              {isApproved ? <FileText size={20} /> : <Info size={20} />}
            </div>
            <div className="membership-form-page__status-copy">
              <h2>{isApproved ? "Membership Approved" : "Membership Pending Approval"}</h2>
              <p>
                {isApproved
                  ? "Your membership has been approved. Below is your official registration information."
                  : "Your membership application is under review. You can review the submitted details while awaiting approval."}
              </p>
              <div className="membership-form-page__status-metadata">
                <span>
                  Member ID:
                  <strong>{safeText(user?.digitalId, "Pending assignment")}</strong>
                </span>
                <span>
                  Submitted:
                  <strong>{formatDate(user?.membershipDate)}</strong>
                </span>
              </div>
            </div>
            <span className="membership-form-page__status-badge">{isApproved ? "APPROVED" : "PENDING"}</span>
          </section>

          <div className="membership-form-page__card">
            <header className="membership-form-page__card-header">
              <div className="membership-form-page__brand">
                <div className="membership-form-page__brand-badge">ALU</div>
                <div>
                  <h2>Associated Labor Unions</h2>
                  <p>262 ALU-AFILUTE Bldg. 15th Ave. Brgy. Silangan, Cubao, Quezon City</p>
                </div>
              </div>
              <div className="membership-form-page__card-meta">
                <span>Digital ID</span>
                <strong>{safeText(user?.digitalId, "Pending assignment")}</strong>
                <span
                  className={`membership-form-page__year membership-form-page__year--${isApproved ? "approved" : "pending"}`}
                >
                  Member since {membershipYear}
                </span>
              </div>
            </header>

            <div className="membership-form-page__card-body">
              <div className="membership-form-page__photo">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Member" />
                ) : (
                  <div>
                    <span>2x2</span>
                    <span>Photo</span>
                  </div>
                )}
              </div>

              <section className="membership-form-page__section">
                <div className="membership-form-page__section-heading">
                  <h3>Personal Information</h3>
                </div>
                <div className="membership-form-page__grid membership-form-page__grid--three">
                  <div className="membership-form-page__field">
                    <span>Full Name</span>
                    <strong>{fullName}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Date of Birth</span>
                    <strong>{formatDate(user?.dateOfBirth)}</strong>
                    <div className="membership-form-page__dob">
                      <span>{dateOfBirthParts[0]}</span>
                      <span>{dateOfBirthParts[1]}</span>
                      <span>{dateOfBirthParts[2]}</span>
                    </div>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Place of Birth</span>
                    <strong>{safeText(user?.placeOfBirth)}</strong>
                  </div>
                  <div className="membership-form-page__field membership-form-page__field--wide">
                    <span>Residential Address</span>
                    <strong>{safeText(user?.address)}</strong>
                  </div>
                </div>
                <div className="membership-form-page__grid membership-form-page__grid--flex">
                  <div className="membership-form-page__field">
                    <span>Marital Status</span>
                    <div className="membership-form-page__options">
                      {maritalStatuses.map((status) => (
                        <span
                          key={status}
                          className={`membership-form-page__option${user?.maritalStatus === status ? " membership-form-page__option--selected" : ""}`}
                        >
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Number of Children</span>
                    <strong>{safeText(user?.numberOfChildren, "0")}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Religion</span>
                    <strong>{safeText(user?.religion)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Educational Attainment</span>
                    <strong>{safeText(user?.education)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Gender</span>
                    <div className="membership-form-page__options">
                      {genderOptions.map((option) => (
                        <span
                          key={option}
                          className={`membership-form-page__option${user?.gender === option ? " membership-form-page__option--selected" : ""}`}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="membership-form-page__section">
                <div className="membership-form-page__section-heading">
                  <h3>Contact Information</h3>
                </div>
                <div className="membership-form-page__grid membership-form-page__grid--three">
                  <div className="membership-form-page__field">
                    <span>Email Address</span>
                    <strong>{safeText(user?.email)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Phone Number</span>
                    <strong>{safeText(user?.phone, "+63 ")}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Union Affiliation</span>
                    <strong>{safeText(user?.unionAffiliation, "Associated Labor Unions")}</strong>
                  </div>
                </div>
              </section>

              <section className="membership-form-page__section">
                <div className="membership-form-page__section-heading">
                  <h3>Employment Information</h3>
                </div>
                <div className="membership-form-page__grid membership-form-page__grid--three">
                  <div className="membership-form-page__field">
                    <span>Employer</span>
                    <strong>{safeText(user?.company)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Position</span>
                    <strong>{safeText(user?.position)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Unit / Department</span>
                    <strong>{safeText(user?.department)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Years Employed</span>
                    <strong>{safeText(user?.yearsEmployed, "0")}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Union Position</span>
                    <strong>{safeText(user?.unionPosition, "Member")}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Date of Membership</span>
                    <strong>{formatDate(user?.membershipDate)}</strong>
                  </div>
                </div>
              </section>

              <section className="membership-form-page__section">
                <div className="membership-form-page__section-heading membership-form-page__section-heading--highlight">
                  <h3>Contact Person in Case of Emergency</h3>
                </div>
                <div className="membership-form-page__grid membership-form-page__grid--two">
                  <div className="membership-form-page__field">
                    <span>Full Name</span>
                    <strong>{safeText(emergencyContact.name)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Relationship</span>
                    <strong>{safeText(emergencyContact.relationship)}</strong>
                  </div>
                  <div className="membership-form-page__field">
                    <span>Contact Number</span>
                    <strong>{safeText(emergencyContact.phone)}</strong>
                  </div>
                  <div className="membership-form-page__field membership-form-page__field--wide">
                    <span>Address</span>
                    <strong>{safeText(emergencyContact.address)}</strong>
                  </div>
                </div>
              </section>

              <section className="membership-form-page__section membership-form-page__section--divider">
                <div className="membership-form-page__signature">
                  <div />
                  <span>Signature</span>
                </div>
              </section>

              <section className="membership-form-page__section membership-form-page__section--actions">
                <div className="membership-form-page__actions">
                  <button
                    type="button"
                    className="membership-form-page__action-button membership-form-page__action-button--primary"
                    onClick={handleDownload}
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    className="membership-form-page__action-button membership-form-page__action-button--secondary"
                    onClick={handlePrint}
                  >
                    <Printer size={18} />
                    Print Form
                  </button>
                  <button type="button" className="membership-form-page__action-button" onClick={handleViewAll}>
                    View Latest Advisories
                  </button>
                </div>
                <div className="membership-form-page__info">
                  <Info size={18} />
                  <p>
                    The Associated Labor Unions adheres to the Data Privacy Act of 2012. All information submitted will be processed solely for union membership management and benefits administration.
                  </p>
                </div>
              </section>

              <section className="membership-form-page__section membership-form-page__section--columns">
                <div className="membership-form-page__column">
                  <h4>Required Documents</h4>
                  <ul>
                    {requiredDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="membership-form-page__column">
                  <h4>Processing Information</h4>
                  <ul>
                    {processingNotes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <footer className="membership-form-page__footer-note">
                Need assistance? Contact ALU at <strong>(02) 8123-4567</strong> or visit our office during business hours.
              </footer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

MembershipFormPage.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    middleInitial: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    department: PropTypes.string,
    yearsEmployed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    unionAffiliation: PropTypes.string,
    unionPosition: PropTypes.string,
    membershipDate: PropTypes.string,
    isApproved: PropTypes.bool,
    profilePicture: PropTypes.string,
    digitalId: PropTypes.string,
    dateOfBirth: PropTypes.string,
    placeOfBirth: PropTypes.string,
    maritalStatus: PropTypes.string,
    numberOfChildren: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    religion: PropTypes.string,
    education: PropTypes.string,
    gender: PropTypes.string,
    emergencyContact: PropTypes.shape({
      name: PropTypes.string,
      relationship: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    }),
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
