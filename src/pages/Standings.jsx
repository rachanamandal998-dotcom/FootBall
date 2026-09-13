import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";
import PlayerCard from "../components/PlayerCard.jsx";

export default function Standings() {
  const { DB, standingsFor, leagueLeaders } = useData();
  const [compId, setCompId] = useState(DB.competitions[0]?.id || "");
  const rows = standingsFor(compId);
  const leaders = [
    ["Top Scorer", leagueLeaders("goals")],
    ["Most Assists", leagueLeaders("assists")],
    ["Most Appearances", leagueLeaders("apps")],
    ["Most Minutes", leagueLeaders("minutes")],
    ["Most Clean Sheets", leagueLeaders("cleanSheets")],
    ["Most Yellow Cards", leagueLeaders("yellow")],
    ["Most Red Cards", leagueLeaders("red")],
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-5xl">Standings</h1>
        <select value={compId} onChange={(e) => setCompId(e.target.value)} className="mt-4 border px-3 py-2 rounded">
          {DB.competitions.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.season}</option>)}
        </select>
        <div className="mt-6"><StandingsTable rows={rows} /></div>
        <h2 className="font-display text-3xl mt-12 mb-6">Football statistics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {leaders.map(([title, list]) => (
            <div key={title} className="bg-white border border-[#e4dfcd] p-4">
              <h3 className="font-display text-xl mb-3">{title}</h3>
              {list.length ? list.map((row, i) => (
                <div key={row.p.id} className="flex justify-between py-1.5 border-b border-[#efe9d8] last:border-0 text-sm">
                  <span>{i + 1}. {row.p.displayName}</span>
                  <b>{row.s[title.includes("Goal") ? "goals" : title.includes("Assist") ? "assists" : title.includes("Appear") ? "apps" : title.includes("Minute") ? "minutes" : title.includes("Clean") ? "cleanSheets" : title.includes("Yellow") ? "yellow" : "red"]}</b>
                </div>
              )) : <p className="text-sm text-ink/50">No data yet.</p>}
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {leagueLeaders("goals", 4).map((x) => <PlayerCard key={x.p.id} p={x.p} />)}
        </div>
      </div>
    </section>
  );
}
