import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Players(){
  const { DB, go } = useData()
  const [q,setQ] = useState('')
  const [pos,setPos] = useState('')
  const [team,setTeam] = useState('')
  let list = DB.players.filter(p=>p.displayName.toLowerCase().includes(q.toLowerCase()))
  if(pos) list = list.filter(p=>p.position===pos)
  if(team) list = list.filter(p=>p.teamId===team)
  return (
    <section className="section"><div className="wrap">
      <div className="section-head"><div><h2>Player Directory</h2><div className="sub">{list.length} players across Sindhuli district clubs</div></div></div>
      <div className="field-row" style={{marginBottom:20}}>
        <input className="text-input" placeholder="Search by name..." value={q} onChange={e=>setQ(e.target.value)} />
        <div style={{display:'flex',gap:10}}>
          <select className="text-input" value={pos} onChange={e=>setPos(e.target.value)}><option value="">All Positions</option>{['Goalkeeper','Defender','Midfielder','Forward'].map(p=><option key={p}>{p}</option>)}</select>
          <select className="text-input" value={team} onChange={e=>setTeam(e.target.value)}><option value="">All Teams</option>{DB.teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
        </div>
      </div>
      {list.length? <div className="grid cols-4">{list.map(p=><PlayerCard key={p.id} p={p} onNavigate={go} />)}</div> : <EmptyState big="No players found." />}
    </div></section>
  )
}