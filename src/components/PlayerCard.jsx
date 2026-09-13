import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { colorFor, initials, ageFromDOB, playerName } from "../utils/helpers.js";

const ACCENT = { Goalkeeper: "#C7A344", Defender: "#1E7245", Midfielder: "#4C7A6B", Forward: "#A24B39" };

export default function PlayerCard({ p }) {
  const navigate = useNavigate();
  const { team, playerStats } = useData();
  const t = team(p.teamId);
  const s = playerStats(p.id) || {};
  const accent = ACCENT[p.position] || "#2A3532";

  return (
    <button
      onClick={() => navigate(`/players/${p.id}`)}
      className="card-3d w-full text-left bg-white border border-[#e4dfcd] overflow-hidden"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="pt-5 pb-4 flex flex-col items-center text-center px-4">
        <div className="relative">
          {p.photo ? (
            <img src={p.photo} alt={playerName(p)} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full grid place-items-center font-display font-extrabold text-xl" style={{ background: accent + "33", color: accent }}>
              {initials(playerName(p))}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-charcoal text-gold-soft text-[10px] font-display font-bold grid place-items-center ring-2 ring-white">
            {p.jersey}
          </div>
        </div>
        <h3 className="font-display font-bold text-[17px] text-charcoal mt-3 leading-tight">{playerName(p)}</h3>
        <p className="text-[11.5px] text-ink/70 mt-0.5">{p.position} · {ageFromDOB(p.dob)}</p>
        {t && (
          <div className="flex items-center gap-1.5 mt-2 bg-ivory px-2.5 py-1">
            <div className="w-4 h-4 rounded-full grid place-items-center text-[8px] font-extrabold" style={{ background: colorFor(t.name) }}>
              {initials(t.shortName)}
            </div>
            <span className="text-[10.5px] font-semibold">{t.shortName}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 border-t border-[#efe9d8] text-center">
        <Stat n={s.goals} l="Goals" />
        <Stat n={s.assists} l="Assists" />
        <Stat n={s.apps} l="Apps" />
      </div>
    </button>
  );
}

function Stat({ n, l }) {
  return (
    <div className="py-2.5">
      <div className="font-display font-extrabold text-base text-pitch">{n ?? 0}</div>
      <div className="text-[9.5px] text-[#9a9482]">{l}</div>
    </div>
  );
}
