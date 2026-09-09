import { useData } from "../context/DataContext.jsx";
import { fmtDate } from "../utils/helpers.js";

const CATEGORY_COLOR = {
  match: ["#1E7245", "#0E3B2E"],
  transfer: ["#8A6A2A", "#5C4319"],
  injury: ["#A24B39", "#6B2F22"],
  club: ["#2A3532", "#12181A"],
};

export default function NewsItem() {
  const { DB, route, go } = useData();
  const n = DB.news.find((x) => x.id === route.id);
  if (!n) return null;
  const [from, to] = CATEGORY_COLOR[n.category] || ["#1E7245", "#0E3B2E"];

  return (
    <section className="py-14">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => go("news")}
          className="text-[#1E7245] font-semibold text-[13.5px] border-b border-[#1E7245] pb-0.5"
        >
          ← Back to News
        </button>

        <div className="text-[10.5px] font-bold text-[#1E7245] tracking-[0.5px] mt-5">
          {n.category.toUpperCase()}
        </div>
        <h1 className="font-barlow text-3xl sm:text-4xl leading-[1.05] mt-2 text-[#12181A]">
          {n.title}
        </h1>
        <div className="text-[13px] text-[#2A3532]/70 mt-2.5 mb-6">
          {fmtDate(n.date)} · {n.author}
        </div>

        <div
          className="h-56 flex items-center justify-center relative overflow-hidden rounded-sm mb-7"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          <span className="font-barlow font-extrabold text-[120px] text-white/10 tracking-tight select-none">
            {n.category[0].toUpperCase()}
          </span>
        </div>

        <p className="text-[15.5px] leading-[1.7] text-[#12181A] max-w-[65ch]">{n.content}</p>
      </div>
    </section>
  );
}