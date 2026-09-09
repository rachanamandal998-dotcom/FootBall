import { useData } from "../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";
import MatchCard from "../components/MatchCard.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import NewsCard from "../components/NewsCard.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";

const linkCls =
  "text-[#1E7245] font-semibold text-[13.5px] border-b border-[#1E7245] hover:border-[#0E3B2E] hover:text-[#0E3B2E] pb-0.5 transition-colors";

function SectionHeader({ title, sub, cta, onCta }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
      <div>
        <h2 className="font-barlow text-[32px] leading-none text-[#12181A]">{title}</h2>
        {sub && <p className="text-sm text-[#2A3532]/70 mt-2">{sub}</p>}
      </div>
      {cta && (
        <button onClick={onCta} className={linkCls}>
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
  const featured = [...DB.players]
    .sort((a, b) => playerStats(b.id).goals - playerStats(a.id).goals)
    .slice(0, 4);
  const news = DB.news.slice(0, 3);
  const topStandings = standingsFor("c1").slice(0, 5);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white bg-gradient-to-b from-[#0E3B2E] to-[#0A2A20] py-24">
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(100deg,transparent_0_90px,rgba(255,255,255,0.6)_90px_92px,transparent_92px_180px)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-[#C7A344]/15 border border-[#C7A344]/30 rounded-full px-4 py-1.5 text-xs tracking-[0.5px] text-[#E4CD8A] mb-8">
            SINDHULI, NEPAL · DISTRICT FOOTBALL
          </div>

          <h1 className="font-barlow font-extrabold text-5xl sm:text-6xl leading-[1.05] tracking-tight mb-6">
            Your home for football
            <br />
            in Sindhuli.
          </h1>

          <p className="font-barlow text-lg text-[#E9E4D2]/80 mt-2 max-w-xl leading-relaxed">
            Follow every club, player, match and moment across the Sindhuli football
            community.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center">
            <button
              onClick={() => navigate("/teams")}
              className="bg-[#C7A344] hover:bg-[#E4CD8A] text-[#12181A] font-semibold px-7 py-3 rounded-sm text-[14.5px] transition-all hover:-translate-y-0.5"
            >
              Explore Teams ({DB.teams.length})
            </button>
            <button
              onClick={() => navigate("/matches")}
              className="border border-white/25 hover:border-[#E4CD8A] hover:text-[#E4CD8A] text-white px-7 py-3 rounded-sm text-[14.5px] transition-all"
            >
              View Matches ({DB.matches.length})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 border-t border-white/10 pt-10 w-full">
            {[
              ["CLUBS", DB.teams.length],
              ["PLAYERS", `${DB.players.length}+`],
              ["MATCHES", DB.matches.length],
              ["NEWS", DB.news.length],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="font-barlow text-3xl font-bold leading-none mb-2 text-[#F5F2E8]">
                  {val}
                </div>
                <div className="text-[10.5px] tracking-[0.5px] text-[#E9E4D2]/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Upcoming Matches"
            sub={`${upcoming.length} scheduled matches`}
            cta="Match Center"
            onCta={() => navigate("/matches")}
          />
          {upcoming.length ? (
            <div className="grid md:grid-cols-3 gap-4">
              {upcoming.map((m) => (
                <MatchCard key={m.id} m={m} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#2A3532]/50 text-sm">
              No upcoming matches scheduled.
            </div>
          )}
        </div>
      </section>

      {/* RECENT RESULTS */}
      <section className="py-16 bg-[#F0EDE0]/30">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Recent Results"
            sub={`${finished.length} matches finished`}
            cta="All Results"
            onCta={() => navigate("/matches")}
          />
          {finished.length ? (
            <div className="grid md:grid-cols-3 gap-4">
              {finished.map((m) => (
                <MatchCard key={m.id} m={m} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#2A3532]/50 text-sm">
              No finished matches yet.
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PLAYERS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Featured Players"
            sub={`Top ${featured.length} goal scorers from across Sindhuli district`}
            cta="All Players"
            onCta={() => navigate("/players")}
          />
          {featured.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((p) => (
                <PlayerCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#2A3532]/50 text-sm">
              No players available.
            </div>
          )}
        </div>
      </section>

      {/* STANDINGS */}
      <section className="py-16 bg-[#F0EDE0]/30">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title={`League Standings`}
            sub={DB.competitions[0]?.name || "Championship"}
            cta="Full Table"
            onCta={() => navigate("/standings")}
          />
          <StandingsTable rows={topStandings} />
        </div>
      </section>

      {/* NEWS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Latest News"
            sub={`${DB.news.length} stories from the community`}
            cta="All News"
            onCta={() => navigate("/news")}
          />
          {news.length ? (
            <div className="grid md:grid-cols-3 gap-4">
              {news.map((n) => (
                <NewsCard key={n.id} n={n} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#2A3532]/50 text-sm">
              No news available yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}