import { useNavigate } from 'react-router-dom'
import { colorFor, initials } from '../utils/helpers.js'
import { useData } from '../context/DataContext.jsx'

export default function PlayerCard({ p }){
  const navigate = useNavigate()
  const { DB } = useData()
  const t = DB.teams.find(x=>x.id===p.teamId)

  return (
    <div onClick={()=>navigate(`/players/${p.id}`)} className="bg-white border border-[#e4dfcd] cursor-pointer hover:-translate-y-1 transition-all">
      <div className="h- bg-gradient-to-br from-[#134A38] to-[#0E3B2E] flex items-end justify-center relative">
        <div className="w- h- rounded-full bg-[#C7A344] flex items-center justify-center font-bold text- border- border-[#F5F2E8] mb-[-10px]">{initials(p.displayName)}</div>
        <div className="absolute top-2 right-2 bg-[#12181A] text-[#F5F2E8] text- px-2 py-1 rounded-">#{p.jersey}</div>
      </div>
      <div className="p-3 pt-5">
        <div className="font-bold text- leading-none">{p.displayName}</div>
        <div className="text- text-[#2A3532] mt-1">{p.position} · {t?.shortName}</div>
      </div>
    </div>
  )
}