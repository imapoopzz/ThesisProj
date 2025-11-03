import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  ChevronRight,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';
import AppLayout from '@components/AppLayout';
import '../styles/account.css';

const formatDate = (value, options) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', options);
};

const getInitials = (firstName = '', lastName = '') => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase();
  return initials || 'ALU';
};

function AccountModal({ title, tone, icon: Icon, onClose, children }) {
  return (
    <div className="account-modal">
      <div className="account-modal__backdrop" role="presentation" onClick={onClose} />
      <div className={`account-modal__panel account-modal__panel--${tone}`}>
        <header>
          <div className="account-modal__icon">
            <Icon size={18} />
          </div>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close details">
            ×
          </button>
        </header>
        <div className="account-modal__content">{children}</div>
      </div>
    </div>
  );
}

AccountModal.propTypes = {
  title: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['blue', 'green', 'purple']).isRequired,
  icon: PropTypes.elementType.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default function AccountPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [showPersonal, setShowPersonal] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showEmployment, setShowEmployment] = useState(false);

  const memberSinceYear = useMemo(() => {
    if (!user.membershipDate) return '—';
    const date = new Date(user.membershipDate);
    return Number.isNaN(date.getTime()) ? user.membershipDate : date.getFullYear();
  }, [user.membershipDate]);

  const profileSections = [
    {
      title: 'Personal Information',
      subtitle: 'Basic details and personal data',
      icon: User,
      tone: 'blue',
      action: () => setShowPersonal(true),
    },
    {
      title: 'Contact & Address',
      subtitle: 'Phone, email, and location details',
      icon: Mail,
      tone: 'green',
      action: () => setShowContact(true),
    },
    {
      title: 'Employment Details',
      subtitle: 'Company, role, and union profile',
      icon: Briefcase,
      tone: 'purple',
      action: () => setShowEmployment(true),
    },
  ];

  const menuItems = [
    {
      title: 'Benefits & Services',
      subtitle: 'View available member benefits',
      icon: Award,
      action: () => navigate('/benefits'),
    },
    {
      title: 'FAQs',
      subtitle: 'Frequently asked questions',
      icon: HelpCircle,
      action: () => {},
    },
    {
      title: 'About ALU',
      subtitle: 'Learn more about our union',
      icon: Info,
      action: () => {},
    },
    {
      title: 'Contact Support',
      subtitle: 'Get help and assistance',
      icon: Phone,
      action: () => {},
    },
    {
      title: 'Rate our app',
      subtitle: 'Share your experience with us',
      icon: Star,
      action: () => {},
    },
    {
      title: 'Settings',
      subtitle: 'Notifications and preferences',
      icon: Settings,
      action: () => {},
    },
    {
      title: 'Log out',
      subtitle: 'Sign out of your account',
      icon: LogOut,
      action: onLogout,
      danger: true,
    },
  ];

  return (
    <AppLayout title="Account" user={user} onLogout={onLogout}>
      <div className="account-page">
        <section className="account-page__hero">
          <div className="account-page__hero-content">
            <button
              type="button"
              className="account-page__avatar"
              onClick={() => setShowPersonal(true)}
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Member" />
              ) : (
                <span>{getInitials(user.firstName, user.lastName)}</span>
              )}
              <span className="account-page__avatar-edit">
                <Camera size={14} />
              </span>
            </button>
            <div>
              <h1>Hi, {user.firstName}!</h1>
              <div className="account-page__contact">
                <span>
                  <Phone size={14} />
                  {user.phone ?? '+63 ••••••••••'}
                </span>
                <span>
                  <Mail size={14} />
                  {user.email}
                </span>
                <span>
                  <ShieldCheck size={14} />
                  {user.digitalId ?? 'ALU-000000'}
                </span>
              </div>
            </div>
          </div>

          <div className="account-page__stats">
            <div>
              <span>Member Since</span>
              <strong>{memberSinceYear}</strong>
            </div>
            <div>
              <span>Union Position</span>
              <strong>{user.unionPosition ?? 'Member'}</strong>
            </div>
            <div>
              <span>Company</span>
              <strong>{user.company ?? 'Associated Labor Unions'}</strong>
            </div>
          </div>
        </section>

        <div className="account-page__layout">
          <div className="account-page__column">
            <div className="account-page__section-heading">
              <h2>Profile Information</h2>
              <p>Access and review your membership details</p>
            </div>
            <div className="account-page__cards">
              {profileSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.title}
                    type="button"
                    className={`account-card account-card--${section.tone}`}
                    onClick={section.action}
                  >
                    <div className="account-card__icon">
                      <Icon size={18} />
                    </div>
                    <div className="account-card__body">
                      <strong>{section.title}</strong>
                      <span>{section.subtitle}</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="account-page__column">
            <div className="account-page__section-heading">
              <h2>App Features &amp; Settings</h2>
              <p>Manage tools, preferences, and quick actions</p>
            </div>
            <div className="account-menu">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={`account-menu__item${item.danger ? ' account-menu__item--danger' : ''}`}
                    onClick={item.action}
                  >
                    <div className="account-menu__icon">
                      <Icon size={18} />
                    </div>
                    <div className="account-menu__details">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>

            <div className="account-quick">
              <h3>Quick Access</h3>
              <div className="account-quick__grid">
                <button type="button" onClick={() => navigate('/digital-id')}>
                  <QrCode size={18} />
                  Digital ID
                </button>
                <button type="button" onClick={() => navigate('/dues')}>
                  <Calendar size={18} />
                  Dues Tracker
                </button>
                <button type="button" onClick={() => navigate('/news')}>
                  <Info size={18} />
                  Union News
                </button>
                <button type="button" onClick={() => navigate('/membership-form')}>
                  <PenIcon size={18} />
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="account-page__verification">
          <div className="account-page__verification-icon">
            <Shield size={22} />
          </div>
          <div>
            <h3>Verified Member</h3>
            <p>Your documents were confirmed on {formatDate(user.verifiedDate ?? user.membershipDate, { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
          </div>
          <button type="button" className="button button--secondary" onClick={() => navigate('/digital-id')}>
            View Digital ID
          </button>
        </section>
      </div>

      {showPersonal && (
        <AccountModal
          title="Personal Details"
          tone="blue"
          icon={User}
          onClose={() => setShowPersonal(false)}
        >
          <div className="account-modal__profile">
            <div className="account-modal__photo">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Member" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div>
              <strong>{user.firstName} {user.lastName}</strong>
              <span>{user.digitalId ?? 'ALU-000000'}</span>
            </div>
          </div>
          <div className="account-modal__list">
            <div>
              <span>Date of Birth</span>
              <strong>{formatDate(user.dateOfBirth, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>{user.gender ?? 'Not provided'}</strong>
            </div>
            <div>
              <span>Marital Status</span>
              <strong>{user.maritalStatus ?? 'Not provided'}</strong>
            </div>
            {user.numberOfChildren != null && (
              <div>
                <span>Children</span>
                <strong>{user.numberOfChildren}</strong>
              </div>
            )}
            {user.religion && (
              <div>
                <span>Religion</span>
                <strong>{user.religion}</strong>
              </div>
            )}
            {user.education && (
              <div>
                <span>Education</span>
                <strong>{user.education}</strong>
              </div>
            )}
          </div>
        </AccountModal>
      )}

      {showContact && (
        <AccountModal
          title="Contact & Address"
          tone="green"
          icon={Mail}
          onClose={() => setShowContact(false)}
        >
          <div className="account-modal__list">
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{user.phone ?? 'Not provided'}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{user.address ?? 'Not provided'}</strong>
            </div>
          </div>
          {user.emergencyContact && (
            <div className="account-modal__emergency">
              <h3>Emergency Contact</h3>
              <div className="account-modal__list">
                <div>
                  <span>Name</span>
                  <strong>{user.emergencyContact.name}</strong>
                </div>
                <div>
                  <span>Relationship</span>
                  <strong>{user.emergencyContact.relationship}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{user.emergencyContact.phone}</strong>
                </div>
              </div>
            </div>
          )}
        </AccountModal>
      )}

      {showEmployment && (
        <AccountModal
          title="Employment Details"
          tone="purple"
          icon={Briefcase}
          onClose={() => setShowEmployment(false)}
        >
          <div className="account-modal__list">
            <div>
              <span>Company</span>
              <strong>{user.company ?? 'Not provided'}</strong>
            </div>
            <div>
              <span>Position</span>
              <strong>{user.position ?? 'Not provided'}</strong>
            </div>
            {user.department && (
              <div>
                <span>Department</span>
                <strong>{user.department}</strong>
              </div>
            )}
            {user.yearsEmployed != null && (
              <div>
                <span>Years Employed</span>
                <strong>{user.yearsEmployed}</strong>
              </div>
            )}
          </div>
          <div className="account-modal__list account-modal__list--accent">
            <div>
              <span>Union Position</span>
              <strong>{user.unionPosition ?? 'Member'}</strong>
            </div>
            <div>
              <span>Member Since</span>
              <strong>{formatDate(user.membershipDate, { month: 'long', year: 'numeric' })}</strong>
            </div>
            {user.unionAffiliation && (
              <div>
                <span>Affiliation</span>
                <strong>{user.unionAffiliation}</strong>
              </div>
            )}
          </div>
        </AccountModal>
      )}
    </AppLayout>
  );
}

const PenIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

PenIcon.propTypes = {
  className: PropTypes.string,
};

PenIcon.defaultProps = {
  className: undefined,
};

AccountPage.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    department: PropTypes.string,
    unionPosition: PropTypes.string,
    unionAffiliation: PropTypes.string,
    membershipDate: PropTypes.string,
    verifiedDate: PropTypes.string,
    profilePicture: PropTypes.string,
    digitalId: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    maritalStatus: PropTypes.string,
    numberOfChildren: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    religion: PropTypes.string,
    education: PropTypes.string,
    yearsEmployed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    emergencyContact: PropTypes.shape({
      name: PropTypes.string,
      relationship: PropTypes.string,
      phone: PropTypes.string,
    }),
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
