import { useData } from '../context/DataContext.jsx'
import MatchCard from '../components/MatchCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Matches(){
  const { DB, route, setRoute, go } = useData()
  const tab = route.tab || 'upcoming'
  const groups = {
    upcoming: DB.matches.filter(m=>m.status==='Scheduled').sort((a,b)=>a.date.localeCompare(b.date)),
    live: DB.matches.filter(m=>m.status==='Live'),
    finished: DB.matches.filter(m=>m.status==='Finished').sort((a,b)=>b.date.localeCompare(a.date)),
  }
  return (
    <section className="section"><div className="wrap">
      <div className="section-head"><div><h2>Match Center</h2><div className="sub">All fixtures and results across Sindhuli district football</div></div></div>
      <div className="filter-bar">
        {['upcoming','live','finished'].map(k=>(
          <button key={k} className={`chip ${tab===k?'active':''}`} onClick={()=>setRoute({...route, tab:k})}>
            {k[0].toUpperCase()+k.slice(1)} ({groups[k].length})
          </button>
        ))}
      </div>
      {groups[tab].length? <div className="grid cols-3">{groups[tab].map(m=><MatchCard key={m.id} m={m} onNavigate={go} />)}</div> : <EmptyState big={`No ${tab} matches.`} small="" />}
    </div></section>
  )
}