import "../styles/admin-base.css";
import { mockProponentTasks } from "../components/ai/mockAiData";
import ProponentCard from "../components/ai/ProponentCard";

export default function ProponentQueue() {
  return (
    <div className="admin-page admin-stack-lg">
      <header className="admin-row">
        <div>
          <h1>Proponent Queue</h1>
          <p className="admin-muted">
            Review AI-assisted drafts awaiting proponent edits or approvals before final admin sign-off.
          </p>
        </div>
        <span className="admin-pill">Live AI handoffs</span>
      </header>

      <section className="admin-stack">
        {mockProponentTasks.map((task) => (
          <ProponentCard
            key={task.id}
            proponent={task.proponent}
            ticketId={task.ticketId}
            memberPseudonym={task.memberPseudonym}
            suggestedResponse={task.suggestedResponse}
            dueDate={task.dueDate}
            status={task.status === "approved" ? "approved" : task.status === "rejected" ? "rejected" : "pending"}
            confidence={task.aiConfidence}
          />
        ))}
      </section>
    </div>
  );
}
