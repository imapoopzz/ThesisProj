import PropTypes from 'prop-types';
import {
  Calendar,
  ChevronRight,
  Clock,
  Megaphone,
  Newspaper,
  Users,
} from 'lucide-react';
import AppLayout from '@components/AppLayout';
import '../styles/news.css';

const CATEGORY_META = {
  'Union Update': { icon: Megaphone, tone: 'orange' },
  Events: { icon: Calendar, tone: 'blue' },
  Learning: { icon: Users, tone: 'purple' },
  Benefits: { icon: Newspaper, tone: 'green' },
};

const getCategoryMeta = (category) => CATEGORY_META[category] ?? { icon: Megaphone, tone: 'slate' };

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function NewsPage({ user, news, onLogout }) {
  return (
    <AppLayout title="Union News" user={user} onLogout={onLogout}>
      <div className="news-page">
        <header className="news-page__hero">
          <div className="news-page__hero-icon">
            <Megaphone size={20} />
          </div>
          <div>
            <h1>Latest Union Updates</h1>
            <p>Stay informed about collective bargaining wins, upcoming assemblies, and member benefits.</p>
          </div>
          <button type="button" className="news-page__hero-action">
            View Announcements
            <ChevronRight size={18} />
          </button>
        </header>

        <section className="news-page__grid">
          {news.map((item, index) => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;
            return (
              <article
                key={item.id}
                className={`news-card${index === 0 ? ' news-card--featured' : ''}`}
              >
                <div className="news-card__header">
                  <span className={`news-card__badge news-card__badge--${meta.tone}`}>
                    <Icon size={16} />
                    {item.category}
                  </span>
                  <span className="news-card__date">
                    <Calendar size={14} />
                    {formatDate(item.date)}
                  </span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <footer>
                  <span className="news-card__meta">
                    <Clock size={14} />
                    Updated recently
                  </span>
                  <a href={item.link} target="_blank" rel="noreferrer" className="news-card__link">
                    Read More
                    <ChevronRight size={16} />
                  </a>
                </footer>
              </article>
            );
          })}
        </section>

        <div className="news-page__cta">
          <div>
            <h3>Looking for past advisories?</h3>
            <p>Browse the archive to revisit circulars, statements, and press releases from the union.</p>
          </div>
          <button type="button">
            Open Archive
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

NewsPage.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  news: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      summary: PropTypes.string,
      category: PropTypes.string,
      date: PropTypes.string,
      link: PropTypes.string,
    })
  ).isRequired,
  onLogout: PropTypes.func.isRequired,
};
