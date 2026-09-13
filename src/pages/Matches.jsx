import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TABS = [
  { id: "Upcoming", statuses: ["Scheduled"] },
  { id: "Live", statuses: ["Live", "Half Time"] },
  { id: "Finished", statuses: ["Finished"] },
];

export default function Matches() {
  const { DB } = useData();
  const [tab, setTab] = useState("Upcoming");
  const statuses = TABS.find((t) => t.id === tab).statuses;
  const list = useMemo(
    () => DB.matches.filter((m) => statuses.includes(m.status)).sort((a, b) => String(a.date).localeCompare(String(b.date))),
    [DB.matches, statuses],
  );

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-5xl">Match Center</h1>
        <p className="text-ink/70 mt-2">Live scores, fixtures and results from Sindhuli football.</p>
        <div className="flex gap-2 mt-8 mb-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-semibold border-b-2 ${tab === t.id ? "border-gold text-pitch" : "border-transparent text-ink/50"}`}>
              {t.id}
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{list.map((m) => <MatchCard key={m.id} m={m} />)}</div>
        ) : (
          <EmptyState big={`No ${tab.toLowerCase()} matches.`} />
        )}
      </div>
    </section>
  );
}
