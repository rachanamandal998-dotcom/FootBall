import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import MatchCard from "../components/MatchCard.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import NewsCard from "../components/NewsCard.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";
import Football3D from "../components/Football3D.jsx";
import Stadium3D from "../components/Stadium3D.jsx";
import TrophyCabinet from "../components/TrophyCabinet.jsx";
import EmptyState from "../components/EmptyState.jsx";

function SectionHeader({ title, sub, cta, onCta }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
      <div>
        <h2 className="font-display text-[34px] leading-none text-charcoal">{title}</h2>
        {sub && <p className="text-sm text-ink/70 mt-2">{sub}</p>}
      </div>
      {cta && (
        <button onClick={onCta} className="text-turf font-semibold text-sm border-b border-turf">
          {cta}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const { DB, standingsFor, playerStats } = useData();
  const navigate = useNavigate();
  const upcoming = DB.matches.filter((m) => m.status === "Scheduled").slice(0, 3);
  const finished = DB.matches.filter((m) => m.status === "Finished").slice(0, 3);
  const featured = [...DB.players].sort((a, b) => playerStats(b.id).goals - playerStats(a.id).goals).slice(0, 4);
  const news = DB.news.filter((n) => n.status === "Published").slice(0, 3);
  const topStandings = standingsFor(DB.competitions[0]?.id).slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden text-white hero-glow pitch-lines py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 text-xs tracking-[0.5px] text-gold-soft mb-6">
              SINDHULI, NEPAL · DISTRICT FOOTBALL
            </div>
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[0.95] tracking-tight">
              Sindhuli Football Clubhouse
            </h1>
            <p className="font-display text-2xl text-gold-soft mt-4">Your home for football in Sindhuli.</p>
            <p className="text-[#E9E4D2]/80 mt-4 max-w-xl">Manage. Play. Connect. Follow clubs, players, matches and community football across the district.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={() => navigate("/teams")} className="bg-gold hover:bg-gold-soft text-charcoal font-semibold px-7 py-3 rounded-sm">Explore Teams</button>
              <button onClick={() => navigate("/matches")} className="border border-white/25 hover:border-gold-soft hover:text-gold-soft px-7 py-3 rounded-sm">View Matches</button>
              <button onClick={() => navigate("/players")} className="border border-white/25 hover:border-gold-soft px-7 py-3 rounded-sm">Players</button>
            </div>
          </div>
          <div className="flex justify-center"><Football3D className="w-64 h-64 md:w-80 md:h-80" /></div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Upcoming Matches" sub="Next fixtures across Sindhuli" cta="Match Center" onCta={() => navigate("/matches")} />
          {upcoming.length ? (
            <div className="grid md:grid-cols-3 gap-4">{upcoming.map((m) => <MatchCard key={m.id} m={m} />)}</div>
          ) : (
            <EmptyState big="No upcoming matches." sub="Fixtures will appear here when scheduled." />
          )}
        </div>
      </section>

      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Recent Results" cta="All Results" onCta={() => navigate("/matches")} />
          {finished.length ? (
            <div className="grid md:grid-cols-3 gap-4">{finished.map((m) => <MatchCard key={m.id} m={m} />)}</div>
          ) : (
            <EmptyState big="No finished matches yet." />
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Featured Players" cta="All Players" onCta={() => navigate("/players")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{featured.map((p) => <PlayerCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <Stadium3D />
          <div>
            <h2 className="font-display text-4xl">A stadium for the hills</h2>
            <p className="text-ink/70 mt-3">From Sindhulimadi to Marin, the clubhouse tracks every kick on district pitches. Standings update the moment a result is entered.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="League Standings" sub={DB.competitions[0]?.name} cta="Full Table" onCta={() => navigate("/standings")} />
          <StandingsTable rows={topStandings} />
        </div>
      </section>

      <section className="py-16 bg-pitch text-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl mb-8">Trophy cabinet</h2>
          <TrophyCabinet />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Latest News" cta="All News" onCta={() => navigate("/news")} />
          {news.length ? (
            <div className="grid md:grid-cols-3 gap-4">{news.map((n) => <NewsCard key={n.id} n={n} />)}</div>
          ) : (
            <EmptyState big="No news published yet." />
          )}
        </div>
      </section>
    </>
  );
}
