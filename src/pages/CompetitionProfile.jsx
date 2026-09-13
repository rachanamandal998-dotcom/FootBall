import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { colorFor, initials } from "../utils/helpers.js";

export default function CompetitionProfile() {
  const { id } = useParams();
  const { DB, standingsFor, leagueLeaders, team } = useData();
  const c = DB.competitions.find((x) => x.id === id);
  if (!c) return <EmptyState big="Competition not found." />;
  const fixtures = DB.matches.filter((m) => m.compId === c.id && m.status === "Scheduled");
  const results = DB.matches.filter((m) => m.compId === c.id && m.status === "Finished");
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-xs uppercase text-gold">{c.type} · {c.season}</div>
        <h1 className="font-display text-5xl">{c.name}</h1>
        <p className="text-ink/70 mt-3 max-w-2xl">{c.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {(c.teamIds || []).map((tid) => {
            const t = team(tid);
            return (
              <span key={tid} className="inline-flex items-center gap-2 bg-white border px-3 py-1 text-sm">
                <span className="w-5 h-5 rounded-full grid place-items-center text-[9px]" style={{ background: colorFor(t?.name || "") }}>{initials(t?.shortName || "?")}</span>
                {t?.name}
              </span>
            );
          })}
        </div>
        <h2 className="font-display text-3xl mt-10 mb-4">Standings</h2>
        <StandingsTable rows={standingsFor(c.id)} />
        <h2 className="font-display text-3xl mt-10 mb-4">Top scorers</h2>
        <div className="bg-white border divide-y">
          {leagueLeaders("goals").map((row, i) => (
            <div key={row.p.id} className="px-4 py-2 flex justify-between text-sm"><span>{i + 1}. {row.p.displayName}</span><b>{row.s.goals}</b></div>
          ))}
        </div>
        <h2 className="font-display text-3xl mt-10 mb-4">Fixtures</h2>
        {fixtures.length ? <div className="grid md:grid-cols-2 gap-4">{fixtures.map((m) => <MatchCard key={m.id} m={m} />)}</div> : <EmptyState big="No upcoming fixtures." />}
        <h2 className="font-display text-3xl mt-10 mb-4">Results</h2>
        {results.length ? <div className="grid md:grid-cols-2 gap-4">{results.map((m) => <MatchCard key={m.id} m={m} />)}</div> : <EmptyState big="No results yet." />}
      </div>
    </section>
  );
}
