import { useData } from "../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";
import MatchCard from "../components/MatchCard.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import NewsCard from "../components/NewsCard.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";

export default function Home() {
  const { DB, standingsFor, playerStats } = useData();
  const navigate = useNavigate();

  // FULL DATA
  const upcoming = DB.matches
    .filter((m) => m.status === "Scheduled")
    .slice(0, 3);
  const finished = DB.matches
    .filter((m) => m.status === "Finished")
    .slice(0, 3);
  const featured = [...DB.players]
    .sort((a, b) => playerStats(b.id).goals - playerStats(a.id).goals)
    .slice(0, 4);
  const news = DB.news.slice(0, 3);
  const topStandings = standingsFor("c1").slice(0, 5);

  return (
    <>
      {/* HERO - mt-8 = GAP BETWEEN NAV AND HERO */}
      <section className="relative mt-8 overflow-hidden text-[#F5F2E8] bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,163,68,0.22),transparent_60%),linear-gradient(180deg,#0E3B2E_0%,#0A2A20_70%,#081F19_100%)] py-">
        <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(100deg,transparent_0_90px,rgba(255,255,255,0.5)_90px_92px,transparent_92px_180px)] pointer-events-none" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w- h- border border-dashed border-white/15 rounded-full pointer-events-none" />
        <div className="absolute top- left-1/2 -translate-x-1/2 w- h- border border-dashed border-white/10 rounded-full pointer-events-none" />

        <div className="relative max-w- mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text- tracking- text-[#E4CD8A] mb-5">
            ⚽ SINDHULI, NEPAL · DISTRICT FOOTBALL
          </div>

          <h1 className="font-barlow font-extrabold text- md:text- leading-[0.9] tracking-[-0.5px]">
            Your home for
            <br />
            <span className="text-[#C7A344]">football</span> in Sindhuli.
          </h1>

          <p className="font-barlow text- md:text- text-[#E9E4D2] mt-5 max-w- leading-[1.5]">
            Follow every club, player, match and moment across the Sindhuli
            football community.
          </p>

          <div className="flex gap-3 mt-8 justify-center">
            <button
              onClick={() => navigate("/teams")}
              className="bg-[#C7A344] hover:bg-[#E4CD8A] text-[#12181A] font-bold px-6 py-3 rounded- text-"
            >
              Explore Teams ({DB.teams.length})
            </button>
            <button
              onClick={() => navigate("/matches")}
              className="bg-white/10 border border-white/20 text-[#F5F2E8] px-6 py-3 rounded- text-"
            >
              View Matches ({DB.matches.length})
            </button>
          </div>

          <div className="flex gap-10 mt-12 justify-center border-t border-white/10 pt-8">
            <div className="text-center">
              <div className="font-barlow text- leading-none font-bold">
                {DB.teams.length}
              </div>
              <div className="text- tracking- text-[#E9E4D2] mt-1">CLUBS</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-barlow text- leading-none font-bold">
                {DB.players.length}+
              </div>
              <div className="text- tracking- text-[#E9E4D2] mt-1">PLAYERS</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-barlow text- leading-none font-bold">
                {DB.matches.length}
              </div>
              <div className="text- tracking- text-[#E9E4D2] mt-1">MATCHES</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-barlow text- leading-none font-bold">
                {DB.news.length}
              </div>
              <div className="text- tracking- text-[#E9E4D2] mt-1">NEWS</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w- mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-barlow text- leading-none">
                Upcoming Matches
              </h2>
              <p className="text- text-[#2A3532] mt-1">
                {upcoming.length} scheduled
              </p>
            </div>

            <button
              onClick={() => navigate("/matches")}
              className="text-[#1E7245] font-semibold text- border-b border-[#1E7245]"
            >
              View Match Center →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex justify-center gap-4">
              {upcoming.map((m) => (
                <MatchCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#E9E4D2]">
        <div className="max-w- mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-barlow text- leading-none">Recent Results</h2>
              <p className="text- text-[#2A3532] mt-1">
                {finished.length} finished
              </p>
            </div>
            <button
              onClick={() => navigate("/matches")}
              className="text-[#1E7245] font-semibold text- border-b border-[#1E7245]"
            >
              All Results →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {finished.map((m) => (
              <MatchCard key={m.id} m={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w- mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-barlow text- leading-none">
                Featured Players
              </h2>
              <p className="text- text-[#2A3532] mt-1">
                Top {featured.length} scorers
              </p>
            </div>
            <button
              onClick={() => navigate("/players")}
              className="text-[#1E7245] font-semibold text- border-b border-[#1E7245]"
            >
              All Players →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <PlayerCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#E9E4D2]">
        <div className="max-w- mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-barlow text- leading-none">
              League Standings - {DB.competitions[0]?.name}
            </h2>
            <button
              onClick={() => navigate("/standings")}
              className="text-[#1E7245] font-semibold text- border-b border-[#1E7245]"
            >
              Full Table →
            </button>
          </div>
          <StandingsTable rows={topStandings} />
        </div>
      </section>

      <section className="py-14">
        <div className="max-w- mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-barlow text- leading-none">Latest News</h2>
              <p className="text- text-[#2A3532] mt-1">
                {DB.news.length} stories
              </p>
            </div>
            <button
              onClick={() => navigate("/news")}
              className="text-[#1E7245] font-semibold text- border-b border-[#1E7245]"
            >
              All News →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((n) => (
              <NewsCard key={n.id} n={n} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
