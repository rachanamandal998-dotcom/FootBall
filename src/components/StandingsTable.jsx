import { colorFor, initials } from "../utils/helpers.js";
import { useData } from "../context/DataContext.jsx";

function zoneColor(i, total) {
  if (i === 0) return "#C7A344"; // leader
  if (i < 4) return "#4C7A6B"; // continental spots
  if (i >= total - 3) return "#B3543F"; // relegation
  return "transparent";
}

export function StandingsTable({ rows }) {
  const { DB } = useData();
  return (
    <div className="bg-white border border-[#e4dfcd] overflow-x-auto">
      <table className="w-full text-[13.5px] border-collapse">
        <thead>
          <tr className="bg-[#F0EDE0] text-[11px] tracking-[0.5px] text-[#2A3532] sticky top-0">
            <th className="text-left p-3 font-semibold">#</th>
            <th className="text-left p-3 font-semibold">Club</th>
            <th className="text-center p-3 font-semibold">P</th>
            <th className="text-center p-3 font-semibold">W</th>
            <th className="text-center p-3 font-semibold">D</th>
            <th className="text-center p-3 font-semibold">L</th>
            <th className="text-center p-3 font-semibold">GF</th>
            <th className="text-center p-3 font-semibold">GA</th>
            <th className="text-center p-3 font-semibold">GD</th>
            <th className="text-center p-3 font-bold bg-[#e9e4d2]">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const t = DB.teams.find((x) => x.id === r.teamId);
            const stripe = zoneColor(i, rows.length);
            const gdColor =
              r.gd > 0 ? "text-[#3F6E5A]" : r.gd < 0 ? "text-[#A24B39]" : "text-[#2A3532]";
            return (
              <tr
                key={r.teamId}
                className={`border-b border-[#efe9d8] last:border-0 hover:bg-[#FFFEF7] transition-colors ${
                  i % 2 === 1 ? "bg-[#FBFAF4]" : ""
                }`}
                style={{ borderLeft: `3px solid ${stripe}` }}
              >
                <td className="p-3 font-barlow font-bold text-[#2A3532]">{i + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-extrabold text-[#12181A] ring-1 ring-black/10"
                      style={{ background: colorFor(t?.name || "") }}
                    >
                      {initials(t?.shortName || "?")}
                    </div>
                    <span className="font-semibold">{t?.name}</span>
                  </div>
                </td>
                <td className="text-center p-3">{r.played}</td>
                <td className="text-center p-3">{r.won}</td>
                <td className="text-center p-3">{r.draw}</td>
                <td className="text-center p-3">{r.lost}</td>
                <td className="text-center p-3">{r.gf}</td>
                <td className="text-center p-3">{r.ga}</td>
                <td className={`text-center p-3 font-semibold ${gdColor}`}>
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </td>
                <td className="text-center p-3 font-barlow font-extrabold text-[15px] bg-[#F0EDE0]/50">
                  {r.pts}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 px-3 py-2.5 border-t border-[#efe9d8] text-[11px] text-[#2A3532]/70">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#C7A344" }} /> League leader
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4C7A6B" }} /> Continental qualification
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#B3543F" }} /> Relegation zone
        </span>
      </div>
    </div>
  );
}