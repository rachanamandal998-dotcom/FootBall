import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Pitch from "../components/Pitch.jsx";
import { EVENT_ICON, EVENT_LABEL, colorFor, fmtDate, initials, minuteLabel, playerName } from "../utils/helpers.js";

export default function MatchDetails() {
  const { id } = useParams();
  const { DB, player, teamPlayers } = useData();
  const m = DB.matches.find((x) => x.id === id);
  const [tab, setTab] = useState("timeline");
  if (!m) return <section className="py-14"><div className="max-w-4xl mx-auto px-6"><EmptyState big="Match not found." /></div></section>;

  const h = DB.teams.find((t) => t.id === m.homeTeamId);
  const a = DB.teams.find((t) => t.id === m.awayTeamId);
  const comp = DB.competitions.find((c) => c.id === m.compId);
  const events = [...(m.events || [])].sort((x, y) => x.minute - y.minute || (x.extra || 0) - (y.extra || 0));
  const stats = m.stats || {};

  return (
    <section className="pb-16">
      <div className="bg-charcoal text-ivory py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs text-gold-soft tracking-wide">{comp?.name} · {m.season}</div>
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            <Club team={h} />
            <div>
              <div className="font-display text-5xl font-extrabold text-gold">{["Finished", "Live", "Half Time"].includes(m.status) ? `${m.homeScore} — ${m.awayScore}` : "VS"}</div>
              <div className="text-xs mt-2 text-white/60">{m.status}</div>
            </div>
            <Club team={a} />
          </div>
          <div className="mt-4 text-sm text-white/70">{fmtDate(m.date)} · {m.time} · {m.stadium}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 gap-3 bg-white border border-[#e4dfcd] p-4 -mt-6 relative z-10">
          <Info k="Referee" v={m.referee} />
          <Info k="AR 1" v={m.assistantReferee1} />
          <Info k="AR 2" v={m.assistantReferee2} />
          <Info k="VAR" v={m.varOfficial || "—"} />
        </div>

        <div className="flex gap-2 mt-8 border-b border-[#e4dfcd]">
          {["timeline", "lineups", "stats"].map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-semibold border-b-2 ${tab === k ? "border-gold text-pitch" : "border-transparent text-ink/50"}`}>{k}</button>
          ))}
        </div>

        {tab === "timeline" && (
          <div className="mt-6 space-y-3">
            {!events.length && <EmptyState big="No match events yet." />}
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 bg-white border border-[#e4dfcd] px-4 py-3">
                <div className="font-display text-xl w-16 text-gold">{minuteLabel(ev)}</div>
                <div className="text-2xl">{EVENT_ICON[ev.type]}</div>
                <div>
                  <div className="font-semibold">{EVENT_LABEL[ev.type]} {ev.goalType ? `· ${ev.goalType}` : ""}</div>
                  <div className="text-sm text-ink/70">
                    {playerName(player(ev.playerId || ev.scorerId)) || "Event"}
                    {ev.assistId ? ` · Assist: ${playerName(player(ev.assistId))}` : ""}
                    {ev.type === "sub" ? `${playerName(player(ev.playerOffId))} → ${playerName(player(ev.playerOnId))}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "lineups" && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-2xl mb-3">{h?.name} · {m.lineups?.home?.formation}</h3>
              <Pitch formation={m.lineups?.home?.formation} players={teamPlayers(m.homeTeamId)} selected={m.lineups?.home?.startingXI || []} />
              <Bench ids={m.lineups?.home?.substitutes || []} lookup={player} />
            </div>
            <div>
              <h3 className="font-display text-2xl mb-3">{a?.name} · {m.lineups?.away?.formation}</h3>
              <Pitch formation={m.lineups?.away?.formation} players={teamPlayers(m.awayTeamId)} selected={m.lineups?.away?.startingXI || []} />
              <Bench ids={m.lineups?.away?.substitutes || []} lookup={player} />
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className="mt-6 space-y-3 bg-white border border-[#e4dfcd] p-5">
            <Bar label="Possession" home={stats.possessionHome} away={stats.possessionAway} suffix="%" />
            <Bar label="Shots" home={stats.shotsHome} away={stats.shotsAway} />
            <Bar label="On target" home={stats.shotsOnTargetHome} away={stats.shotsOnTargetAway} />
            <Bar label="Corners" home={stats.cornersHome} away={stats.cornersAway} />
            <Bar label="Fouls" home={stats.foulsHome} away={stats.foulsAway} />
            <Bar label="Offsides" home={stats.offsidesHome} away={stats.offsidesAway} />
            <Bar label="Pass accuracy" home={stats.passAccuracyHome} away={stats.passAccuracyAway} suffix="%" />
          </div>
        )}
      </div>
    </section>
  );
}

function Club({ team }) {
  return (
    <Link to={team ? `/teams/${team.id}` : "/teams"} className="w-32">
      <div className="w-16 h-16 rounded-full mx-auto grid place-items-center font-display font-extrabold text-xl text-charcoal" style={{ background: colorFor(team?.name || "") }}>
        {initials(team?.shortName || "?")}
      </div>
      <div className="mt-2 font-display font-bold">{team?.name}</div>
    </Link>
  );
}

function Info({ k, v }) {
  return <div className="text-sm"><span className="text-ink/50">{k}: </span><span className="font-semibold">{v || "—"}</span></div>;
}

function Bench({ ids, lookup }) {
  if (!ids.length) return <p className="text-xs text-ink/50 mt-3">No substitutes listed.</p>;
  return (
    <div className="mt-3 text-sm">
      <div className="font-semibold mb-1">Substitutes</div>
      {ids.map((id) => <div key={id}>{playerName(lookup(id))}</div>)}
    </div>
  );
}

function Bar({ label, home = 0, away = 0, suffix = "" }) {
  const total = Number(home) + Number(away) || 1;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span>{home}{suffix}</span><span className="text-ink/60">{label}</span><span>{away}{suffix}</span></div>
      <div className="h-2 bg-ivory flex overflow-hidden">
        <div className="bg-pitch" style={{ width: `${(Number(home) / total) * 100}%` }} />
        <div className="bg-gold" style={{ width: `${(Number(away) / total) * 100}%` }} />
      </div>
    </div>
  );
}
