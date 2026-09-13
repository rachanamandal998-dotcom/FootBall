import { useNavigate } from "react-router-dom";
import { fmtDate } from "../utils/helpers.js";

export default function NewsCard({ n }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/news/${n.id}`)} className="text-left bg-white border border-[#e4dfcd] overflow-hidden hover:-translate-y-1 transition-all w-full">
      <div className="h-40 bg-pitch overflow-hidden">
        {n.image ? <img src={n.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full pitch-lines" />}
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wide text-gold font-bold">{n.category} · {fmtDate(n.date)}</div>
        <h3 className="font-display text-xl font-bold mt-1 leading-tight">{n.title}</h3>
        <p className="text-sm text-ink/70 mt-2 line-clamp-2">{n.excerpt || n.content}</p>
      </div>
    </button>
  );
}
