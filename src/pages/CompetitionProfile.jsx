import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function CompetitionProfile() {
  const { DB, route, standingsFor, leagueLeaders } = useData();
  const c = DB.competitions.find((x) => x.id === route.id);
  if (!c) return null;
  const ms = DB.matches.filter((m) => m.compId === c.id);
  const scorers = leagueLeaders("goals", 6);

  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-barlow text-[32px] leading-tight text-[#12181A]">{c.name}</h1>
        <div className="text-sm text-[#2A3532]/70 mt-2 mb-9 max-w-[65ch]">
          {c.season} · {c.description}
        </div>

        <h3 className="font-barlow text-lg font-bold text-[#12181A] mb-3">Standings</h3>
        <StandingsTable rows={standingsFor(c.id)} />

        <h3 className="font-barlow text-lg font-bold text-[#12181A] mt-10 mb-3">Top Scorers</h3>
        <div className="bg-[#12181A] text-[#F5F2E8] p-5 rounded-sm max-w-md">
          {scorers.length ? (
            scorers.map((x, i) => (
              <div
                key={x.p.id}
                className="flex justify-between items-center py-2 border-b border-white/10 last:border-0 text-sm"
              >
                <span className={i === 0 ? "font-semibold" : "text-white/85"}>
                  {x.p.displayName}
                </span>
                <span className="font-barlow font-extrabold text-base text-[#C7A344]">
                  {x.s.goals}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-white/60 py-1">No goals recorded yet.</div>
          )}
        </div>

        <h3 className="font-barlow text-lg font-bold text-[#12181A] mt-10 mb-3">
          Fixtures & Results
        </h3>
        {ms.length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {ms.map((m) => (
              <MatchCard key={m.id} m={m} />
            ))}
          </div>
        ) : (
          <EmptyState big="No fixtures scheduled." />
        )}
      </div>
    </section>
  );
}