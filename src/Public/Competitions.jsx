import { useData } from '../context/DataContext.jsx'
export default function Competitions(){
  const { DB, go } = useData()
  return (
    <section className="section"><div className="wrap">
      <div className="section-head"><div><h2>Competitions</h2><div className="sub">Leagues, cups and community tournaments</div></div></div>
      <div className="grid cols-2">{DB.competitions.map(c=>(
        <div key={c.id} className="panel" onClick={()=>go('competition',{id:c.id})} style={{cursor:'pointer'}}>
          <h3>{c.name}</h3><div style={{color:'var(--ink-soft)',fontSize:13,marginBottom:10}}>{c.season} · {c.teamIds.length} teams</div>
          <div style={{fontSize:13.5}}>{c.description}</div>
        </div>
      ))}</div>
      <div className="trophy-row" style={{marginTop:34}}>
        {DB.competitions.map(c=><div key={c.id} className="trophy"><div className="cup">🏆</div><div className="tname">{c.name}</div><div className="tyear">{c.season}</div></div>)}
      </div>
    </div></section>
  )
}