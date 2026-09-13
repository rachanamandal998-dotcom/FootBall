import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Competitions() {
  const { DB } = useData();
  const navigate = useNavigate();
  if (!DB.competitions.length) return <div className="max-w-5xl mx-auto px-6 py-16"><EmptyState big="No competitions available." /></div>;
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-5xl">Competitions</h1>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {DB.competitions.map((c) => (
            <button key={c.id} onClick={() => navigate(`/competitions/${c.id}`)} className="text-left bg-white border p-6 hover:-translate-y-1 transition">
              <div className="text-xs uppercase tracking-wide text-gold">{c.type} · {c.season}</div>
              <h2 className="font-display text-3xl mt-1">{c.name}</h2>
              <p className="text-sm text-ink/70 mt-2">{c.description}</p>
              <p className="text-sm mt-3">{(c.teamIds || []).length} teams</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
