import { useData } from '../context/DataContext.jsx'
import { StandingsTable } from '../components/StandingsTable.jsx'
import MatchCard from '../components/MatchCard.jsx'

export default function CompetitionProfile(){
  const { DB, route, standingsFor, leagueLeaders } = useData()
  const c = DB.competitions.find(x=>x.id===route.id)
  if(!c) return null
  const ms = DB.matches.filter(m=>m.compId===c.id)

  return (
    <section className="py-14"><div className="max-w- mx-auto px-6">
      <h1 className="font-barlow text- leading-none">{c.name}</h1>
      <div className="text-sm text-[#2A3532] mt-1 mb-5">{c.season} · {c.description}</div>

      <h3 className="font-barlow text-xl mb-3">Standings</h3>
      <StandingsTable rows={standingsFor(c.id)} />

      <h3 className="font-barlow text-xl mt-7 mb-3">Top Scorers</h3>
      <div className="bg-[#12181A] text-[#F5F2E8] p- rounded- max-w-">
        {leagueLeaders('goals',6).map(x=><div key={x.p.id} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0 text-[13.5px]"><span>{x.p.displayName}</span><span className="font-barlow font-extrabold text- text-[#C7A344]">{x.s.goals}</span></div>)}
      </div>

      <h3 className="font-barlow text-xl mt-7 mb-3">Fixtures & Results</h3>
      <div className="grid md:grid-cols-3 gap-">{ms.map(m=><MatchCard key={m.id} m={m} />)}</div>
    </div></section>
  )
}