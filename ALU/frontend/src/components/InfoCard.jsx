import PropTypes from 'prop-types';
import '@userStyles/card.css';

export default function InfoCard({ title, subtitle, action, children, highlight }) {
  return (
    <section className={`info-card${highlight ? ' info-card--highlight' : ''}`}>
      <header className="info-card__header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <div className="info-card__action">{action}</div>}
      </header>
      <div className="info-card__body">{children}</div>
    </section>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
  highlight: PropTypes.bool,
};

InfoCard.defaultProps = {
  subtitle: '',
  action: null,
  highlight: false,
};