import { useData } from "../context/DataContext.jsx";
import { colorFor, initials, fmtDate } from "../utils/helpers.js";
import EmptyState from "../components/EmptyState.jsx";

export default function MatchDetails() {
  const { DB, route, setRoute, go, player } = useData();
  const m = DB.matches.find((x) => x.id === route.id);
  if (!m)
    return (
      <section className="py-14">
        <div className="max-w- mx-auto px-6">
          <EmptyState big="Match not found." />
        </div>
      </section>
    );
  const h = DB.teams.find((t) => t.id === m.homeTeamId),
    a = DB.teams.find((t) => t.id === m.awayTeamId);
  const comp = DB.competitions.find((c) => c.id === m.compId);
  const dtab = route.dtab || "summary";
  const evs = [...m.events].sort((x, y) => x.minute - y.minute);

  return (
    <section className="py-14">
      <div className="max-w- mx-auto px-6">
        <button
          onClick={() => go("matches")}
          className="text-[#1E7245] font-semibold text-[13.5px] border-b border-[#1E7245] pb-0.5"
        >
          ← Back to Match Center
        </button>
        <div className="bg-[#12181A] text-white p-7 mt-4 rounded- text-center">
          <div className="text-xs text-[#E4CD8A] mb-3">
            {comp?.name} · {m.season}
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-barlow font-extrabold text-[#12181A]"
                style={{ background: colorFor(h?.name || "") }}
              >
                {initials(h?.shortName || "?")}
              </div>
              <div className="mt-2 font-barlow font-bold text-lg">
                {h?.name}
              </div>
            </div>
            <div className="font-barlow font-extrabold text- text-[#C7A344]">
              {m.status === "Finished" || m.status === "Live"
                ? `${m.homeScore} — ${m.awayScore}`
                : "VS"}
            </div>
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-barlow font-extrabold text-[#12181A]"
                style={{ background: colorFor(a?.name || "") }}
              >
                {initials(a?.shortName || "?")}
              </div>
              <div className="mt-2 font-barlow font-bold text-lg">
                {a?.name}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#E9E4D2]">
            {fmtDate(m.date)} · {m.time} · {m.stadium} · Ref: {m.referee}
          </div>
        </div>

        <div className="flex gap-1 border-b border-[#e4dfcd] mt-6 mb-5 flex-wrap">
          {["summary", "lineups", "stats"].map((k) => (
            <div
              key={k}
              onClick={() => setRoute({ ...route, dtab: k })}
              className={`px-4 py-2.5 text-[13.5px] font-semibold cursor-pointer border-b-2 ${dtab === k ? "text-[#0E3B2E] border-[#C7A344]" : "text-[#2A3532] border-transparent"}`}
            >
              {k[0].toUpperCase() + k.slice(1)}
            </div>
          ))}
        </div>

        {dtab === "summary" &&
          (evs.length ? (
            <div className="relative pl-6 border-l-2 border-[#e4dfcd] ml-1.5 space-y-3">
              {evs.map((ev) => (
                <div key={ev.id} className="relative text-[13.5px]">
                  <span className="absolute -left- top-1.5 w-2.5 h-2.5 rounded-full bg-[#1E7245] border-2 border-white ring-2 ring-[#1E7245]" />
                  <span className="font-barlow font-extrabold text-[#0E3B2E] mr-2">
                    {ev.minute}'
                  </span>
                  {ev.type === "goal"
                    ? `Goal — ${player(ev.scorerId)?.displayName}`
                    : `${ev.type} — ${player(ev.scorerId)?.displayName}`}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState big="No match events recorded." />
          ))}

        {dtab === "lineups" && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              [m.lineups.home, h],
              [m.lineups.away, a],
            ].map(([lu, t]) => (
              <div key={t?.id} className="bg-white border border-[#e4dfcd] p-4">
                {!lu ? (
                  <EmptyState big="Lineup not entered yet." />
                ) : (
                  <>
                    <div className="font-bold mb-2">
                      {t?.name} · {lu.formation}
                    </div>
                    <div className="bg-gradient-to-b from-[#1c8253] to-[#166b45] rounded-md p-4 min-h- bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0_40px,transparent_40px_80px)]">
                      {["Goalkeeper", "Defender", "Midfielder", "Forward"].map(
                        (pos) => {
                          const ps = lu.startingXI
                            .map((id) => player(id))
                            .filter((p) => p && p.position === pos);
                          if (!ps.length) return null;
                          return (
                            <div key={pos} className="flex justify-around my-5">
                              {ps.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex flex-col items-center text-white text- text-center w-"
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#C7A344] text-[#12181A] flex items-center justify-center font-barlow font-extrabold border-2 border-white mb-1">
                                    {p.jersey}
                                  </div>
                                  {p.displayName}
                                </div>
                              ))}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {dtab === "stats" && (
          <div className="bg-white border border-[#e4dfcd] p-4">
            {[
              [
                "Possession",
                `${m.stats.possessionHome}%`,
                `${m.stats.possessionAway}%`,
              ],
              ["Shots", m.stats.shotsHome, m.stats.shotsAway],
              ["Corners", m.stats.cornersHome, m.stats.cornersAway],
              ["Fouls", m.stats.foulsHome, m.stats.foulsAway],
            ].map((r) => (
              <div
                key={r[0]}
                className="flex items-center py-2 border-b border-[#efe9d8] last:border-0"
              >
                <div className="w- text-right font-barlow font-bold">
                  {r[1]}
                </div>
                <div className="flex-1 text-center text-xs text-[#2A3532]">
                  {r[0]}
                </div>
                <div className="w- font-barlow font-bold">{r[2]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
