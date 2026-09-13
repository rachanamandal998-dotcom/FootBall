import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
const inputClass = "w-full border rounded-lg px-3 py-2";
const EMPTY = { name: "", shortName: "", location: "", stadium: "", coach: "", founded: "", contactEmail: "", contactPhone: "", status: "Active", logo: "" };

export default function AdminTeams() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.shortName) return showToast("Team name and short name are required.", true);
    setSaving(true);
    try {
      const record = { ...form, founded: form.founded ? Number(form.founded) : undefined };
      if (editing) { await updateRecord("teams", editing.id, record); showToast("Team updated."); }
      else { await createRecord("teams", record); showToast("Team added."); }
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); } finally { setSaving(false); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">Teams</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm(EMPTY); }}>+ Add team</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          {[["name","Team name"],["shortName","Short name"],["location","Location"],["stadium","Stadium"],["coach","Coach"],["founded","Founded year"],["contactEmail","Contact email"],["contactPhone","Contact phone"]].map(([k,l]) => (
            <label key={k} className="text-sm font-semibold">{l}<input className={`${inputClass} mt-1`} value={form[k] || ""} onChange={set(k)} /></label>
          ))}
          <label className="text-sm font-semibold">Status<select className={`${inputClass} mt-1`} value={form.status} onChange={set("status")}><option>Active</option><option>Inactive</option></select></label>
          <div className="md:col-span-2 flex gap-2"><button disabled={saving} className="bg-pitch text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save"}</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {DB.teams.map((t) => (
          <div key={t.id} className="p-4 flex justify-between gap-3">
            <div><b>{t.name}</b> <span className="text-ink/50">({t.shortName})</span><div className="text-sm text-ink/60">{t.location} · {t.stadium}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(t); setForm({ ...EMPTY, ...t }); }}>Edit</button><button className="text-[#A6372B] font-semibold" onClick={async () => { if (confirm("Delete this team?")) { await deleteRecord("teams", t.id); showToast("Team deleted."); } }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
