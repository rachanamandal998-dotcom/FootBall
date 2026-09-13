import { useData } from "../context/DataContext.jsx";

export default function Statistics() {
  const { leagueLeaders, DB, standingsFor } = useData();
  const blocks = [
    ["Top scorers", "goals"],
    ["Most assists", "assists"],
    ["Most appearances", "apps"],
    ["Most minutes", "minutes"],
    ["Clean sheets", "cleanSheets"],
    ["Yellow cards", "yellow"],
    ["Red cards", "red"],
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-display text-4xl text-pitch mb-6">Statistics</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {blocks.map(([title, key]) => (
          <div key={key} className="bg-white border rounded-xl p-4">
            <h2 className="font-display text-xl mb-3">{title}</h2>
            {leagueLeaders(key).map((row, i) => (
              <div key={row.p.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                <span>{i + 1}. {row.p.displayName}</span><b>{row.s[key]}</b>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2 className="font-display text-2xl mt-8 mb-3">Team table</h2>
      <div className="bg-white border rounded-xl p-4 text-sm">
        {standingsFor(DB.competitions[0]?.id).map((r) => (
          <div key={r.teamId} className="flex justify-between py-1"><span>{r.position}. {DB.teams.find((t) => t.id === r.teamId)?.name}</span><b>{r.pts} pts</b></div>
        ))}
      </div>
    </div>
  );
}
