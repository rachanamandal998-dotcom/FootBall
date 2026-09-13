import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { colorFor, initials, fmtDate } from "../utils/helpers.js";

export default function MatchCard({ m }) {
  const { DB } = useData();
  const navigate = useNavigate();
  const h = DB.teams.find((t) => t.id === m.homeTeamId);
  const a = DB.teams.find((t) => t.id === m.awayTeamId);
  const comp = DB.competitions.find((c) => c.id === m.compId);
  const live = m.status === "Live" || m.status === "Half Time";

  return (
    <button
      onClick={() => navigate(`/matches/${m.id}`)}
      className="clip-ticket w-full text-left bg-charcoal text-ivory p-5 border border-white/10 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition-all"
    >
      <div className="flex justify-between items-center text-[11px] font-semibold text-gold-soft mb-3">
        <span className="truncate">{comp?.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${live ? "bg-[#A6372B]/30 text-[#ff9a89] animate-pulse" : m.status === "Finished" ? "bg-gold/20 text-gold-soft" : "bg-turf/30 text-emerald-200"}`}>
          {m.status.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <TeamSide team={h} />
        <div className="font-display font-extrabold text-2xl text-gold px-2">
          {["Finished", "Live", "Half Time"].includes(m.status) ? `${m.homeScore} — ${m.awayScore}` : "VS"}
        </div>
        <TeamSide team={a} flip />
      </div>
      <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[11px] text-white/60">
        <span>{fmtDate(m.date)} · {m.time}</span>
        <span className="truncate ml-2">{m.stadium}</span>
      </div>
    </button>
  );
}

function TeamSide({ team, flip }) {
  return (
    <div className={`flex items-center gap-2 min-w-0 flex-1 ${flip ? "flex-row-reverse text-right" : ""}`}>
      {team?.logo ? (
        <img src={team.logo} alt="" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full grid place-items-center font-display font-extrabold text-[11px] text-charcoal" style={{ background: colorFor(team?.name || "?") }}>
          {initials(team?.shortName || "?")}
        </div>
      )}
      <span className="text-sm font-semibold truncate">{team?.shortName || "TBD"}</span>
    </div>
  );
}
