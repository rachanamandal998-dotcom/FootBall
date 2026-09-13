import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import NewsCard from "../components/NewsCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const CATS = ["All", "Match", "Team", "Player", "Transfer", "Competition", "Community"];

export default function News() {
  const { DB } = useData();
  const [cat, setCat] = useState("All");
  const items = DB.news.filter((n) => n.status === "Published" && (cat === "All" || n.category === cat));
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-5xl">News</h1>
        <div className="flex flex-wrap gap-2 mt-6">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-sm border ${cat === c ? "bg-pitch text-ivory" : "bg-white"}`}>{c}</button>
          ))}
        </div>
        {items.length ? <div className="grid md:grid-cols-3 gap-4 mt-8">{items.map((n) => <NewsCard key={n.id} n={n} />)}</div> : <div className="mt-8"><EmptyState big="No news published yet." /></div>}
      </div>
    </section>
  );
}
