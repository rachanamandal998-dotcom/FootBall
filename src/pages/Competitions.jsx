import { useData } from '../context/DataContext.jsx'

export default function Competitions(){
  const { DB, go } = useData()
  return (
    <section className="py-14"><div className="max-w- mx-auto px-6">
      <div className="mb-6"><h2 className="font-barlow text-">Competitions</h2><p className="text-sm text-[#2A3532] mt-1">Leagues, cups and community tournaments</p></div>

      <div className="grid md:grid-cols-2 gap-4">
        {DB.competitions.map(c=>(
          <div key={c.id} onClick={()=>go('competition',{id:c.id})} className="bg-white border border-[#e4dfcd] p-5 rounded- cursor-pointer hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all">
            <h3 className="font-barlow text- font-bold">{c.name}</h3>
            <div className="text- text-[#2A3532] mt-1">{c.season} · {c.teamIds.length} teams</div>
            <div className="text-[13.5px] mt-2.5 leading-[1.5]">{c.description}</div>
            <div className="text- mt-3 text-[#2A3532]">Points: Win {c.pointsWin} · Draw {c.pointsDraw} · Loss {c.pointsLoss}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 mt-8">
        {DB.competitions.map(c=>(
          <div key={c.id} className="shrink-0 w- bg-gradient-to-br from-[#1c2420] to-[#12181A] text-[#F5F2E8] p-4 text-center border-t- border-t-[#C7A344]">
            <div className="text- mb-2">🏆</div><div className="text-[12.5px] font-bold">{c.name}</div><div className="text- text-[#E4CD8A] mt-1">{c.season}</div>
          </div>
        ))}
        <div className="shrink-0 w- bg-gradient-to-br from-[#1c2420] to-[#12181A] text-[#F5F2E8] p-4 text-center border-t- border-t-[#C7A344]"><div className="text- mb-2">🏆</div><div className="text-[12.5px] font-bold">District League</div><div className="text- text-[#E4CD8A] mt-1">2024/25 Champions: Sindhuli FC</div></div>
      </div>
    </div></section>
  )
}