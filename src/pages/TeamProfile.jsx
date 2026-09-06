import { useData } from '../context/DataContext.jsx'
import { colorFor, initials } from '../utils/helpers.js'
import PlayerCard from '../components/PlayerCard.jsx'
import MatchCard from '../components/MatchCard.jsx'

export default function TeamProfile(){
  const { DB, route, team, teamPlayers } = useData()
  const t = team(route.id)
  if(!t) return null
  const squad = teamPlayers(t.id)

  const getStats = () => {
    let s={played:0,won:0,draw:0,lost:0,gf:0,ga:0,cleanSheets:0}
    DB.matches.filter(m=>m.status==='Finished'&&(m.homeTeamId===t.id||m.awayTeamId===t.id)).forEach(m=>{
      const isHome=m.homeTeamId===t.id, gf=isHome?m.homeScore:m.awayScore, ga=isHome?m.awayScore:m.homeScore
      s.played++; s.gf+=gf; s.ga+=ga
      if(gf>ga) s.won++; else if(gf<ga) s.lost++; else s.draw++
      if(ga===0) s.cleanSheets++
    })
    return s
  }
  const s=getStats()
  const upcoming = DB.matches.filter(m=>m.status==='Scheduled'&&(m.homeTeamId===t.id||m.awayTeamId===t.id)).slice(0,3)
  const recent = DB.matches.filter(m=>m.status==='Finished'&&(m.homeTeamId===t.id||m.awayTeamId===t.id)).slice(0,3)

  return (
    <section className="py-14"><div className="max-w- mx-auto px-6">
      <div className="flex gap-5 items-center mb-7 flex-wrap">
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-barlow font-extrabold text- text-[#12181A] shadow-lg" style={{background:colorFor(t.name)}}>{initials(t.shortName)}</div>
        <div><h1 className="font-barlow text- leading-none">{t.name}</h1><div className="text-sm text-[#2A3532] mt-1">{t.location} · {t.stadium} · Coach: {t.coach} · Est. {t.founded}</div></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(s).map(([k,v])=><div key={k} className="bg-white border border-[#e4dfcd] p-3"><div className="text- text-[#9a9482] tracking-wide">{k.toUpperCase()}</div><div className="font-barlow font-bold text- mt-1">{v}</div></div>)}
        <div className="bg-white border border-[#e4dfcd] p-3"><div className="text- text-[#9a9482]">SQUAD SIZE</div><div className="font-barlow font-bold text- mt-1">{squad.length}</div></div>
      </div>

      <h3 className="font-barlow text- mb-3.5">Squad</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap- mb-10">{squad.map(p=><PlayerCard key={p.id} p={p} />)}</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div><h3 className="font-barlow text-xl mb-3">Upcoming Matches</h3><div className="space-y-3">{upcoming.length? upcoming.map(m=><MatchCard key={m.id} m={m} />) : <div className="text-sm text-[#2A3532] border border-dashed border-[#ddd6bd] bg-white p-6 text-center">No upcoming matches.</div>}</div></div>
        <div><h3 className="font-barlow text-xl mb-3">Recent Results</h3><div className="space-y-3">{recent.length? recent.map(m=><MatchCard key={m.id} m={m} />) : <div className="text-sm text-[#2A3532] border border-dashed border-[#ddd6bd] bg-white p-6 text-center">No results yet.</div>}</div></div>
      </div>
    </div></section>
  )
}