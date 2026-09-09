import { useData } from "../context/DataContext.jsx";

export default function Competitions() {
  const { DB, go } = useData();
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="font-barlow text-[32px] leading-none text-[#12181A]">
            Competitions
          </h2>
          <p className="text-sm text-[#2A3532]/70 mt-2">
            Leagues, cups and community tournaments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {DB.competitions.map((c) => (
            <div
              key={c.id}
              onClick={() => go("competition", { id: c.id })}
              className="bg-white border border-[#e4dfcd] p-5 rounded-sm cursor-pointer hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-barlow text-xl font-bold text-[#12181A] leading-tight">
                  {c.name}
                </h3>
                <span className="shrink-0 text-[11px] font-semibold text-[#2A3532]/60 whitespace-nowrap mt-1">
                  {c.teamIds.length} teams
                </span>
              </div>
              <div className="text-xs text-[#2A3532]/60 mt-1">{c.season}</div>
              <div className="text-sm mt-3 leading-[1.55] text-[#2A3532] line-clamp-2">
                {c.description}
              </div>
              <div className="text-xs mt-3.5 pt-3 border-t border-[#efe9d8] text-[#2A3532]/70">
                Points: Win {c.pointsWin} · Draw {c.pointsDraw} · Loss{" "}
                {c.pointsLoss}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-2 mt-10">
          {DB.competitions.map((c) => (
            <div
              key={c.id}
              className="shrink-0 w-52 bg-gradient-to-br from-[#1c2420] to-[#12181A] text-[#F5F2E8] px-5 py-6 text-center border-t-[3px] border-t-[#C7A344]"
            >
              <div className="text-3xl mb-2.5">🏆</div>
              <div className="text-sm font-bold leading-snug">{c.name}</div>
              <div className="text-xs text-[#E4CD8A] mt-1.5">{c.season}</div>
            </div>
          ))}
          <div className="shrink-0 w-52 bg-gradient-to-br from-[#1c2420] to-[#12181A] text-[#F5F2E8] px-5 py-6 text-center border-t-[3px] border-t-[#C7A344]">
            <div className="text-3xl mb-2.5">🏆</div>
            <div className="text-sm font-bold leading-snug">
              District League
            </div>
            <div className="text-xs text-[#E4CD8A] mt-1.5">
              2024/25 Champions: Sindhuli FC
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
