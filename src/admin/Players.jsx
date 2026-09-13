import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { Field, FormShell, PageHeader, ImageField, inputClass } from "./FormUI.jsx";
import { playerName } from "../utils/helpers.js";

const EMPTY = {
  firstName: "", lastName: "", displayName: "", dob: "", nationality: "Nepal", countryOfBirth: "Nepal",
  height: "", weight: "", preferredFoot: "Right", position: "Midfielder", secondaryPosition: "",
  jersey: "", teamId: "", squad: "First Team", status: "Active", dateJoined: "", contractStart: "", contractEnd: "", photo: "",
};

export default function Players() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const rows = DB.players.filter((p) => playerName(p).toLowerCase().includes(q.toLowerCase()));

  const save = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return showToast("Full name is required.", true);
    if (!form.teamId) return showToast("Player must belong to a team.", true);
    if (form.dob && new Date(form.dob) > new Date()) return showToast("Date of birth cannot be in the future.", true);
    setSaving(true);
    try {
      const record = { ...form, jersey: form.jersey === "" ? undefined : Number(form.jersey), height: form.height === "" ? undefined : Number(form.height), weight: form.weight === "" ? undefined : Number(form.weight) };
      if (editing) {
        await updateRecord("players", editing.id, record);
        showToast("Player successfully updated.");
      } else {
        await createRecord("players", record);
        showToast("Player successfully added.");
      }
      setForm(null);
      setEditing(null);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Players" count={DB.players.length} onAdd={() => { setEditing(null); setForm({ ...EMPTY, teamId: DB.teams[0]?.id || "" }); }} addLabel="+ Add Player" />
      {form && (
        <FormShell title={editing ? "Edit player" : "Add player"} onSubmit={save} onCancel={() => setForm(null)} saving={saving}>
          <ImageField label="Photo" value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} />
          <Field label="First name *"><input className={inputClass} value={form.firstName} onChange={set("firstName")} required /></Field>
          <Field label="Last name"><input className={inputClass} value={form.lastName} onChange={set("lastName")} /></Field>
          <Field label="Display name"><input className={inputClass} value={form.displayName} onChange={set("displayName")} /></Field>
          <Field label="Date of birth"><input type="date" className={inputClass} value={form.dob} onChange={set("dob")} /></Field>
          <Field label="Nationality"><input className={inputClass} value={form.nationality} onChange={set("nationality")} /></Field>
          <Field label="Country of birth"><input className={inputClass} value={form.countryOfBirth} onChange={set("countryOfBirth")} /></Field>
          <Field label="Height (cm)"><input type="number" className={inputClass} value={form.height} onChange={set("height")} /></Field>
          <Field label="Weight (kg)"><input type="number" className={inputClass} value={form.weight} onChange={set("weight")} /></Field>
          <Field label="Preferred foot"><select className={inputClass} value={form.preferredFoot} onChange={set("preferredFoot")}><option>Right</option><option>Left</option><option>Both</option></select></Field>
          <Field label="Position"><select className={inputClass} value={form.position} onChange={set("position")}><option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option></select></Field>
          <Field label="Secondary position"><input className={inputClass} value={form.secondaryPosition} onChange={set("secondaryPosition")} /></Field>
          <Field label="Jersey"><input type="number" min="1" max="99" className={inputClass} value={form.jersey} onChange={set("jersey")} /></Field>
          <Field label="Team"><select className={inputClass} value={form.teamId} onChange={set("teamId")}>{DB.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
          <Field label="Squad"><input className={inputClass} value={form.squad} onChange={set("squad")} /></Field>
          <Field label="Status"><select className={inputClass} value={form.status} onChange={set("status")}>{["Active","Injured","Suspended","Unavailable","On Loan","Retired"].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Date joined"><input type="date" className={inputClass} value={form.dateJoined} onChange={set("dateJoined")} /></Field>
          <Field label="Contract start"><input type="date" className={inputClass} value={form.contractStart} onChange={set("contractStart")} /></Field>
          <Field label="Contract expiry"><input type="date" className={inputClass} value={form.contractEnd} onChange={set("contractEnd")} /></Field>
        </FormShell>
      )}
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players" className="border rounded px-3 py-2 mb-4 w-full max-w-sm" />
      <div className="overflow-x-auto bg-white border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-pitch text-ivory"><tr>{["Name","#","Pos","Team","Status",""].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2 font-semibold">{playerName(p)}</td>
                <td className="px-3 py-2">{p.jersey}</td>
                <td className="px-3 py-2">{p.position}</td>
                <td className="px-3 py-2">{DB.teams.find((t) => t.id === p.teamId)?.shortName}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button className="text-turf font-semibold" onClick={() => { setEditing(p); setForm({ ...EMPTY, ...p }); }}>Edit</button>
                  <button className="text-[#A6372B] font-semibold" onClick={async () => { if (confirm("Are you sure you want to delete this player?")) { await deleteRecord("players", p.id); showToast("Player deleted."); } }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
