import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { colorFor, initials } from "../utils/helpers.js";

export default function TeamProfile() {
  const { id } = useParams();
  const { DB, teamPlayers } = useData();
  const t = DB.teams.find((x) => x.id === id);
  if (!t) return <EmptyState big="Team not found." />;
  const squad = teamPlayers(t.id);
  const upcoming = DB.matches.filter((m) => (m.homeTeamId === t.id || m.awayTeamId === t.id) && m.status === "Scheduled");
  const results = DB.matches.filter((m) => (m.homeTeamId === t.id || m.awayTeamId === t.id) && m.status === "Finished");
  const finished = results;
  const stats = finished.reduce(
    (s, m) => {
      const home = m.homeTeamId === t.id;
      const gf = home ? m.homeScore : m.awayScore;
      const ga = home ? m.awayScore : m.homeScore;
      s.played += 1;
      s.gf += gf;
      s.ga += ga;
      if (gf > ga) s.won += 1;
      else if (gf < ga) s.lost += 1;
      else s.draw += 1;
      return s;
    },
    { played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0 },
  );
  stats.gd = stats.gf - stats.ga;
  stats.pts = stats.won * 3 + stats.draw;

  return (
    <section className="pb-16">
      <div className="bg-pitch text-ivory py-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full grid place-items-center font-display text-2xl font-extrabold text-charcoal" style={{ background: colorFor(t.name) }}>{initials(t.shortName)}</div>
          <div>
            <h1 className="font-display text-5xl">{t.name}</h1>
            <p className="text-gold-soft">{t.location} · {t.stadium} · Coach {t.coach}</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-4 gap-3 -mt-6">
        {[["Played", stats.played], ["Won", stats.won], ["GD", stats.gd], ["Pts", stats.pts]].map(([k, v]) => (
          <div key={k} className="bg-white border p-4 shadow-sm"><div className="text-xs text-ink/50">{k}</div><div className="font-display text-3xl">{v}</div></div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="font-display text-3xl mb-4">Squad</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{squad.map((p) => <PlayerCard key={p.id} p={p} />)}</div>
        <h2 className="font-display text-3xl mt-12 mb-4">Upcoming</h2>
        {upcoming.length ? <div className="grid md:grid-cols-2 gap-4">{upcoming.map((m) => <MatchCard key={m.id} m={m} />)}</div> : <EmptyState big="No upcoming matches." />}
        <h2 className="font-display text-3xl mt-12 mb-4">Recent results</h2>
        {results.length ? <div className="grid md:grid-cols-2 gap-4">{results.map((m) => <MatchCard key={m.id} m={m} />)}</div> : <EmptyState big="No results yet." />}
      </div>
    </section>
  );
}
