import { useData } from "../context/DataContext.jsx";

const CATEGORY_COLOR = {
  match: ["#1E7245", "#0E3B2E"],
  transfer: ["#8A6A2A", "#5C4319"],
  injury: ["#A24B39", "#6B2F22"],
  club: ["#2A3532", "#12181A"],
};

export default function NewsCard({ n }) {
  const { go } = useData();
  const [from, to] = CATEGORY_COLOR[n.category] || ["#1E7245", "#0E3B2E"];

  return (
    <div
      onClick={() => go("newsitem", { id: n.id })}
      className="bg-white border border-[#e4dfcd] rounded-sm overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
    >
      <div
        className="h-32 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span className="font-barlow font-extrabold text-6xl text-white/10 tracking-tight select-none">
          {n.category[0].toUpperCase()}
        </span>
      </div>
      <div className="p-3.5 px-4">
        <div className="text-[10.5px] font-bold text-[#1E7245] tracking-[0.5px]">
          {n.category.toUpperCase()}
        </div>
        <div className="font-barlow font-bold text-lg mt-1.5 leading-[1.15] line-clamp-2 text-[#12181A]">
          {n.title}
        </div>
        <div className="text-[13px] text-[#2A3532]/70 mt-1.5 line-clamp-2">
          {n.content.slice(0, 90)}...
        </div>
        <div className="text-[11px] text-[#9a9482] mt-2.5 pt-2.5 border-t border-[#efe9d8]">
          {n.date} · {n.author}
        </div>
      </div>
    </div>
  );
}