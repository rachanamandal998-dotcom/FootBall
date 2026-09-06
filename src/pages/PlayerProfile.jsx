import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { fmtDate, ageFromDOB, initials } from "../utils/helpers.js";
import MatchCard from "../components/MatchCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { DB, team, player, playerStats } = useData();
  const [tab, setTab] = useState("overview");

  const p = player(id);
  if (!p) return <div className="max-w- mx-auto px-6 py-20">Player not found <button onClick={()=>navigate('/players')} className="text-[#C7A344] underline ml-2">Back</button></div>;

  const t = team(p.teamId);
  const s = playerStats(p.id);
  const pMatches = DB.matches.filter(
    (m) =>
      m.status === "Finished" &&
      (m.homeTeamId === p.teamId || m.awayTeamId === p.teamId),
  );
  const pInjuries = DB.injuries.filter((i) => i.playerId === p.id);

  return (
    <>
      <section className="bg-gradient-to-br from-[#0E3B2E] to-[#0A2A20] text-[#F5F2E8] py-10">
        <div className="max-w- mx-auto px-6 flex gap-6 items-center">
          <div className="w- h- rounded-full bg-[#C7A344] text-[#12181A] flex items-center justify-center font-barlow font-extrabold text- border-4 border-white/20 shrink-0">
            {initials(p.displayName)}
          </div>
          <div>
            <div className="text-[#E4CD8A] text-sm font-semibold">
              #{p.jersey} · {p.position}
            </div>
            <h1 className="font-barlow text- leading-none mt-1">{p.displayName}</h1>
            <div className="mt-2 text-[#E9E4D2] text-sm">
              {t?.name} · {p.nationality} · Age {ageFromDOB(p.dob)}
            </div>
            <button onClick={()=>navigate('/players')} className="mt-3 text- border border-white/20 px-3 py-1 rounded- hover:border-[#E4CD8A]">← Back to Players</button>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="max-w- mx-auto px-6">
          <div className="flex gap-1 border-b border-[#e4dfcd] mb-5 flex-wrap">
            {["overview", "statistics", "matches", "injuries"].map((k) => (
              <div
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-2.5 text-[13.5px] font-semibold cursor-pointer border-b-2 ${tab === k? "text-[#0E3B2E] border-[#C7A344]" : "text-[#2A3532] border-transparent"}`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </div>
            ))}
          </div>
          {tab === "overview" && (
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["Full Name", p.firstName + " " + p.lastName],
                ["DOB", fmtDate(p.dob)],
                ["Nationality", p.nationality],
                ["Height", p.height + " cm"],
                ["Weight", p.weight + " kg"],
                ["Position", p.position],
                ["Team", t?.name || "—"],
                ["Status", p.status],
                ["Contract", fmtDate(p.contractEnd)],
              ].map(([l, v]) => (
                <div key={l} className="bg-white border border-[#e4dfcd] p-3">
                  <div className="text- text-[#9a9482]">{l.toUpperCase()}</div>
                  <div className="font-barlow font-bold text- mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "statistics" && (
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(s).map(([k, v]) => (
                <div key={k} className="bg-white border border-[#e4dfcd] p-3">
                  <div className="text- text-[#9a9482]">{k.toUpperCase()}</div>
                  <div className="font-barlow font-bold text- mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "matches" &&
            (pMatches.length? (
              <div className="grid md:grid-cols-3 gap-4">
                {pMatches.map((m) => (
                  <MatchCard key={m.id} m={m} />
                ))}
              </div>
            ) : (
              <EmptyState big="No matches recorded." />
            ))}
          {tab === "injuries" &&
            (pInjuries.length? (
              <div className="overflow-x-auto bg-white border border-[#e4dfcd]">
                <table className="w-full text-">
                  <thead>
                    <tr className="bg-[#F0EDE0] text- text-[#2A3532]">
                      <th className="text-left p-2 px-3">Type</th>
                      <th className="text-left p-2 px-3">Date</th>
                      <th className="text-left p-2 px-3">Return</th>
                      <th className="text-left p-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pInjuries.map((i) => (
                      <tr key={i.id} className="border-b border-[#efe9d8]">
                        <td className="p-2 px-3">{i.type}</td>
                        <td className="p-2 px-3">{fmtDate(i.date)}</td>
                        <td className="p-2 px-3">
                          {fmtDate(i.expectedReturn)}
                        </td>
                        <td className="p-2 px-3">{i.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState big="No injury records." />
            ))}
        </div>
      </section>
    </>
  );
}