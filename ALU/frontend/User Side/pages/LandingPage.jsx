import PropTypes from 'prop-types';
import {
  Shield,
  Users,
  Award,
  Heart,
  ArrowRight,
  Smartphone,
  Monitor,
} from 'lucide-react';
import '../styles/landing.css';

const FEATURES = [
  {
    icon: Shield,
    title: 'Digital ID Cards',
    description: 'Secure verification with QR codes, watermarks, and modern identity protection.',
  },
  {
    icon: Users,
    title: 'Member Community',
    description: 'Dashboards, news, and chapter updates keep you connected and informed.',
  },
  {
    icon: Award,
    title: 'Benefits Tracking',
    description: 'Monitor dues, entitlements, and union programs from one intuitive hub.',
  },
  {
    icon: Heart,
    title: 'Priority Support',
    description: 'Reach union services faster with streamlined requests and mobile-first tools.',
  },
];

export default function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="landing-page">
      <header className="landing-page__header">
        <div className="landing-page__header-inner">
          <div className="landing-page__brand">
            <div className="landing-page__brand-icon">ALU</div>
            <div>
              <h1>ALUzon</h1>
              <p>Associated Labor Union Portal</p>
            </div>
          </div>
          <div className="landing-page__header-actions">
            <button type="button" className="landing-page__ghost" onClick={onLogin}>
              Sign In
            </button>
            <button type="button" className="button button--primary" onClick={onGetStarted}>
              Join Now
            </button>
          </div>
        </div>
      </header>

      <main className="landing-page__main">
        <section className="landing-page__hero">
          <div className="landing-page__hero-content">
            <span className="landing-page__eyebrow">Associated Labor Unions</span>
            <h2>
              Your Union,
              <span> Digitized</span>
            </h2>
            <p>
              Access your membership benefits, connect with fellow members, and stay updated with union news through
              our comprehensive digital platform designed for every ALU member.
            </p>
            <div className="landing-page__actions">
              <button type="button" className="button button--primary" onClick={onLogin}>
                Sign In
                <ArrowRight size={18} />
              </button>
              <button type="button" className="button button--secondary" onClick={onGetStarted}>
                Create Account
              </button>
            </div>
            <div className="landing-page__badges">
              <span>
                <Smartphone size={16} />
                Mobile Optimized
              </span>
              <span>
                <Monitor size={16} />
                Desktop Ready
              </span>
            </div>
          </div>
          <div className="landing-page__hero-visual">
            <div className="landing-page__device landing-page__device--front">
              <div className="landing-page__device-badge">
                <Shield size={20} />
              </div>
              <div className="landing-page__device-progress">
                <span />
              </div>
              <p>Member since 2024</p>
            </div>
            <div className="landing-page__device landing-page__device--back" />
          </div>
        </section>

        <section className="landing-page__features">
          <div className="landing-page__features-header">
            <h3>Everything you need as a union member</h3>
            <p>
              From digital ID cards to benefit tracking, ALUzon delivers modern tools that keep every member supported
              and connected.
            </p>
          </div>
          <div className="landing-page__feature-grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="landing-page__feature">
                  <div className="landing-page__feature-icon">
                    <Icon size={28} />
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-page__cta">
          <div className="landing-page__cta-inner">
            <h3>Ready to join the digital revolution?</h3>
            <p>
              Experience the future of union membership with ALUzon. Join thousands of members already using our
              platform every day.
            </p>
            <div className="landing-page__cta-actions">
              <button type="button" className="landing-page__cta-primary" onClick={onGetStarted}>
                Get Started Today
                <ArrowRight size={18} />
              </button>
              <button type="button" className="landing-page__cta-secondary" onClick={onLogin}>
                Already a member?
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-page__footer">
        <div className="landing-page__footer-inner">
          <div className="landing-page__footer-brand">
            <Shield size={20} />
            <span>ALUzon</span>
          </div>
          <p>
            Empowering union members through digital innovation and comprehensive membership services.
          </p>
          <div className="landing-page__footer-meta">
            <span>Member Benefits</span>
            <span>Support Center</span>
            <span>Contact Us</span>
            <span>Privacy Policy</span>
          </div>
          <div className="landing-page__footer-note">
            © 2025 ALUzon. Associated Labor Union - Luzon Regional. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

LandingPage.propTypes = {
  onGetStarted: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};
