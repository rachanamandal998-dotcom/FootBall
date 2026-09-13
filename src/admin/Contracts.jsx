import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { playerName } from "../utils/helpers.js";
const EMPTY = { playerId:"", teamId:"", start:"", end:"", status:"Active", notes:"" };

export default function Contracts() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const soon = new Date(); soon.setDate(soon.getDate() + 45);
  const expiring = DB.players.filter((p) => p.contractEnd && new Date(p.contractEnd) <= soon && new Date(p.contractEnd) >= new Date());
  const save = async (e) => {
    e.preventDefault();
    if (!form.playerId || !form.start || !form.end) return showToast("Player and contract dates are required.", true);
    if (form.start > form.end) return showToast("Contract end must be after the start date.", true);
    try {
      if (editing) await updateRecord("contracts", editing.id, form); else await createRecord("contracts", form);
      showToast("Contract saved.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Contracts</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, playerId: DB.players[0]?.id || "", teamId: DB.players[0]?.teamId || "" }); }}>+ Add</button></div>
      {expiring.length > 0 && <div className="bg-gold/20 border border-gold p-4 mb-4 rounded">{expiring.length} contract{expiring.length>1?"s":""} expiring soon.</div>}
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <select className="border rounded px-3 py-2" value={form.playerId} onChange={(e) => setForm({ ...form, playerId: e.target.value })}>{DB.players.map((p) => <option key={p.id} value={p.id}>{playerName(p)}</option>)}</select>
          <select className="border rounded px-3 py-2" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <input type="date" className="border rounded px-3 py-2" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          <input type="date" className="border rounded px-3 py-2" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Active","Expiring","Expired","Terminated"].map((s) => <option key={s}>{s}</option>)}</select>
          <input className="border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {(DB.contracts || []).map((c) => (
          <div key={c.id} className="p-4 flex justify-between">
            <div>{playerName(DB.players.find((p) => p.id === c.playerId))} · {c.status}<div className="text-sm text-ink/60">{c.start} → {c.end}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(c); setForm({ ...EMPTY, ...c }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this contract?")) await deleteRecord("contracts", c.id); }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
