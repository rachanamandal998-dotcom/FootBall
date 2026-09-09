import { useData } from "../context/DataContext.jsx";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Matches() {
  const { DB, route, setRoute } = useData();
  const tab = route.tab || "upcoming";
  const groups = {
    upcoming: DB.matches
      .filter((m) => m.status === "Scheduled")
      .sort((a, b) => a.date.localeCompare(b.date)),
    live: DB.matches.filter((m) => m.status === "Live"),
    finished: DB.matches
      .filter((m) => m.status === "Finished")
      .sort((a, b) => b.date.localeCompare(a.date)),
  };

  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-barlow text-[32px] leading-none text-[#12181A]">Match Center</h2>
        <p className="text-sm text-[#2A3532]/70 mt-2 mb-6">
          All fixtures and results across Sindhuli district football
        </p>

        <div className="flex gap-2 flex-wrap mb-7">
          {["upcoming", "live", "finished"].map((k) => (
            <button
              key={k}
              onClick={() => setRoute({ ...route, tab: k })}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                tab === k
                  ? "bg-[#0E3B2E] text-[#F5F2E8] border-[#0E3B2E]"
                  : "bg-white border-[#ddd6bd] text-[#2A3532] hover:border-[#0E3B2E]"
              }`}
            >
              {k[0].toUpperCase() + k.slice(1)} ({groups[k].length})
            </button>
          ))}
        </div>

        {groups[tab].length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {groups[tab].map((m) => (
              <MatchCard key={m.id} m={m} />
            ))}
          </div>
        ) : (
          <EmptyState big={`No ${tab} matches.`} />
        )}
      </div>
    </section>
  );
}