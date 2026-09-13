import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { ageFromDOB, playerName } from "../utils/helpers.js";

export default function Players() {
  const { DB } = useData();
  const [q, setQ] = useState("");
  const [position, setPosition] = useState("");
  const [teamId, setTeamId] = useState("");
  const [status, setStatus] = useState("");

  const list = useMemo(() => {
    return DB.players.filter((p) => {
      const name = playerName(p).toLowerCase();
      if (q && !name.includes(q.toLowerCase()) && !String(p.nationality || "").toLowerCase().includes(q.toLowerCase())) return false;
      if (position && p.position !== position) return false;
      if (teamId && p.teamId !== teamId) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }, [DB.players, q, position, teamId, status]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-5xl">Players</h1>
        <div className="grid md:grid-cols-4 gap-3 mt-6">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or nationality" className="border px-3 py-2 rounded" />
          <select value={position} onChange={(e) => setPosition(e.target.value)} className="border px-3 py-2 rounded">
            <option value="">All positions</option>
            {["Goalkeeper", "Defender", "Midfielder", "Forward"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="border px-3 py-2 rounded">
            <option value="">All teams</option>
            {DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-3 py-2 rounded">
            <option value="">All statuses</option>
            {["Active", "Injured", "Suspended", "Unavailable", "On Loan", "Retired"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {list.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">{list.map((p) => <PlayerCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="mt-8"><EmptyState big="No players found." /></div>
        )}
      </div>
    </section>
  );
}
