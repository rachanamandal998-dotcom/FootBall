import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass, SearchSelect } from './FormUI.jsx'

const EMPTY = { id: '', date: '', duration: 90, type: 'Tactical', coach: '', teamId: '', notes: '' }

export default function Training() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const sessions = DB.training || []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const teamOptions = (DB.teams || []).map((t) => ({ value: t.id, label: t.name }))

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...EMPTY,
      id: nextId('tr'),
      date: new Date().toISOString().split('T')[0],
      teamId: DB.teams[0]?.id || '',
      coach: DB.teams[0]?.coach || '',
    })
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      id: item.id || '',
      date: item.date || '',
      duration: item.duration ?? 90,
      type: item.type || 'Tactical',
      coach: item.coach || '',
      teamId: item.teamId || '',
      notes: item.notes || '',
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
    if (!form.date) return showToast('Date is required', true)

    const record = { ...form, duration: Number(form.duration) || 0 }

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('training', editing.id, record)
        showToast('Training session updated')
      } else {
        await createRecord('training', record)
        showToast('Training session created')
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
      <PageHeader title="Training" count={sessions.length} onAdd={openAdd} addLabel="+ Add Session" />

      {showForm && (
        <FormShell
          title={editing ? `Edit Training — ${editing.id}` : 'Add Training'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Date *">
            <input type="date" value={form.date} onChange={set('date')} className={inputClass} required />
          </Field>
          <Field label="Duration (minutes)">
            <input type="number" value={form.duration} onChange={set('duration')} className={inputClass} />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={set('type')} className={inputClass}>
              <option>Tactical</option>
              <option>Fitness</option>
              <option>Technical</option>
              <option>Recovery</option>
              <option>Match Prep</option>
            </select>
          </Field>
          <Field label="Coach">
            <input value={form.coach} onChange={set('coach')} className={inputClass} />
          </Field>
          <Field label="Team">
            <SearchSelect
              value={form.teamId}
              onChange={(teamId) => {
                const team = DB.teams.find((t) => t.id === teamId)
                setForm({ ...form, teamId, coach: form.coach || team?.coach || '' })
              }}
              options={teamOptions}
              placeholder="Search teams..."
            />
          </Field>
          <Field label="Notes" full>
            <textarea value={form.notes} onChange={set('notes')} className={inputClass} rows="3" />
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {sessions.map((item) => (
          <ListCard
            key={item.id}
            title={`${item.type || 'Session'} — ${item.date || 'No date'}`}
            subtitle={`ID: ${item.id} · ${item.duration || 0} min · Coach: ${item.coach || '—'} · ${DB.teams.find((t) => t.id === item.teamId)?.name || 'No team'}`}
            onEdit={() => openEdit(item)}
            onDelete={() => {
              if (confirm('Delete this training session?')) deleteRecord('training', item.id)
            }}
          />
        ))}
        {!sessions.length && <p className="text-sm text-gray-500">No training sessions yet.</p>}
      </div>
    </div>
  )
}
