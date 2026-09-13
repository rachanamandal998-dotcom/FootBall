import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { playerName } from "../utils/helpers.js";
const EMPTY = { playerId:"", type:"", date:"", expectedReturn:"", status:"Injured", medicalNotes:"" };

export default function Injuries() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.playerId || !form.type) return showToast("Player and injury type are required.", true);
    try {
      if (editing) await updateRecord("injuries", editing.id, form); else await createRecord("injuries", form);
      showToast(editing ? "Injury updated." : "Injury recorded.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Injuries</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, playerId: DB.players[0]?.id || "" }); }}>+ Add</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <select className="border rounded px-3 py-2" value={form.playerId} onChange={(e) => setForm({ ...form, playerId: e.target.value })}>{DB.players.map((p) => <option key={p.id} value={p.id}>{playerName(p)}</option>)}</select>
          <input className="border rounded px-3 py-2" placeholder="Injury type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input type="date" className="border rounded px-3 py-2" value={form.expectedReturn} onChange={(e) => setForm({ ...form, expectedReturn: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Injured","Recovering","Fit","Returned"].map((s) => <option key={s}>{s}</option>)}</select>
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Private medical notes (managers and medical staff only)" value={form.medicalNotes} onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })} />
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {(DB.injuries || []).map((i) => (
          <div key={i.id} className="p-4">
            <div className="flex justify-between">
              <b>{playerName(DB.players.find((p) => p.id === i.playerId))} · {i.type}</b>
              <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(i); setForm({ ...EMPTY, ...i }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this injury record?")) await deleteRecord("injuries", i.id); }}>Delete</button></div>
            </div>
            <div className="text-sm text-ink/60">{i.status} · {i.date} → {i.expectedReturn}</div>
            {i.medicalNotes && <div className="text-xs mt-2 bg-ivory p-2">Medical notes: {i.medicalNotes}</div>}
          </div>
        ))}
        {!DB.injuries?.length && <div className="p-6 text-ink/50">No injury records.</div>}
      </div>
    </div>
  );
}
