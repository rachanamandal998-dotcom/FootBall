import { useData } from '../context/DataContext.jsx'

export default function NewsCard({ n }){
  const { go } = useData()
  return (
    <div onClick={()=>go('newsitem',{id:n.id})} className="bg-white border border-[#e4dfcd] rounded- overflow-hidden hover:-translate-y- hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
      <div className="h- bg-gradient-to-br from-[#1E7245] to-[#0E3B2E] flex items-center justify-center text-white/50 font-barlow text- tracking-">{n.category.toUpperCase()}</div>
      <div className="p-3.5 px-4">
        <div className="text-[10.5px] font-bold text-[#1E7245] tracking-[0.5px]">{n.category.toUpperCase()}</div>
        <div className="font-barlow font-bold text- mt-1.5 leading-[1.1] line-clamp-2">{n.title}</div>
        <div className="text- text-[#2A3532] mt-1.5 line-clamp-2">{n.content.slice(0,90)}...</div>
        <div className="text- text-[#9a9482] mt-2.5">{n.date} · {n.author}</div>
      </div>
    </div>
  )
}