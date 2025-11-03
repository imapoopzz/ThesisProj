import { useMemo } from "react";
import "../styles/admin-base.css";
import { mockAITickets } from "../components/ai/mockAiData";
import ProponentCard from "../components/ai/ProponentCard";

export default function BenefitsAssistanceTriage() {
  const backlog = useMemo(
    () => mockAITickets.filter((ticket) => ticket.status === "needs-assignment"),
    [],
  );

  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Benefits Triage</h1>
          <p className="admin-muted">
            AI flags complex or ambiguous benefits requests that require manual routing. Review confidence, entities, and recommended actions.
          </p>
        </div>
        <span className="admin-pill is-orange">Manual review queue</span>
      </header>

      <section className="admin-surface admin-stack-md">
        <h2>Tickets requiring manual assignment</h2>
        <div className="admin-stack">
          {backlog.map((ticket) => (
            <div key={ticket.id} className="admin-benefits-triage">
              <div className="admin-benefits-triage__info">
                <span className="admin-chip is-blue">{ticket.ticketId}</span>
                <strong>{ticket.title}</strong>
                <p className="admin-muted">{ticket.suggestion.explanation}</p>
                <div className="admin-inline-list">
                  {(ticket.suggestion.extractedEntities || []).map((entity, index) => (
                    <span key={index}>{entity.type}: {entity.value}</span>
                  ))}
                </div>
              </div>
              <ProponentCard
                proponent={{
                  id: "needs-review",
                  name: "Needs Assignment",
                  role: "Queue Review",
                  department: "Admin",
                }}
                ticketId={ticket.ticketId}
                memberPseudonym={ticket.memberPseudonym}
                suggestedResponse={ticket.aiDraft || ticket.suggestedResponse || ticket.description}
                dueDate={ticket.submittedDate}
                status="pending"
                confidence={ticket.suggestion.confidence}
              />
            </div>
          ))}
          {!backlog.length ? (
            <div className="admin-empty-state">
              <p>All benefits tickets have been routed. Check back later.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
