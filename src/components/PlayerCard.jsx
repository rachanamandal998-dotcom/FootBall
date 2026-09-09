import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { colorFor, initials } from "../utils/helpers.js";

const POSITION_ACCENT = {
  Goalkeeper: "#C7A344",
  Defender: "#1E7245",
  Midfielder: "#4C7A6B",
  Forward: "#A24B39",
};

export default function PlayerCard({ p }) {
  const navigate = useNavigate();
  const { team, playerStats } = useData();
  const t = team(p.teamId);
  const s = playerStats(p.id) || {};
  const accent = POSITION_ACCENT[p.position] || "#2A3532";

  return (
    <div
      onClick={() => navigate(`/players/${p.id}`)}
      className="group cursor-pointer bg-white border border-[#e4dfcd] hover:border-[#C7A344]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(0,0,0,0.35)] transition-all"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="pt-5 pb-4 flex flex-col items-center text-center px-4">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-barlow font-extrabold text-xl text-[#12181A]"
            style={{ background: accent + "33", color: accent }}
          >
            {initials(p.displayName)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12181A] text-[#E4CD8A] text-[10px] font-barlow font-bold flex items-center justify-center ring-2 ring-white">
            {p.jersey}
          </div>
        </div>

        <h3 className="font-barlow font-bold text-[15px] text-[#12181A] mt-3 leading-tight group-hover:text-[#0E3B2E] transition-colors">
          {p.displayName}
        </h3>
        <p className="text-[11.5px] text-[#2A3532]/70 mt-0.5">{p.position}</p>

        {t && (
          <div className="flex items-center gap-1.5 mt-2 bg-[#F0EDE0] px-2.5 py-1">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-[#12181A]"
              style={{ background: colorFor(t.name) }}
            >
              {initials(t.shortName)}
            </div>
            <span className="text-[10.5px] font-semibold text-[#2A3532] truncate max-w-[100px]">
              {t.shortName}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-[#efe9d8] text-center">
        <div className="py-2.5 border-r border-[#efe9d8]">
          <div className="font-barlow font-extrabold text-base text-[#0E3B2E]">{s.goals ?? 0}</div>
          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">Goals</div>
        </div>
        <div className="py-2.5 border-r border-[#efe9d8]">
          <div className="font-barlow font-extrabold text-base text-[#0E3B2E]">{s.assists ?? 0}</div>
          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">Assists</div>
        </div>
        <div className="py-2.5">
          <div className="font-barlow font-extrabold text-base text-[#0E3B2E]">
            {s.appearances ?? s.matches ?? 0}
          </div>
          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">Apps</div>
        </div>
      </div>
    </div>
  );
}