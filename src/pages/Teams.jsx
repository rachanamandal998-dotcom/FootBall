import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { colorFor, initials } from "../utils/helpers.js";
import EmptyState from "../components/EmptyState.jsx";

export default function Teams() {
  const { DB, teamPlayers } = useData();
  const navigate = useNavigate();
  if (!DB.teams.length) return <div className="max-w-5xl mx-auto px-6 py-16"><EmptyState big="No teams found." /></div>;
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-5xl">Teams</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {DB.teams.map((t) => (
            <button key={t.id} onClick={() => navigate(`/teams/${t.id}`)} className="card-3d text-left bg-white border border-[#e4dfcd] p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full grid place-items-center font-display font-extrabold text-lg" style={{ background: colorFor(t.name) }}>{initials(t.shortName)}</div>
                <div>
                  <h2 className="font-display text-2xl">{t.name}</h2>
                  <p className="text-sm text-ink/60">{t.shortName} · {t.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div>{teamPlayers(t.id).length} players</div>
                <div>{t.stadium}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
