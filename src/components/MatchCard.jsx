import { useData } from '../context/DataContext.jsx'
import { colorFor, initials } from '../utils/helpers.js'

export default function MatchCard({ m }){
  const { DB, go } = useData()
  const h = DB.teams.find(t=>t.id===m.homeTeamId)
  const a = DB.teams.find(t=>t.id===m.awayTeamId)
  const comp = DB.competitions.find(c=>c.id===m.compId)

  return (
    <div onClick={()=>go('match',{id:m.id})}
         className="clip-corner bg-[#12181A] text-[#F5F2E8] p-[18px_20px] border border-white/10 hover:-translate-y- hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition-all cursor-pointer">
      <div className="flex justify-between items-center text- font-semibold text-[#E4CD8A] mb-3">
        <span className="truncate">{comp?.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide shrink-0 ml-2
          ${m.status==='Finished'? 'bg-[#C7A344]/20 text-[#E4CD8A]' : ''}
          ${m.status==='Scheduled'? 'bg-[#2C9457]/25 text-[#8fe0b3]' : ''}
          ${m.status==='Live'? 'bg-[#A6372B]/30 text-[#ff9a89] animate-pulse' : ''}
        `}>{m.status.toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1"><div className="w-7 h-7 rounded-full flex items-center justify-center font-barlow font-extrabold text- text-[#12181A] shrink-0" style={{background:colorFor(h?.name||'?')}}>{initials(h?.shortName||'?')}</div><span className="text-[13.5px] font-semibold truncate">{h?.shortName}</span></div>
        <div className="font-barlow font-extrabold text- text-[#E4CD8A] px-2 whitespace-nowrap">{m.status==='Finished'? `${m.homeScore} – ${m.awayScore}` : 'VS'}</div>
        <div className="flex items-center gap-2 min-w-0 flex-1 flex-row-reverse text-right"><div className="w-7 h-7 rounded-full flex items-center justify-center font-barlow font-extrabold text- text-[#12181A] shrink-0" style={{background:colorFor(a?.name||'?')}}>{initials(a?.shortName||'?')}</div><span className="text-[13.5px] font-semibold truncate">{a?.shortName}</span></div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text- text-[#E9E4D2]"><span>{m.date} · {m.time}</span><span className="truncate ml-2">{m.stadium}</span></div>
    </div>
  )
}