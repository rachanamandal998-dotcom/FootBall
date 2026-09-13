import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
const EMPTY = { name:"", shortName:"", season:"2025/26", type:"League", description:"", pointsWin:3, pointsDraw:1, pointsLoss:0, teamIds:[], status:"Active" };

export default function Competitions() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.name) return showToast("Name is required.", true);
    try {
      if (editing) { await updateRecord("competitions", editing.id, form); showToast("Competition updated."); }
      else { await createRecord("competitions", form); showToast("Competition added."); }
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Competitions</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, teamIds: DB.teams.map((t) => t.id) }); }}>+ Add</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Season" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["League","Cup","Youth","Local Tournament","Community"].map((t) => <option key={t}>{t}</option>)}</select>
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label>Win points<input type="number" className="border rounded px-3 py-2 w-full" value={form.pointsWin} onChange={(e) => setForm({ ...form, pointsWin: Number(e.target.value) })} /></label>
          <label>Draw points<input type="number" className="border rounded px-3 py-2 w-full" value={form.pointsDraw} onChange={(e) => setForm({ ...form, pointsDraw: Number(e.target.value) })} /></label>
          <label>Loss points<input type="number" className="border rounded px-3 py-2 w-full" value={form.pointsLoss} onChange={(e) => setForm({ ...form, pointsLoss: Number(e.target.value) })} /></label>
          <select multiple className="border rounded px-3 py-2 md:col-span-2 h-32" value={form.teamIds} onChange={(e) => setForm({ ...form, teamIds: [...e.target.selectedOptions].map((o) => o.value) })}>
            {DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {DB.competitions.map((c) => (
          <div key={c.id} className="p-4 flex justify-between">
            <div><b>{c.name}</b><div className="text-sm text-ink/60">{c.type} · {c.season} · Win {c.pointsWin} / Draw {c.pointsDraw}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(c); setForm({ ...EMPTY, ...c }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this competition?")) await deleteRecord("competitions", c.id); }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
