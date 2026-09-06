import { useData } from '../context/DataContext.jsx'
import { colorFor, initials, fmtDate } from '../utils/helpers.js'
import EmptyState from '../components/EmptyState.jsx'

export default function MatchDetails(){
  const { DB, route, setRoute, go, player, team, teamPlayers } = useData()
  const m = DB.matches.find(x=>x.id===route.id)
  if(!m) return <section className="section"><div className="wrap"><EmptyState big="Match not found." /></div></section>
  const h = team(m.homeTeamId), a = team(m.awayTeamId)
  const comp = DB.competitions.find(c=>c.id===m.compId)
  const dtab = route.dtab || 'summary'
  const evs = [...m.events].sort((x,y)=>x.minute-y.minute)

  const Crest = ({name,size=56}) => <div className="crest" style={{background:colorFor(name||'?'),width:size,height:size,fontSize:size*0.4}}>{initials(name||'?')}</div>

  return (
    <section className="section"><div className="wrap">
      <a href="#" className="section-link" onClick={e=>{e.preventDefault(); go('matches')}}>← Back to Match Center</a>
      <div style={{background:'var(--ink)',color:'#fff',padding:28,margin:'18px 0',borderRadius:2}}>
        <div style={{textAlign:'center',fontSize:12,color:'var(--gold-soft)',marginBottom:14}}>{comp?.name} · {m.season}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:26,flexWrap:'wrap'}}>
          <div style={{textAlign:'center'}}><Crest name={h?.name} /><div style={{marginTop:8,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:18}}>{h?.name}</div></div>
          <div style={{fontFamily:'Barlow Condensed',fontWeight:800,fontSize:44,color:'var(--gold)'}}>{m.status==='Finished'||m.status==='Live'? `${m.homeScore} — ${m.awayScore}` : 'VS'}</div>
          <div style={{textAlign:'center'}}><Crest name={a?.name} /><div style={{marginTop:8,fontFamily:'Barlow Condensed',fontWeight:700,fontSize:18}}>{a?.name}</div></div>
        </div>
        <div style={{textAlign:'center',marginTop:16,fontSize:12.5,color:'var(--bone-dim)'}}>{fmtDate(m.date)} · {m.time} · {m.stadium} · Ref: {m.referee}</div>
      </div>

      <div className="tabs">
        {['summary','lineups','stats'].map(k=>(
          <div key={k} className={`tab ${dtab===k?'active':''}`} onClick={()=>setRoute({...route,dtab:k})} style={{cursor:'pointer'}}>{k[0].toUpperCase()+k.slice(1)}</div>
        ))}
      </div>

      {dtab==='summary' && (
        evs.length? <div className="timeline">{evs.map(ev=>{
          const p = player(ev.scorerId)
          let label = ''
          if(ev.type==='goal') label = `Goal — ${p?.displayName||'?'} ${ev.goalType==='Penalty'?'(Pen)':''} ${ev.assistId? `(assist: ${player(ev.assistId)?.displayName})` : ''}`
          if(ev.type==='yellow') label = `Yellow Card — ${p?.displayName}`
          if(ev.type==='red') label = `Red Card — ${p?.displayName}`
          if(ev.type==='sub') label = `Sub: ${player(ev.playerOnId)?.displayName} on for ${player(ev.playerOffId)?.displayName}`
          return <div key={ev.id} className="tl-item"><span className="tl-min">{ev.minute}'</span> {label}</div>
        })}</div> : <EmptyState big="No match events recorded." />
      )}

      {dtab==='lineups' && (
        <div className="grid cols-2">
          {[[m.lineups.home,h],[m.lineups.away,a]].map(([lu,t])=>(
            <div key={t?.id}>
              {!lu? <EmptyState big="Lineup not entered yet." /> : <>
                <div style={{marginBottom:10,fontWeight:700}}>{t?.name} · {lu.formation}</div>
                <div className="pitch">
                  {['Goalkeeper','Defender','Midfielder','Forward'].map(pos=>{
                    const ps = lu.startingXI.map(id=>player(id)).filter(p=>p && p.position===pos)
                    if(!ps.length) return null
                    return <div key={pos} className="pitch-row">{ps.map(p=><div key={p.id} className="pitch-player"><div className="pitch-dot">{p.jersey}</div>{p.displayName}</div>)}</div>
                  })}
                </div>
              </>}
            </div>
          ))}
        </div>
      )}

      {dtab==='stats' && (
        <div className="panel">
          {[
            ['Possession', `${m.stats.possessionHome}%`, `${m.stats.possessionAway}%`],
            ['Shots', m.stats.shotsHome, m.stats.shotsAway],
            ['On Target', m.stats.shotsOnTargetHome, m.stats.shotsOnTargetAway],
            ['Corners', m.stats.cornersHome, m.stats.cornersAway],
            ['Fouls', m.stats.foulsHome, m.stats.foulsAway],
          ].map(r=>(
            <div key={r[0]} style={{display:'flex',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #efe9d8'}}>
              <div style={{width:70,textAlign:'right',fontFamily:'Barlow Condensed',fontWeight:700}}>{r[1]}</div>
              <div style={{flex:1,textAlign:'center',fontSize:12,color:'var(--ink-soft)'}}>{r[0]}</div>
              <div style={{width:70,fontFamily:'Barlow Condensed',fontWeight:700}}>{r[2]}</div>
            </div>
          ))}
        </div>
      )}
    </div></section>
  )
}