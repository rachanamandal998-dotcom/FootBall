import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass, SearchSelect } from './FormUI.jsx'

const EMPTY = { id: '', playerId: '', type: '', date: '', expectedReturn: '', status: 'Recovering' }

export default function Injuries() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const injuries = DB.injuries || []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const playerOptions = (DB.players || []).map((p) => ({
    value: p.id,
    label: p.displayName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || p.id,
  }))
  const playerName = (id) => playerOptions.find((p) => p.value === id)?.label || id || '—'

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, id: nextId('inj'), playerId: DB.players[0]?.id || '', date: new Date().toISOString().split('T')[0] })
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      id: item.id || '',
      playerId: item.playerId || '',
      type: item.type || '',
      date: item.date || '',
      expectedReturn: item.expectedReturn || '',
      status: item.status || 'Recovering',
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
    if (!form.playerId) return showToast('Player is required', true)
    if (!form.type.trim()) return showToast('Injury type is required', true)

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('injuries', editing.id, form)
        showToast('Injury updated')
      } else {
        await createRecord('injuries', form)
        showToast('Injury created')
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
      <PageHeader title="Injuries" count={injuries.length} onAdd={openAdd} addLabel="+ Add Injury" />

      {showForm && (
        <FormShell
          title={editing ? `Edit Injury — ${editing.id}` : 'Add Injury'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Player *">
            <SearchSelect
              value={form.playerId}
              onChange={(playerId) => setForm({ ...form, playerId })}
              options={playerOptions}
              placeholder="Search players..."
            />
          </Field>
          <Field label="Injury Type *">
            <input value={form.type} onChange={set('type')} className={inputClass} placeholder="Ankle Sprain" required />
          </Field>
          <Field label="Date">
            <input type="date" value={form.date} onChange={set('date')} className={inputClass} />
          </Field>
          <Field label="Expected Return">
            <input type="date" value={form.expectedReturn} onChange={set('expectedReturn')} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option>Recovering</option>
              <option>Out</option>
              <option>Doubtful</option>
              <option>Returned</option>
            </select>
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {injuries.map((item) => (
          <ListCard
            key={item.id}
            title={`${playerName(item.playerId)} — ${item.type}`}
            subtitle={`ID: ${item.id} · ${item.date || '—'} · Return: ${item.expectedReturn || '—'} · ${item.status || ''}`}
            onEdit={() => openEdit(item)}
            onDelete={() => {
              if (confirm('Delete this injury record?')) deleteRecord('injuries', item.id)
            }}
          />
        ))}
        {!injuries.length && <p className="text-sm text-gray-500">No injury records yet.</p>}
      </div>
    </div>
  )
}
