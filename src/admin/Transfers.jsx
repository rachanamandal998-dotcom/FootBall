import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { playerName } from "../utils/helpers.js";
const EMPTY = { playerId:"", previousTeamId:"", newTeamId:"", type:"Permanent", date:"", fee:"", contractExpiry:"" };

export default function Transfers() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.playerId || !form.newTeamId || !form.date) return showToast("Player, new team and date are required.", true);
    try {
      if (editing) await updateRecord("transfers", editing.id, form); else await createRecord("transfers", form);
      showToast("Transfer saved.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Transfers</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, playerId: DB.players[0]?.id || "", previousTeamId: DB.players[0]?.teamId || "", newTeamId: DB.teams[1]?.id || "" }); }}>+ Add</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <select className="border rounded px-3 py-2" value={form.playerId} onChange={(e) => setForm({ ...form, playerId: e.target.value })}>{DB.players.map((p) => <option key={p.id} value={p.id}>{playerName(p)}</option>)}</select>
          <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["Permanent","Loan","Free Transfer","Loan Return"].map((t) => <option key={t}>{t}</option>)}</select>
          <select className="border rounded px-3 py-2" value={form.previousTeamId} onChange={(e) => setForm({ ...form, previousTeamId: e.target.value })}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <select className="border rounded px-3 py-2" value={form.newTeamId} onChange={(e) => setForm({ ...form, newTeamId: e.target.value })}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Fee" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
          <input type="date" className="border rounded px-3 py-2" value={form.contractExpiry} onChange={(e) => setForm({ ...form, contractExpiry: e.target.value })} />
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {(DB.transfers || []).map((t) => (
          <div key={t.id} className="p-4 flex justify-between">
            <div>{playerName(DB.players.find((p) => p.id === t.playerId))} · {t.type}<div className="text-sm text-ink/60">{t.date} · {t.fee}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(t); setForm({ ...EMPTY, ...t }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this transfer?")) await deleteRecord("transfers", t.id); }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
