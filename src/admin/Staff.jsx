import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
const ROLES = ["Manager","Coach","Assistant Coach","Goalkeeping Coach","Fitness Coach","Medical Staff","Physiotherapist","Team Administrator"];
const EMPTY = { name:"", role:"Coach", nationality:"Nepal", email:"", phone:"", teamId:"", joinDate:"" };

export default function Staff() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.name) return showToast("Name is required.", true);
    try {
      if (editing) await updateRecord("staff", editing.id, form); else await createRecord("staff", form);
      showToast(editing ? "Staff updated." : "Staff added.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Staff</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, teamId: DB.teams[0]?.id || "" }); }}>+ Add</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
          <input className="border rounded px-3 py-2" placeholder="Nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <input type="date" className="border rounded px-3 py-2" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          <div className="md:col-span-2 flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {(DB.staff || []).map((s) => (
          <div key={s.id} className="p-4 flex justify-between">
            <div><b>{s.name}</b><div className="text-sm text-ink/60">{s.role} · {s.email}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(s); setForm({ ...EMPTY, ...s }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this staff profile?")) await deleteRecord("staff", s.id); }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
