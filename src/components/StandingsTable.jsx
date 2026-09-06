import { colorFor, initials } from "../utils/helpers.js";
import { useData } from "../context/DataContext.jsx";

export function StandingsTable({ rows }){
  const { DB } = useData();
  return (
    <div className="bg-white border border-[#e4dfcd] overflow-x-auto">
      <table className="w-full text-[13.5px]">
        <thead>
          <tr className="bg-[#F0EDE0] text- tracking-[0.5px] text-[#2A3532]">
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Club</th>
            <th className="text-center p-3">P</th>
            <th className="text-center p-3">W</th>
            <th className="text-center p-3">D</th>
            <th className="text-center p-3">L</th>
            <th className="text-center p-3">GF</th>
            <th className="text-center p-3">GA</th>
            <th className="text-center p-3">GD</th>
            <th className="text-center p-3 font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>{
            const t = DB.teams.find(x=>x.id===r.teamId);
            return (
              <tr key={r.teamId} className="border-b border-[#efe9d8] last:border-0 hover:bg-[#FFFEF7]">
                <td className="p-3 font-barlow font-bold">{i+1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text- font-extrabold text-[#12181A]" style={{background:colorFor(t?.name||'')}}>{initials(t?.shortName||'?')}</div>
                    <span className="font-semibold">{t?.name}</span>
                  </div>
                </td>
                <td className="text-center p-3">{r.played}</td>
                <td className="text-center p-3">{r.won}</td>
                <td className="text-center p-3">{r.draw}</td>
                <td className="text-center p-3">{r.lost}</td>
                <td className="text-center p-3">{r.gf}</td>
                <td className="text-center p-3">{r.ga}</td>
                <td className="text-center p-3">{r.gd}</td>
                <td className="text-center p-3 font-barlow font-extrabold text-">{r.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}