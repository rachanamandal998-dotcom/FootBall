import { useData } from "../context/DataContext.jsx";
import NewsCard from "../components/NewsCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function News() {
  const { DB } = useData();
  const list = DB.news
    .filter((n) => n.status === "Published")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-7">
          <h2 className="font-barlow text-4xl leading-none text-[#12181A]">News</h2>
          <p className="text-sm text-[#2A3532]/70 mt-2">Stories from across the district</p>
        </div>
        {list.length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {list.map((n) => (
              <NewsCard key={n.id} n={n} />
            ))}
          </div>
        ) : (
          <EmptyState big="No published stories yet." />
        )}
      </div>
    </section>
  );
}