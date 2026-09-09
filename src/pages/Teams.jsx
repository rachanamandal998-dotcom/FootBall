import { useData } from "../context/DataContext.jsx";
import { colorFor, initials } from "../utils/helpers.js";
import { useState } from "react";

export default function Teams() {
  const { DB, go, teamPlayers } = useData();
  const [selectedRegion, setSelectedRegion] = useState("all");

  const getStats = (tid) => {
    let s = { played: 0, won: 0 };
    DB.matches
      .filter(
        (m) => m.status === "Finished" && (m.homeTeamId === tid || m.awayTeamId === tid),
      )
      .forEach((m) => {
        const gf = m.homeTeamId === tid ? m.homeScore : m.awayScore;
        const ga = m.homeTeamId === tid ? m.awayScore : m.homeScore;
        s.played++;
        if (gf > ga) s.won++;
      });
    return s;
  };

  const regions = ["all", ...new Set(DB.teams.map((t) => t.location))];

  const filteredTeams =
    selectedRegion === "all" ? DB.teams : DB.teams.filter((t) => t.location === selectedRegion);

  const totalPlayers = DB.teams.reduce((sum, team) => sum + teamPlayers(team.id).length, 0);
  const totalMatches = DB.matches.filter((m) => m.status === "Finished").length;
  const totalWins = DB.teams.reduce((sum, team) => sum + getStats(team.id).won, 0);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white bg-gradient-to-b from-[#0E3B2E] to-[#0A2A20] py-24">
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(100deg,transparent_0_90px,rgba(255,255,255,0.6)_90px_92px,transparent_92px_180px)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-[#C7A344]/15 border border-[#C7A344]/30 rounded-full px-4 py-1.5 text-xs tracking-[0.5px] text-[#E4CD8A] mb-8">
            DISTRICT FOOTBALL CLUBS
          </div>

          <h1 className="font-barlow font-extrabold text-5xl sm:text-6xl leading-[1.05] tracking-tight mb-6">
            All teams in Sindhuli
          </h1>

          <p className="font-barlow text-lg text-[#E9E4D2]/80 mt-2 max-w-xl leading-relaxed">
            Compete with {DB.teams.length} clubs across the district. Track standings, explore
            squads, and follow your favorite team.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-10 w-full">
            {[
              ["CLUBS", DB.teams.length],
              ["PLAYERS", `${totalPlayers}+`],
              ["MATCHES", totalMatches],
            ].map(([label, val], i) => (
              <div
                key={label}
                className={`text-center ${i > 0 ? "border-l border-white/10" : ""}`}
              >
                <div className="font-barlow text-3xl font-bold leading-none mb-2 text-[#F5F2E8]">
                  {val}
                </div>
                <div className="text-[10.5px] tracking-[0.5px] text-[#E9E4D2]/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="py-8 bg-white border-b border-[#e4dfcd]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-barlow text-xl font-bold text-[#12181A]">Filter by Region</h2>
              <p className="text-[#2A3532]/60 text-xs mt-1">Find teams in your area</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                  selectedRegion === "all"
                    ? "bg-[#0E3B2E] text-[#F5F2E8] border-[#0E3B2E]"
                    : "bg-white border-[#ddd6bd] text-[#2A3532] hover:border-[#0E3B2E]"
                }`}
              >
                All ({DB.teams.length})
              </button>
              {regions
                .filter((r) => r !== "all")
                .map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors whitespace-nowrap ${
                      selectedRegion === region
                        ? "bg-[#0E3B2E] text-[#F5F2E8] border-[#0E3B2E]"
                        : "bg-white border-[#ddd6bd] text-[#2A3532] hover:border-[#0E3B2E]"
                    }`}
                  >
                    {region} ({DB.teams.filter((t) => t.location === region).length})
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAMS GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="font-barlow text-[32px] leading-none text-[#12181A]">
              {selectedRegion === "all" ? "All Teams" : selectedRegion}
            </h2>
            <p className="text-sm text-[#2A3532]/70 mt-2">
              Showing{" "}
              <span className="font-semibold text-[#0E3B2E]">
                {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}
              </span>{" "}
              across the district
            </p>
          </div>

          {filteredTeams.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => {
                const stats = getStats(team.id);
                const players = teamPlayers(team.id);
                const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

                return (
                  <div
                    key={team.id}
                    onClick={() => go("team", { id: team.id })}
                    className="group cursor-pointer bg-white border border-[#e4dfcd] hover:border-[#C7A344]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(0,0,0,0.35)] transition-all"
                  >
                    <div className="h-28 flex items-center justify-center bg-gradient-to-br from-[#134A38] to-[#0E3B2E]">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center font-barlow font-extrabold text-xl text-white border-4 border-white/20 group-hover:scale-105 transition-transform"
                        style={{ background: colorFor(team.name) }}
                      >
                        {initials(team.shortName)}
                      </div>
                    </div>

                    <div className="px-5 py-5">
                      <h3 className="text-lg font-barlow font-bold text-[#12181A] group-hover:text-[#0E3B2E] transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#2A3532]/60 mt-1">
                        {team.location}
                      </p>

                      <div className="inline-block bg-[#F0EDE0] px-3 py-1 mt-3">
                        <p className="text-[10.5px] font-bold text-[#2A3532] tracking-wide">
                          {players.length} PLAYERS
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#efe9d8] text-center">
                        <div>
                          <div className="text-lg font-barlow font-extrabold text-[#12181A]">
                            {stats.played}
                          </div>
                          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">
                            PLAYED
                          </div>
                        </div>
                        <div className="border-l border-r border-[#efe9d8]">
                          <div className="text-lg font-barlow font-extrabold text-[#0E3B2E]">
                            {stats.won}
                          </div>
                          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">
                            WINS
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-barlow font-extrabold text-[#C7A344]">
                            {winRate}%
                          </div>
                          <div className="text-[9.5px] text-[#9a9482] tracking-wide mt-0.5">
                            RATE
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#efe9d8]">
                        <div className="w-full bg-[#efe9d8] h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C7A344] h-full transition-all duration-500"
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                        <p className="text-[10.5px] text-[#9a9482] mt-2 font-semibold">
                          Win rate this season
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-[#2A3532]/60">
              <p className="text-sm">No teams found in this region.</p>
              <button
                onClick={() => setSelectedRegion("all")}
                className="mt-3 text-[#1E7245] hover:text-[#0E3B2E] font-semibold text-[13.5px] border-b border-[#1E7245] pb-0.5 transition-colors"
              >
                View all teams
              </button>
            </div>
          )}
        </div>
      </section>

      {/* INFO STATS */}
      <section className="py-16 bg-[#F0EDE0]/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["Total Players", totalPlayers + "+", "Players competing across all teams"],
              ["Total Wins", totalWins, "Victories recorded this season"],
              ["Matches Played", totalMatches, "Total matches across all teams"],
            ].map(([label, val, sub]) => (
              <div key={label} className="bg-white border border-[#e4dfcd] p-6">
                <h3 className="text-[11px] tracking-[0.5px] text-[#9a9482] font-semibold">
                  {label.toUpperCase()}
                </h3>
                <p className="text-3xl font-barlow font-extrabold text-[#0E3B2E] mt-2">{val}</p>
                <p className="text-[13px] text-[#2A3532]/70 mt-2">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}