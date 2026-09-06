import { useData } from "../context/DataContext.jsx";
import { colorFor, initials } from "../utils/helpers.js";

export default function Teams() {
  const { DB, go, teamPlayers } = useData();
  const getStats = (tid) => {
    let s = { played: 0, won: 0 };
    DB.matches
      .filter(
        (m) =>
          m.status === "Finished" &&
          (m.homeTeamId === tid || m.awayTeamId === tid),
      )
      .forEach((m) => {
        const gf = m.homeTeamId === tid ? m.homeScore : m.awayScore;
        const ga = m.homeTeamId === tid ? m.awayScore : m.homeScore;
        s.played++;
        if (gf > ga) s.won++;
      });
    return s;
  };

  return (
    <section className="py-14">
      <div className="max-w- mx-auto px-6">
        <div className="mb-6">
          <h2 className="font-barlow text- leading-none">Teams</h2>
          <p className="text- text-[#2A3532] mt-1">
            Clubs competing across Sindhuli district football
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-">
          {DB.teams.map((t) => {
            const s = getStats(t.id);
            return (
              <div
                key={t.id}
                onClick={() => go("team", { id: t.id })}
                className="group bg-white border border-[#e4dfcd] rounded- overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.2)] transition-all"
              >
                <div className="h- flex items-center justify-center bg-gradient-to-br from-[#134A38] to-[#0E3B2E]">
                  <div
                    className="w- h- rounded-full flex items-center justify-center font-barlow font-extrabold text- text-[#12181A] border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform"
                    style={{ background: colorFor(t.name) }}
                  >
                    {initials(t.shortName)}
                  </div>
                </div>
                <div className="p-3 px-3.5">
                  <div className="font-barlow font-bold text- leading-tight">
                    {t.name}
                  </div>
                  <div className="text- text-[#2A3532] mt-1">
                    {t.location} · {teamPlayers(t.id).length} players ·{" "}
                    {s.played}P {s.won}W
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
