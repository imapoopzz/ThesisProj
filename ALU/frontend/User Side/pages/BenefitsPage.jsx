import PropTypes from 'prop-types';
import { HeartHandshake, GraduationCap, Shield, Plane, FileCheck } from 'lucide-react';
import AppLayout from '../../src/components/AppLayout';
import '../styles/benefits.css';

const BENEFITS = [
  {
    icon: Shield,
    title: 'Legal & Representation',
    description: 'Immediate access to union lawyers and negotiators for workplace concerns and grievance handling.',
    tag: 'Always Available',
  },
  {
    icon: HeartHandshake,
    title: 'Member Assistance Fund',
    description: 'Emergency support and calamity response grants for members affected by unforeseen events.',
    tag: 'Financial',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships & Training',
    description: 'Upskill through accredited programs focused on financial literacy, leadership, and workplace safety.',
    tag: 'Development',
  },
  {
    icon: Plane,
    title: 'Travel & Insurance',
    description: 'Preferred travel rates and group insurance coverage for union assignments and official travel.',
    tag: 'Perks',
  },
  {
    icon: FileCheck,
    title: 'Document Processing',
    description: 'Fast-track requests for certifications, clearances, and membership verification letters.',
    tag: 'Support',
  },
];

export default function BenefitsPage({ user, onLogout }) {
  return (
    <AppLayout title="Member Benefits" user={user} onLogout={onLogout}>
      <div className="benefits">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article key={benefit.title} className="benefits__card">
              <div className="benefits__icon">
                <Icon size={24} />
              </div>
              <div className="benefits__content">
                <header>
                  <span>{benefit.tag}</span>
                  <h2>{benefit.title}</h2>
                </header>
                <p>{benefit.description}</p>
                <button type="button" className="button button--secondary">Request Access</button>
              </div>
            </article>
          );
        })}
      </div>
    </AppLayout>
  );
}

BenefitsPage.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
