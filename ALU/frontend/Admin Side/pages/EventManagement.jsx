import "../styles/admin-base.css";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

const upcomingEvents = [
  {
    id: "event-1",
    name: "Union Leadership Summit",
    date: "2025-10-12",
    time: "09:00 - 16:30",
    location: "ALU Headquarters, Cebu",
    attendees: 220,
  },
  {
    id: "event-2",
    name: "Member Financial Literacy Workshop",
    date: "2025-10-18",
    time: "13:00 - 17:00",
    location: "SM Megamall Conference Center",
    attendees: 120,
  },
  {
    id: "event-3",
    name: "Regional Organizing Training",
    date: "2025-10-25",
    time: "08:30 - 15:00",
    location: "Davao City Hall",
    attendees: 95,
  },
];

const logisticsChecklist = [
  "Confirm venue booking and deposit",
  "Send speaker briefings and slide templates",
  "Coordinate registration desk staffing",
  "Prepare digital feedback form",
];

export default function EventManagement() {
  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Event Management</h1>
          <p className="admin-muted">
            Coordinate union events using AI-assisted planning and attendance tracking.
          </p>
        </div>
        <span className="admin-pill">Quarter 4 programs</span>
      </header>

      <section className="admin-card-grid cols-3">
        <article className="admin-card">
          <div className="admin-card__label">Events this month</div>
          <div className="admin-card__value">8</div>
          <div className="admin-card__meta">Across Luzon, Visayas, Mindanao</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Confirmed attendees</div>
          <div className="admin-card__value">1,240</div>
          <div className="admin-card__meta">+12% vs last month</div>
        </article>
        <article className="admin-card">
          <div className="admin-card__label">Feedback score</div>
          <div className="admin-card__value">4.6/5</div>
          <div className="admin-card__meta">From 820 survey responses</div>
        </article>
      </section>

      <section className="admin-surface admin-stack-md">
        <div className="admin-row" style={{ gap: "10px" }}>
          <CalendarDays size={18} />
          <div>
            <h2>Upcoming events</h2>
            <p className="admin-muted">Auto-synced from event calendar with attendance forecasts.</p>
          </div>
        </div>
        <div className="admin-stack">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="admin-event-card">
              <header>
                <strong>{event.name}</strong>
                <span className="admin-chip is-blue">Live planning</span>
              </header>
              <div className="admin-event-card__meta">
                <span><Clock size={14} /> {event.date} · {event.time}</span>
                <span><MapPin size={14} /> {event.location}</span>
                <span><Users size={14} /> {event.attendees} registered</span>
              </div>
              <p className="admin-muted">
                AI suggests contacting local chapter leaders for breakout sessions and ensuring hybrid streaming setup.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Logistics checklist</h2>
        <div className="admin-list">
          {logisticsChecklist.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
