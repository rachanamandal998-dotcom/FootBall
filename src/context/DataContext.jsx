import { createContext, useContext, useState, useEffect } from 'react'
import { demoData } from '../data/demoData.js'
import { STORAGE_KEY } from '../utils/helpers.js'

export const DataContext = createContext(null)

export const useData = () => {
  const ctx = useContext(DataContext)
  if(!ctx) throw new Error('useData must be used inside DataContext.Provider')
  return ctx
}

export function DataProvider({ children }){
  const [DB, setDB] = useState(null)
  const [adminAuthed, setAdminAuthed] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [route, setRoute] = useState({ view:'home' }) // for old go() compatibility if you still use it
  const [toast, setToast] = useState(null)

  useEffect(()=>{
    const saved = localStorage.getItem(STORAGE_KEY)
    if(saved){ setDB(JSON.parse(saved)) }
    else { const d=demoData(); setDB(d); localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }
  },[])

  const saveData = (d) => {
    const next = {...d, meta:{...d.meta, lastUpdated: Date.now()} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setDB({...next})
  }

  const showToast = (msg,isErr=false) => {
    setToast({msg,isErr}); setTimeout(()=>setToast(null),2600)
  }

  // --- helpers ---
  const team = (id) => DB?.teams.find(t=>t.id===id)
  const player = (id) => DB?.players.find(p=>p.id===id)
  const teamPlayers = (id) => DB?.players.filter(p=>p.teamId===id) || []

  const standingsFor = (compId) => {
    if(!DB) return []
    const comp = DB.competitions.find(c=>c.id===compId)
    if(!comp) return []
    const rows={}; comp.teamIds.forEach(tid=>{rows[tid]={teamId:tid,played:0,won:0,draw:0,lost:0,gf:0,ga:0,pts:0}})
    DB.matches.filter(m=>m.compId===compId && m.status==='Finished').forEach(m=>{
      const h=rows[m.homeTeamId], a=rows[m.awayTeamId]; if(!h||!a) return
      h.played++; a.played++; h.gf+=m.homeScore; h.ga+=m.awayScore; a.gf+=m.awayScore; a.ga+=m.homeScore
      if(m.homeScore>m.awayScore){h.won++; a.lost++; h.pts+=comp.pointsWin}
      else if(m.homeScore<m.awayScore){a.won++; h.lost++; a.pts+=comp.pointsWin}
      else {h.draw++; a.draw++; h.pts+=comp.pointsDraw; a.pts+=comp.pointsDraw}
    })
    return Object.values(rows).map(r=>({...r,gd:r.gf-r.ga})).sort((x,y)=> y.pts-x.pts || y.gd-x.gd || y.gf-x.gf)
  }

  const playerStats = (pid) => {
    const s={apps:0,goals:0,assists:0,yellow:0,red:0,cleanSheets:0,minutes:0}
    if(!DB) return s
    DB.matches.forEach(m=>{
      if(m.status!=='Finished') return
      m.events.forEach(ev=>{
        if(ev.type==='goal' && ev.scorerId===pid) s.goals++
        if(ev.assistId===pid) s.assists++
        if(ev.type==='yellow' && ev.scorerId===pid) s.yellow++
        if(ev.type==='red' && ev.scorerId===pid) s.red++
      })
      const p = DB.players.find(x=>x.id===pid)
      if(p && (m.homeTeamId===p.teamId || m.awayTeamId===p.teamId)){ s.apps++; s.minutes+=90 }
    })
    return s
  }

  const leagueLeaders = (key,n=5) => {
    if(!DB) return []
    return DB.players.map(p=>({p,s:playerStats(p.id)})).sort((a,b)=>b.s[key]-a.s[key]).filter(x=>x.s[key]>0).slice(0,n)
  }

  const go = (view, params={}) => { setRoute({view,...params}); window.scrollTo(0,0); setNavOpen(false) }

  if(!DB) return <div className="p-20 text-center font-barlow text-lg">Loading Sindhuli Football Clubhouse...</div>

  return (
    <DataContext.Provider value={{ DB, saveData, team, player, teamPlayers, standingsFor, playerStats, leagueLeaders, adminAuthed, setAdminAuthed, route, setRoute, go, navOpen, setNavOpen, showToast, toast }}>
      {children}
      {toast && <div className={`fixed bottom-5 right-5 bg-[#12181A] text-[#F5F2E8] px-4 py-3 rounded- text-sm z-[300] border-l- ${toast.isErr?'border-l-[#A6372B]':'border-l-[#1E7245]'} shadow-xl`}>{toast.msg}</div>}
    </DataContext.Provider>
  )
}