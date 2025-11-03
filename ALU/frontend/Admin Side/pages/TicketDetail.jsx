import "../styles/admin-base.css";
import { mockAITickets } from "../components/ai/mockAiData";
import RedactionStrip from "../components/ai/RedactionStrip";
import SuggestionDiffView from "../components/ai/SuggestionDiffView";
import ConfidenceBar from "../components/ai/ConfidenceBar";

const sampleTicket = mockAITickets[0];

export default function TicketDetail() {
  if (!sampleTicket) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          <p>No ticket data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Ticket Detail</h1>
          <p className="admin-muted">
            Review AI suggestions, proponent edits, and system trail for a single case.
          </p>
        </div>
        <span className="admin-pill is-blue">{sampleTicket.ticketId}</span>
      </header>

      <section className="admin-surface admin-stack-md">
        <div className="admin-detail-grid">
          <div className="admin-card">
            <div className="admin-card__label">Category</div>
            <div className="admin-card__value" style={{ fontSize: "20px" }}>
              {sampleTicket.category}
            </div>
            <div className="admin-card__meta">Priority: {sampleTicket.priority}</div>
          </div>
          <div className="admin-card">
            <div className="admin-card__label">Assigned team</div>
            <div className="admin-card__value">{sampleTicket.assignedTo}</div>
            <div className="admin-card__meta">Status: {sampleTicket.status}</div>
          </div>
          <div className="admin-card">
            <div className="admin-card__label">AI confidence</div>
            <ConfidenceBar confidence={sampleTicket.suggestion.confidence} />
            <div className="admin-card__meta">Model: {sampleTicket.suggestion?.model || "OpenAI GPT-4"}</div>
          </div>
        </div>
      </section>

      <section className="admin-surface admin-stack-md">
        <h2>Redacted member summary</h2>
        <RedactionStrip
          text={sampleTicket.redactedDescription}
          redactionSummary={sampleTicket.redactionSummary}
          canViewOriginal
        />
      </section>

      <section className="admin-surface admin-stack-md">
        <SuggestionDiffView
          aiSuggestion={sampleTicket.aiDraft || sampleTicket.aiResponse || sampleTicket.description}
          proponentEdit={sampleTicket.suggestedResponse || sampleTicket.description}
        />
      </section>
    </div>
  );
}
