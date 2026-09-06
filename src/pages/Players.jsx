import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import PlayerCard from "../components/PlayerCard.jsx";

export default function Players() {
  const { DB } = useData();
  const [q, setQ] = useState(""),
    [pos, setPos] = useState(""),
    [team, setTeam] = useState("");

  let list = DB.players.filter((p) =>
    p.displayName.toLowerCase().includes(q.toLowerCase()),
  );
  if (pos) list = list.filter((p) => p.position === pos);
  if (team) list = list.filter((p) => p.teamId === team);

  return (
    <section className="py-14">
      <div className="max-w- mx-auto px-6">
        <h2 className="font-barlow text- leading-none">Player Directory</h2>
        <p className="text-sm text-[#2A3532] mb-5 mt-1">
          {list.length} players across Sindhuli district clubs
        </p>
        <div className="grid md:grid-cols-[1fr_1fr] gap-3 mb-6">
          <input
            className="border border-[#ddd6bd] px-3 py-2 rounded- text-sm bg-white w-full outline-none focus:border-[#0E3B2E]"
            placeholder="Search by name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="border border-[#ddd6bd] px-3 py-2 rounded- text-sm w-full bg-white outline-none"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
            >
              <option value="">All Positions</option>
              <option>Goalkeeper</option>
              <option>Defender</option>
              <option>Midfielder</option>
              <option>Forward</option>
            </select>
            <select
              className="border border-[#ddd6bd] px-3 py-2 rounded- text-sm w-full bg-white outline-none"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              {DB.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((p) => (
            <PlayerCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}