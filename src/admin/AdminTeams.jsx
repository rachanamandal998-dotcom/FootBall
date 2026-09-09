import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass } from './FormUI.jsx'

const EMPTY = { id: '', name: '', shortName: '', location: '', stadium: '', coach: '', founded: '', status: 'Active' }

export default function AdminTeams() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, id: nextId('t') })
    setShowForm(true)
  }

  const openEdit = (team) => {
    setEditing(team)
    setForm({
      id: team.id || '',
      name: team.name || '',
      shortName: team.shortName || '',
      location: team.location || '',
      stadium: team.stadium || '',
      coach: team.coach || team.manager || '',
      founded: team.founded ?? '',
      status: team.status || 'Active',
    })
    setShowForm(true)
  }

  const reset = () => {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return showToast('Name is required', true)
    if (!form.location.trim()) return showToast('Location is required', true)
    if (!form.stadium.trim()) return showToast('Stadium is required', true)
    if (!form.coach.trim()) return showToast('Coach is required', true)

    const record = {
      ...form,
      founded: form.founded === '' ? '' : Number(form.founded),
      manager: form.coach,
    }

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('teams', editing.id, record)
        showToast('Team updated')
      } else {
        await createRecord('teams', record)
        showToast('Team created')
      }
      reset()
    } catch (err) {
      showToast(err.message || 'Save failed', true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Teams" count={DB.teams.length} onAdd={openAdd} addLabel="+ Add Team" />

      {showForm && (
        <FormShell
          title={editing ? `Edit Team — ${editing.id}` : 'Add Team'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Name *">
            <input value={form.name} onChange={set('name')} className={inputClass} placeholder="Laxmipur FC" required />
          </Field>
          <Field label="Short Name">
            <input value={form.shortName} onChange={set('shortName')} className={inputClass} placeholder="LFC" />
          </Field>
          <Field label="Location *">
            <input value={form.location} onChange={set('location')} className={inputClass} placeholder="Laxmipur, Sindhuli" required />
          </Field>
          <Field label="Stadium *">
            <input value={form.stadium} onChange={set('stadium')} className={inputClass} placeholder="Laxmipur Ground" required />
          </Field>
          <Field label="Coach *">
            <input value={form.coach} onChange={set('coach')} className={inputClass} placeholder="Rachana Mandal" required />
          </Field>
          <Field label="Founded">
            <input type="number" value={form.founded} onChange={set('founded')} className={inputClass} placeholder="2012" />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {DB.teams.map((t) => (
          <ListCard
            key={t.id}
            title={t.name}
            subtitle={`ID: ${t.id} · ${t.shortName || '—'} · ${t.location || '—'} · ${t.stadium || '—'} · Coach: ${t.coach || t.manager || '—'} · Est. ${t.founded || '—'}`}
            onEdit={() => openEdit(t)}
            onDelete={() => {
              if (confirm('Delete this team?')) deleteRecord('teams', t.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
