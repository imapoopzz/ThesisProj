import PropTypes from 'prop-types';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import '../styles/success.css';

export default function RegistrationSuccessPage({ onContinue }) {
  return (
    <div className="success">
      <div className="success__icon">
        <CheckCircle2 size={48} />
      </div>
      <h1>Registration Submitted</h1>
      <p>
        Thank you for completing your ALUzon membership form. Our team will review your documents and notify you via
        email once your account is activated.
      </p>
      <button type="button" className="button button--primary" onClick={onContinue}>
        Go to dashboard
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

RegistrationSuccessPage.propTypes = {
  onContinue: PropTypes.func.isRequired,
};
