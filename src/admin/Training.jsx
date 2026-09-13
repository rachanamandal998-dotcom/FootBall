import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
const TYPES = ["Fitness","Tactical","Technical","Recovery","Match Preparation"];
const EMPTY = { date:"", time:"07:00", type:"Technical", duration:90, coach:"", teamId:"", notes:"", attendance:[] };

export default function Training() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast, teamPlayers } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.date) return showToast("Date is required.", true);
    try {
      if (editing) await updateRecord("training", editing.id, form); else await createRecord("training", form);
      showToast(editing ? "Training updated." : "Training session created.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  const squad = form ? teamPlayers(form.teamId) : [];
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Training</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, teamId: DB.teams[0]?.id || "" }); }}>+ Add session</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input type="time" className="border rounded px-3 py-2" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <input type="number" className="border rounded px-3 py-2" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} placeholder="Duration (min)" />
          <input className="border rounded px-3 py-2" value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="Coach" />
          <select className="border rounded px-3 py-2" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value, attendance: [] })}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <textarea className="border rounded px-3 py-2 md:col-span-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
          <div className="md:col-span-2">
            <div className="font-semibold mb-2">Attendance</div>
            {squad.map((p) => {
              const row = (form.attendance || []).find((a) => a.playerId === p.id) || { playerId: p.id, status: "Present" };
              return (
                <div key={p.id} className="flex justify-between py-1 text-sm">
                  <span>{p.displayName}</span>
                  <select value={row.status} onChange={(e) => {
                    const rest = (form.attendance || []).filter((a) => a.playerId !== p.id);
                    setForm({ ...form, attendance: [...rest, { playerId: p.id, status: e.target.value }] });
                  }}>
                    <option>Present</option><option>Absent</option><option>Excused</option>
                  </select>
                </div>
              );
            })}
          </div>
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {(DB.training || []).map((t) => (
          <div key={t.id} className="p-4 flex justify-between">
            <div><b>{t.type}</b> · {t.date} {t.time}<div className="text-sm text-ink/60">{t.coach} · {t.duration} min</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(t); setForm({ ...EMPTY, ...t }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this session?")) await deleteRecord("training", t.id); }}>Delete</button></div>
          </div>
        ))}
        {!DB.training?.length && <div className="p-6 text-ink/50">No training sessions.</div>}
      </div>
    </div>
  );
}
