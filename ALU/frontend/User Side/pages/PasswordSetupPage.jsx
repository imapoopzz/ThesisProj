import { useState } from 'react';
import PropTypes from 'prop-types';
import { Shield, Check, ArrowRight } from 'lucide-react';
import '../styles/forms.css';
import '../styles/password.css';

export default function PasswordSetupPage({ email, onSubmit, onCancel }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Includes a number', valid: /\d/.test(password) },
    { label: 'Includes a capital letter', valid: /[A-Z]/.test(password) },
  ];

  const disabled = !requirements.every((item) => item.valid) || password !== confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!disabled) {
      onSubmit({ email, password });
    }
  };

  return (
    <div className="password">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="password__icon">
          <Shield size={28} />
        </div>
        <h1>Secure your account</h1>
        <p>Set a strong password for {email}. You can reset it anytime from your profile settings.</p>

        <div className="form-grid form-grid--single">
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <ul className="password__checklist">
          {requirements.map((item) => (
            <li key={item.label} className={item.valid ? 'password__checklist-item password__checklist-item--valid' : 'password__checklist-item'}>
              <Check size={14} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="form-actions">
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="button button--primary" disabled={disabled}>
            Save password
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

PasswordSetupPage.propTypes = {
  email: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
