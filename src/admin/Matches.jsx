import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import Pitch from "../components/Pitch.jsx";
const FORMATIONS = ["4-4-2","4-3-3","4-2-3-1","3-5-2","3-4-3","5-3-2"];
const STATUSES = ["Scheduled","Live","Half Time","Finished","Postponed","Cancelled","Abandoned"];
const emptyStats = { possessionHome:50, possessionAway:50, shotsHome:0, shotsAway:0, shotsOnTargetHome:0, shotsOnTargetAway:0, cornersHome:0, cornersAway:0, foulsHome:0, foulsAway:0, offsidesHome:0, offsidesAway:0, passAccuracyHome:0, passAccuracyAway:0 };

const EMPTY = {
  compId:"", season:"2025/26", homeTeamId:"", awayTeamId:"", date:"", time:"15:00", stadium:"", referee:"", assistantReferee1:"", assistantReferee2:"", varOfficial:"",
  status:"Scheduled", homeScore:0, awayScore:0, events:[], lineups:{ home:{ formation:"4-3-3", startingXI:[], substitutes:[] }, away:{ formation:"4-4-2", startingXI:[], substitutes:[] } }, stats: emptyStats,
};

export default function Matches() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast, teamPlayers } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("info");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (!form.homeTeamId || !form.awayTeamId) return showToast("Select both teams.", true);
    if (form.homeTeamId === form.awayTeamId) return showToast("Home and away teams cannot be the same.", true);
    if (!form.date) return showToast("Match date is required.", true);
    setSaving(true);
    try {
      if (editing) { await updateRecord("matches", editing.id, form); showToast("Match successfully updated."); }
      else { await createRecord("matches", form); showToast("Match created."); }
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); } finally { setSaving(false); }
  };

  const addEvent = (type) => {
    const ev = { id: `e${Date.now()}`, minute: 1, type, teamId: form.homeTeamId, playerId: "", scorerId: "", assistId: "", playerOffId: "", playerOnId: "", goalType: "Open Play", reason: "" };
    setForm({ ...form, events: [...(form.events || []), ev] });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Matches</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, compId: DB.competitions[0]?.id || "", homeTeamId: DB.teams[0]?.id || "", awayTeamId: DB.teams[1]?.id || "" }); setTab("info"); }}>+ Add match</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6">
          <div className="flex gap-2 mb-4">{["info","events","lineups","stats"].map((k) => <button type="button" key={k} onClick={() => setTab(k)} className={`px-3 py-1 text-sm border-b-2 ${tab===k?"border-gold":"border-transparent"}`}>{k}</button>)}</div>
          {tab === "info" && (
            <div className="grid md:grid-cols-2 gap-3">
              <select className="border rounded px-3 py-2" value={form.compId} onChange={set("compId")}>{DB.competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <input className="border rounded px-3 py-2" value={form.season} onChange={set("season")} placeholder="Season" />
              <select className="border rounded px-3 py-2" value={form.homeTeamId} onChange={set("homeTeamId")}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
              <select className="border rounded px-3 py-2" value={form.awayTeamId} onChange={set("awayTeamId")}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
              <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={set("date")} />
              <input type="time" className="border rounded px-3 py-2" value={form.time} onChange={set("time")} />
              <input className="border rounded px-3 py-2" value={form.stadium} onChange={set("stadium")} placeholder="Stadium" />
              <select className="border rounded px-3 py-2" value={form.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <input className="border rounded px-3 py-2" value={form.referee} onChange={set("referee")} placeholder="Referee" />
              <input className="border rounded px-3 py-2" value={form.assistantReferee1} onChange={set("assistantReferee1")} placeholder="Assistant referee 1" />
              <input className="border rounded px-3 py-2" value={form.assistantReferee2} onChange={set("assistantReferee2")} placeholder="Assistant referee 2" />
              <input className="border rounded px-3 py-2" value={form.varOfficial} onChange={set("varOfficial")} placeholder="VAR" />
            </div>
          )}
          {tab === "events" && (
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button type="button" className="border px-3 py-1" onClick={() => addEvent("goal")}>+ Goal</button>
                <button type="button" className="border px-3 py-1" onClick={() => addEvent("yellow")}>+ Yellow</button>
                <button type="button" className="border px-3 py-1" onClick={() => addEvent("red")}>+ Red</button>
                <button type="button" className="border px-3 py-1" onClick={() => addEvent("sub")}>+ Substitution</button>
              </div>
              {(form.events || []).map((ev, i) => (
                <EventRow key={ev.id} ev={ev} form={form} DB={DB} onChange={(next) => setForm({ ...form, events: form.events.map((e, idx) => idx === i ? next : e) })} onRemove={() => setForm({ ...form, events: form.events.filter((_, idx) => idx !== i) })} />
              ))}
            </div>
          )}
          {tab === "lineups" && (
            <div className="grid md:grid-cols-2 gap-6">
              {["home","away"].map((side) => (
                <LineupEditor key={side} side={side} form={form} setForm={setForm} players={teamPlayers(side === "home" ? form.homeTeamId : form.awayTeamId)} label={DB.teams.find((t) => t.id === (side === "home" ? form.homeTeamId : form.awayTeamId))?.name} />
              ))}
            </div>
          )}
          {tab === "stats" && (
            <div className="grid md:grid-cols-2 gap-3">
              {Object.keys(emptyStats).map((k) => (
                <label key={k} className="text-sm">{k}<input type="number" className="border rounded px-3 py-2 w-full" value={form.stats?.[k] ?? 0} onChange={(e) => setForm({ ...form, stats: { ...form.stats, [k]: Number(e.target.value) } })} /></label>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-5"><button disabled={saving} className="bg-pitch text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save match"}</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {DB.matches.map((m) => (
          <div key={m.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <b>{DB.teams.find((t) => t.id === m.homeTeamId)?.shortName} {m.status === "Finished" || m.status === "Live" ? `${m.homeScore}-${m.awayScore}` : "vs"} {DB.teams.find((t) => t.id === m.awayTeamId)?.shortName}</b>
              <div className="text-sm text-ink/60">{m.date} · {m.status} · {m.stadium}</div>
            </div>
            <div className="space-x-2">
              <button className="text-turf font-semibold" onClick={() => { setEditing(m); setForm({ ...EMPTY, ...m, stats: { ...emptyStats, ...(m.stats || {}) }, lineups: { home: { formation:"4-3-3", startingXI:[], substitutes:[], ...(m.lineups?.home||{}) }, away: { formation:"4-4-2", startingXI:[], substitutes:[], ...(m.lineups?.away||{}) } } }); }}>Edit</button>
              <button className="text-[#A6372B] font-semibold" onClick={async () => { if (confirm("Delete this match?")) { await deleteRecord("matches", m.id); showToast("Match deleted."); } }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventRow({ ev, form, DB, onChange, onRemove }) {
  const teamPlayers = DB.players.filter((p) => p.teamId === ev.teamId);
  return (
    <div className="grid md:grid-cols-6 gap-2 mb-2 items-center">
      <input type="number" className="border rounded px-2 py-1" value={ev.minute} onChange={(e) => onChange({ ...ev, minute: Number(e.target.value) })} />
      <select className="border rounded px-2 py-1" value={ev.teamId} onChange={(e) => onChange({ ...ev, teamId: e.target.value })}>
        <option value={form.homeTeamId}>Home</option>
        <option value={form.awayTeamId}>Away</option>
      </select>
      <span className="text-sm font-semibold">{ev.type}</span>
      {ev.type === "goal" && (
        <>
          <select className="border rounded px-2 py-1" value={ev.playerId || ev.scorerId} onChange={(e) => onChange({ ...ev, playerId: e.target.value, scorerId: e.target.value })}>
            <option value="">Scorer</option>
            {teamPlayers.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={ev.assistId || ""} onChange={(e) => onChange({ ...ev, assistId: e.target.value })}>
            <option value="">Assist</option>
            {teamPlayers.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={ev.goalType} onChange={(e) => onChange({ ...ev, goalType: e.target.value })}>
            {["Open Play","Penalty","Free Kick","Own Goal"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </>
      )}
      {(ev.type === "yellow" || ev.type === "red") && (
        <select className="border rounded px-2 py-1 md:col-span-2" value={ev.playerId || ev.scorerId} onChange={(e) => onChange({ ...ev, playerId: e.target.value, scorerId: e.target.value })}>
          <option value="">Player</option>
          {teamPlayers.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
        </select>
      )}
      {ev.type === "sub" && (
        <>
          <select className="border rounded px-2 py-1" value={ev.playerOffId || ""} onChange={(e) => onChange({ ...ev, playerOffId: e.target.value })}>
            <option value="">Off</option>
            {teamPlayers.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={ev.playerOnId || ""} onChange={(e) => onChange({ ...ev, playerOnId: e.target.value })}>
            <option value="">On</option>
            {teamPlayers.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
        </>
      )}
      <button type="button" className="text-[#A6372B] text-sm" onClick={onRemove}>Remove</button>
    </div>
  );
}

function LineupEditor({ side, form, setForm, players, label }) {
  const lu = form.lineups[side];
  const update = (patch) => setForm({ ...form, lineups: { ...form.lineups, [side]: { ...lu, ...patch } } });
  const toggle = (idx, current) => {
    const next = prompt("Player ID from squad, or leave blank to clear", current || "");
    if (next === null) return;
    const xi = [...(lu.startingXI || [])];
    xi[idx] = next;
    update({ startingXI: xi.filter(Boolean) });
  };
  return (
    <div>
      <div className="font-semibold mb-2">{label}</div>
      <select className="border rounded px-2 py-1 mb-3" value={lu.formation} onChange={(e) => update({ formation: e.target.value })}>
        {FORMATIONS.map((f) => <option key={f}>{f}</option>)}
      </select>
      <Pitch interactive formation={lu.formation} players={players} selected={lu.startingXI || []} onSelect={toggle} />
      <div className="mt-3 text-sm">
        <div className="font-semibold">Starting XI</div>
        <select multiple className="w-full border h-32" value={lu.startingXI || []} onChange={(e) => update({ startingXI: [...e.target.selectedOptions].map((o) => o.value) })}>
          {players.map((p) => <option key={p.id} value={p.id}>{p.jersey} {p.displayName}</option>)}
        </select>
        <div className="font-semibold mt-2">Substitutes</div>
        <select multiple className="w-full border h-24" value={lu.substitutes || []} onChange={(e) => update({ substitutes: [...e.target.selectedOptions].map((o) => o.value) })}>
          {players.map((p) => <option key={p.id} value={p.id}>{p.jersey} {p.displayName}</option>)}
        </select>
      </div>
    </div>
  );
}
