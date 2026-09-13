import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";

export default function AdminStandings() {
  const { DB, standingsFor } = useData();
  const [id, setId] = useState(DB.competitions[0]?.id || "");
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-display text-4xl text-pitch mb-4">Standings</h1>
      <p className="text-sm text-ink/60 mb-4">Automatically calculated from finished matches. Points follow each competition’s rules.</p>
      <select className="border rounded px-3 py-2 mb-4" value={id} onChange={(e) => setId(e.target.value)}>
        {DB.competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <StandingsTable rows={standingsFor(id)} />
    </div>
  );
}
