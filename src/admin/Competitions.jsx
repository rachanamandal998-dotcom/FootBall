import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { nextId } from "../utils/helpers.js";
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass } from "./FormUI.jsx";

const EMPTY = {
  id: "",
  name: "",
  shortName: "",
  season: "",
  type: "League",
  description: "",
  pointsWin: 3,
  pointsDraw: 1,
  pointsLoss: 0,
  teamIds: [],
};

export default function Competitions() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleTeam = (id) => {
    const teamIds = form.teamIds.includes(id)
      ? form.teamIds.filter((x) => x !== id)
      : [...form.teamIds, id];
    setForm({ ...form, teamIds });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, id: nextId("c"), teamIds: [] });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      id: c.id || "",
      name: c.name || "",
      shortName: c.shortName || "",
      season: c.season || "",
      type: c.type || "League",
      description: c.description || "",
      pointsWin: c.pointsWin ?? 3,
      pointsDraw: c.pointsDraw ?? 1,
      pointsLoss: c.pointsLoss ?? 0,
      teamIds: c.teamIds || [],
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
    if (!form.name.trim()) return showToast("Name is required", true);

    const record = {
      ...form,
      pointsWin: Number(form.pointsWin) || 0,
      pointsDraw: Number(form.pointsDraw) || 0,
      pointsLoss: Number(form.pointsLoss) || 0,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateRecord("competitions", editing.id, record);
        showToast("Competition updated");
      } else {
        await createRecord("competitions", record);
        showToast("Competition created");
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
      <PageHeader
        title="Competitions"
        count={DB.competitions?.length || 0}
        onAdd={openAdd}
        addLabel="+ Add Competition"
      />

      {showForm && (
        <FormShell
          title={editing ? `Edit Competition — ${editing.id}` : "Add Competition"}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Name *">
            <input value={form.name} onChange={set("name")} className={inputClass} required />
          </Field>
          <Field label="Short Name">
            <input value={form.shortName} onChange={set("shortName")} className={inputClass} />
          </Field>
          <Field label="Season">
            <input value={form.season} onChange={set("season")} className={inputClass} placeholder="2024/25" />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={set("type")} className={inputClass}>
              <option>League</option>
              <option>Cup</option>
              <option>Friendly</option>
            </select>
          </Field>
          <Field label="Points for Win">
            <input type="number" value={form.pointsWin} onChange={set("pointsWin")} className={inputClass} />
          </Field>
          <Field label="Points for Draw">
            <input type="number" value={form.pointsDraw} onChange={set("pointsDraw")} className={inputClass} />
          </Field>
          <Field label="Points for Loss">
            <input type="number" value={form.pointsLoss} onChange={set("pointsLoss")} className={inputClass} />
          </Field>
          <Field label="Description" full>
            <textarea value={form.description} onChange={set("description")} className={inputClass} rows="3" />
          </Field>
          <Field label="Teams in competition" full>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-200 rounded-lg p-3 max-h-48 overflow-auto">
              {(DB.teams || []).map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.teamIds.includes(t.id)}
                    onChange={() => toggleTeam(t.id)}
                  />
                  {t.name}
                </label>
              ))}
              {!DB.teams?.length && <p className="text-sm text-gray-500">No teams yet. Add teams first.</p>}
            </div>
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {DB.competitions?.map((c) => (
          <ListCard
            key={c.id}
            title={c.name}
            subtitle={`ID: ${c.id} · ${c.shortName || "—"} · ${c.season || "—"} · ${c.type || "—"} · ${c.teamIds?.length || 0} teams · ${c.pointsWin}/${c.pointsDraw}/${c.pointsLoss} pts`}
            onEdit={() => openEdit(c)}
            onDelete={() => {
              if (confirm("Delete this competition?")) deleteRecord("competitions", c.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
