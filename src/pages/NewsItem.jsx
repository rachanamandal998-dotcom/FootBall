import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { fmtDate } from "../utils/helpers.js";

export default function NewsItem() {
  const { id } = useParams();
  const { DB } = useData();
  const n = DB.news.find((x) => x.id === id && x.status === "Published");
  if (!n) return <div className="max-w-3xl mx-auto px-6 py-16"><EmptyState big="Story not found." /></div>;
  return (
    <article className="pb-16">
      {n.image && <img src={n.image} alt="" className="w-full h-72 object-cover" />}
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative">
        <div className="bg-white border p-6 shadow-lg">
          <Link to="/news" className="text-sm text-turf font-semibold">← News</Link>
          <div className="text-xs uppercase text-gold mt-3">{n.category} · {fmtDate(n.date)} · {n.author}</div>
          <h1 className="font-display text-4xl mt-2">{n.title}</h1>
          <p className="mt-6 leading-7 text-ink/80 whitespace-pre-wrap">{n.content}</p>
        </div>
      </div>
    </article>
  );
}
