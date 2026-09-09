import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";

export default function Standings() {
  const { DB, standingsFor, leagueLeaders } = useData();
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-barlow text-4xl leading-none text-[#12181A]">League Standings</h2>
        <p className="text-sm text-[#2A3532]/70 mb-6 mt-2">
          {DB.competitions[0]?.name} · {DB.competitions[0]?.season}
        </p>
        <StandingsTable rows={standingsFor("c1")} />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            ["Top Scorer", "goals"],
            ["Most Assists", "assists"],
            ["Clean Sheets", "cleanSheets"],
          ].map(([l, k]) => (
            <div key={l} className="bg-[#12181A] text-[#F5F2E8] p-5 rounded-sm">
              <div className="text-[11px] tracking-[0.5px] text-[#E4CD8A] mb-2.5 font-semibold">
                {l}
              </div>
              {leagueLeaders(k, 5).map((x, idx) => (
                <div
                  key={x.p.id}
                  className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0 text-[13.5px]"
                >
                  <span className={idx === 0 ? "font-semibold" : "text-white/85"}>
                    {x.p.displayName}
                  </span>
                  <span className="font-barlow font-extrabold text-base text-[#C7A344]">
                    {x.s[k]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}