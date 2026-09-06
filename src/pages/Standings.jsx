import { useData } from "../context/DataContext.jsx";
import { StandingsTable } from "../components/StandingsTable.jsx";

export default function Standings() {
  const { DB, standingsFor, leagueLeaders } = useData();
  return (
    <section className="py-14">
      <div className="max-w- mx-auto px-6">
        <h2 className="font-barlow text- leading-none">League Standings</h2>
        <p className="text-sm text-[#2A3532] mb-5">
          {DB.competitions[0]?.name} · {DB.competitions[0]?.season}
        </p>
        <StandingsTable rows={standingsFor("c1")} />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            ["Top Scorer", "goals"],
            ["Most Assists", "assists"],
            ["Clean Sheets", "cleanSheets"],
          ].map(([l, k]) => (
            <div key={l} className="bg-[#12181A] text-[#F5F2E8] p- rounded-">
              <div className="text- tracking-[0.5px] text-[#E4CD8A] mb-2.5">
                {l.toUpperCase()}
              </div>
              {leagueLeaders(k, 5).map((x) => (
                <div
                  key={x.p.id}
                  className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0 text-[13.5px]"
                >
                  <span>{x.p.displayName}</span>
                  <span className="font-barlow font-extrabold text- text-[#C7A344]">
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