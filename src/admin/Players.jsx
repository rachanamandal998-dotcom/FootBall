import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { nextId } from "../utils/helpers.js";
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass, SearchSelect } from "./FormUI.jsx";

const EMPTY = {
  id: "",
  firstName: "",
  lastName: "",
  displayName: "",
  dob: "",
  nationality: "Nepal",
  height: "",
  weight: "",
  position: "Midfielder",
  jersey: "",
  teamId: "",
  status: "Fit",
  contractEnd: "",
};

export default function Players() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const teamOptions = (DB.teams || []).map((t) => ({ value: t.id, label: t.name }));

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, id: nextId("p"), teamId: DB.teams[0]?.id || "" });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      id: p.id || "",
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      displayName: p.displayName || "",
      dob: p.dob || "",
      nationality: p.nationality || "",
      height: p.height ?? "",
      weight: p.weight ?? "",
      position: p.position || "Midfielder",
      jersey: p.jersey ?? "",
      teamId: p.teamId || "",
      status: p.status || "Fit",
      contractEnd: p.contractEnd || "",
    });
    setShowForm(true);
  };

  const reset = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return showToast("First name is required", true);

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const record = {
      ...form,
      displayName: form.displayName.trim() || fullName,
      name: fullName,
      height: form.height === "" ? "" : Number(form.height),
      weight: form.weight === "" ? "" : Number(form.weight),
      jersey: form.jersey === "" ? "" : Number(form.jersey),
    };

    setSaving(true);
    try {
      if (editing) {
        await updateRecord("players", editing.id, record);
        showToast("Player updated");
      } else {
        await createRecord("players", record);
        showToast("Player created");
      }
      reset();
    } catch (err) {
      showToast(err.message || "Save failed", true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Players" count={DB.players.length} onAdd={openAdd} addLabel="+ Add Player" />

      {showForm && (
        <FormShell
          title={editing ? `Edit Player — ${editing.id}` : "Add Player"}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="First Name *">
            <input value={form.firstName} onChange={set("firstName")} className={inputClass} required />
          </Field>
          <Field label="Last Name">
            <input value={form.lastName} onChange={set("lastName")} className={inputClass} />
          </Field>
          <Field label="Display Name">
            <input value={form.displayName} onChange={set("displayName")} className={inputClass} placeholder="Shown on public profile" />
          </Field>
          <Field label="Date of Birth">
            <input type="date" value={form.dob} onChange={set("dob")} className={inputClass} />
          </Field>
          <Field label="Nationality">
            <input value={form.nationality} onChange={set("nationality")} className={inputClass} />
          </Field>
          <Field label="Team">
            <SearchSelect
              value={form.teamId}
              onChange={(teamId) => setForm({ ...form, teamId })}
              options={teamOptions}
              placeholder="Search teams..."
            />
          </Field>
          <Field label="Position">
            <select value={form.position} onChange={set("position")} className={inputClass}>
              <option>Goalkeeper</option>
              <option>Defender</option>
              <option>Midfielder</option>
              <option>Forward</option>
            </select>
          </Field>
          <Field label="Jersey Number">
            <input type="number" value={form.jersey} onChange={set("jersey")} className={inputClass} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" value={form.height} onChange={set("height")} className={inputClass} />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" value={form.weight} onChange={set("weight")} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")} className={inputClass}>
              <option>Fit</option>
              <option>Injured</option>
              <option>Suspended</option>
              <option>Active</option>
            </select>
          </Field>
          <Field label="Contract End">
            <input type="date" value={form.contractEnd} onChange={set("contractEnd")} className={inputClass} />
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {DB.players.map((p) => (
          <ListCard
            key={p.id}
            title={p.displayName || `${p.firstName || p.name || ""} ${p.lastName || ""}`.trim()}
            subtitle={`ID: ${p.id} · ${p.firstName || ""} ${p.lastName || ""} · ${p.dob || "—"} · ${p.nationality || "—"} · ${p.position || "—"} #${p.jersey || "—"} · ${DB.teams.find((t) => t.id === p.teamId)?.name || "No team"}`}
            onEdit={() => openEdit(p)}
            onDelete={() => {
              if (confirm("Delete this player?")) deleteRecord("players", p.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
