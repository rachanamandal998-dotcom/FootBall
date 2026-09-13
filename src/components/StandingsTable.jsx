import { useData } from "../context/DataContext.jsx";
import { colorFor, initials } from "../utils/helpers.js";
import EmptyState from "./EmptyState.jsx";

export function StandingsTable({ rows }) {
  const { team } = useData();
  if (!rows?.length) return <EmptyState big="No standings yet." sub="Results will fill this table automatically." />;
  return (
    <div className="overflow-x-auto bg-white border border-[#e4dfcd]">
      <table className="w-full text-sm">
        <thead className="bg-pitch text-ivory text-left">
          <tr>
            {["Pos", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
              <th key={h} className="px-3 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const t = team(r.teamId);
            return (
              <tr key={r.teamId} className={i === 0 ? "bg-gold/10" : "border-t border-[#efe9d8]"}>
                <td className="px-3 py-3 font-display font-bold">{r.position || i + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold" style={{ background: colorFor(t?.name || "") }}>
                      {initials(t?.shortName || "?")}
                    </div>
                    <span className="font-semibold">{t?.name || r.team || r.teamId}</span>
                  </div>
                </td>
                <td className="px-3 py-3">{r.played}</td>
                <td className="px-3 py-3">{r.won}</td>
                <td className="px-3 py-3">{r.draw}</td>
                <td className="px-3 py-3">{r.lost}</td>
                <td className="px-3 py-3">{r.gf}</td>
                <td className="px-3 py-3">{r.ga}</td>
                <td className="px-3 py-3">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                <td className="px-3 py-3 font-display font-extrabold text-pitch">{r.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
