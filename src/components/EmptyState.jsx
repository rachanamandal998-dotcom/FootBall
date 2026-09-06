export default function EmptyState({ big, small }){
  return (
    <div className="text-center py- px-5 text-[#2A3532] border border-dashed border-[#ddd6bd] bg-white rounded-">
      <div className="font-barlow text-xl text-[#12181A] mb-1.5">{big}</div>
      <div className="text-">{small}</div>
    </div>
  )
}