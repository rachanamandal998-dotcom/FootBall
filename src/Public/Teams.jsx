import { useData } from '../context/DataContext.jsx'
import { colorFor, initials } from '../utils/helpers.js'

export default function Teams(){
  const { DB, go, teamPlayers } = useData()
  const getStats = (tid) => {
    let s={played:0,won:0}
    DB.matches.filter(m=>m.status==='Finished'&&(m.homeTeamId===tid||m.awayTeamId===tid)).forEach(m=>{
      const gf=m.homeTeamId===tid?m.homeScore:m.awayScore, ga=m.homeTeamId===tid?m.awayScore:m.homeScore
      s.played++; if(gf>ga) s.won++
    }); return s
  }
  return (
    <section className="section"><div className="wrap">
      <div className="section-head"><div><h2>Teams</h2><div className="sub">Clubs competing across Sindhuli district football</div></div></div>
      <div className="grid cols-3">{DB.teams.map(t=>{
        const s=getStats(t.id)
        return (
          <div key={t.id} className="player-card" onClick={()=>go('team',{id:t.id})} style={{cursor:'pointer'}}>
            <div className="player-photo" style={{height:90}}><div className="crest" style={{background:colorFor(t.name),width:54,height:54,fontSize:20}}>{initials(t.shortName)}</div></div>
            <div className="player-info"><div className="pname">{t.name}</div><div className="pmeta">{t.location} · {teamPlayers(t.id).length} players · {s.played}P {s.won}W</div></div>
          </div>
        )
      })}</div>
    </div></section>
  )
}