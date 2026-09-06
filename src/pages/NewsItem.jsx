import { useData } from "../context/DataContext.jsx";
import { fmtDate } from "../utils/helpers.js";

export default function NewsItem() {
  const { DB, route, go } = useData();
  const n = DB.news.find((x) => x.id === route.id);
  if (!n) return null;
  return (
    <section className="py-14">
      <div className="max-w- mx-auto px-6">
        <button
          onClick={() => go("news")}
          className="text-[#1E7245] font-semibold text-[13.5px] border-b border-[#1E7245] pb-0.5"
        >
          ← Back to News
        </button>
        <div className="text-[10.5px] font-bold text-[#1E7245] tracking-[0.5px] mt-4">
          {n.category.toUpperCase()}
        </div>
        <h1 className="font-barlow text- leading-[1.05] mt-2">{n.title}</h1>
        <div className="text- text-[#2A3532] mt-2 mb-5">
          {fmtDate(n.date)} · {n.author}
        </div>
        <div className="h- bg-gradient-to-br from-[#1E7245] to-[#0E3B2E] flex items-center justify-center text-white/50 font-barlow text-sm tracking-widest rounded- mb-5">
          {n.category.toUpperCase()}
        </div>
        <p className="text-[15.5px] leading-[1.7] text-[#12181A]">
          {n.content}
        </p>
      </div>
    </section>
  );
}
