import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MatchCard from "../components/MatchCard.jsx";
import { ageFromDOB, fmtDate, playerName } from "../utils/helpers.js";

export default function PlayerProfile() {
  const { id } = useParams();
  const { DB, playerStats, team } = useData();
  const p = DB.players.find((x) => x.id === id);
  const [tab, setTab] = useState("overview");
  if (!p) return <EmptyState big="Player not found." />;
  const t = team(p.teamId);
  const s = playerStats(p.id);
  const injuries = (DB.injuries || []).filter((i) => i.playerId === p.id);
  const matches = DB.matches.filter((m) => m.homeTeamId === p.teamId || m.awayTeamId === p.teamId || (m.events || []).some((e) => [e.playerId, e.scorerId, e.assistId, e.playerOnId, e.playerOffId].includes(p.id)));

  return (
    <section className="pb-16">
      <div className="bg-pitch text-ivory py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center">
          <img src={p.photo} alt="" className="w-40 h-40 rounded-2xl object-cover ring-4 ring-gold/40 shadow-2xl" />
          <div>
            <div className="text-gold-soft text-sm">#{p.jersey} · {p.position}{p.secondaryPosition ? ` / ${p.secondaryPosition}` : ""}</div>
            <h1 className="font-display text-5xl font-extrabold">{playerName(p)}</h1>
            <p className="mt-2 text-white/70">{t?.name} · {p.squad} · {p.status}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-2 mt-6 border-b">
          {["overview", "statistics", "matches", "injuries"].map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-semibold border-b-2 ${tab === k ? "border-gold" : "border-transparent text-ink/50"}`}>{k}</button>
          ))}
        </div>
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Fact k="Full name" v={p.name || playerName(p)} />
            <Fact k="Display name" v={p.displayName} />
            <Fact k="Date of birth" v={`${fmtDate(p.dob)} (${ageFromDOB(p.dob)} yrs)`} />
            <Fact k="Nationality" v={p.nationality} />
            <Fact k="Country of birth" v={p.countryOfBirth} />
            <Fact k="Height / Weight" v={`${p.height || "—"} cm / ${p.weight || "—"} kg`} />
            <Fact k="Preferred foot" v={p.preferredFoot} />
            <Fact k="Team" v={t ? <Link to={`/teams/${t.id}`} className="text-turf font-semibold">{t.name}</Link> : "—"} />
            <Fact k="Date joined" v={fmtDate(p.dateJoined)} />
            <Fact k="Contract" v={`${fmtDate(p.contractStart)} – ${fmtDate(p.contractEnd)} (${p.contractStatus || "Active"})`} />
          </div>
        )}
        {tab === "statistics" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[["Matches", s.apps], ["Starts", s.starts], ["Minutes", s.minutes], ["Goals", s.goals], ["Assists", s.assists], ["Yellow", s.yellow], ["Red", s.red], ["Clean sheets", s.cleanSheets]].map(([k, v]) => (
              <div key={k} className="bg-white border p-4"><div className="text-xs text-ink/50">{k}</div><div className="font-display text-3xl">{v}</div></div>
            ))}
          </div>
        )}
        {tab === "matches" && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">{matches.map((m) => <MatchCard key={m.id} m={m} />)}</div>
        )}
        {tab === "injuries" && (
          <div className="mt-6 space-y-3">
            {!injuries.length && <EmptyState big="No injury records." />}
            {injuries.map((i) => (
              <div key={i.id} className="bg-white border p-4">
                <div className="font-semibold">{i.type} · {i.status}</div>
                <div className="text-sm text-ink/60">{fmtDate(i.date)} · expected return {fmtDate(i.expectedReturn)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Fact({ k, v }) {
  return (
    <div className="bg-white border border-[#e4dfcd] p-4">
      <div className="text-xs text-ink/50">{k}</div>
      <div className="font-semibold mt-1">{v || "—"}</div>
    </div>
  );
}
