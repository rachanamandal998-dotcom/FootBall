import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass, SearchSelect } from './FormUI.jsx'

const EMPTY = {
  id: '',
  compId: '',
  season: '',
  homeTeamId: '',
  awayTeamId: '',
  date: '',
  time: '',
  stadium: '',
  referee: '',
  status: 'Scheduled',
  homeScore: 0,
  awayScore: 0,
}

export default function Matches() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const teamOptions = (DB.teams || []).map((t) => ({ value: t.id, label: `${t.name} (${t.shortName || t.id})` }))
  const compOptions = (DB.competitions || []).map((c) => ({ value: c.id, label: `${c.name}${c.season ? ` · ${c.season}` : ''}` }))
  const teamName = (id) => DB.teams.find((t) => t.id === id)?.name || id || '—'

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...EMPTY,
      id: nextId('m'),
      compId: DB.competitions?.[0]?.id || '',
      season: DB.competitions?.[0]?.season || '2024/25',
      homeTeamId: DB.teams[0]?.id || '',
      awayTeamId: DB.teams[1]?.id || DB.teams[0]?.id || '',
      stadium: DB.teams[0]?.stadium || '',
    })
    setShowForm(true)
  }

  const openEdit = (m) => {
    setEditing(m)
    setForm({
      id: m.id || '',
      compId: m.compId || '',
      season: m.season || '',
      homeTeamId: m.homeTeamId || '',
      awayTeamId: m.awayTeamId || '',
      date: m.date || '',
      time: m.time || '',
      stadium: m.stadium || '',
      referee: m.referee || '',
      status: m.status || 'Scheduled',
      homeScore: m.homeScore ?? 0,
      awayScore: m.awayScore ?? 0,
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
    if (!form.homeTeamId) return showToast('Home team is required', true)
    if (!form.awayTeamId) return showToast('Away team is required', true)
    if (form.homeTeamId === form.awayTeamId) return showToast('Home and away teams must be different', true)
    if (!form.date) return showToast('Date is required', true)

    const record = {
      ...(editing || {}),
      ...form,
      homeScore: Number(form.homeScore) || 0,
      awayScore: Number(form.awayScore) || 0,
      events: editing?.events || [],
      lineups: editing?.lineups || { home: null, away: null },
      stats: editing?.stats || {},
    }

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('matches', editing.id, record)
        showToast('Match updated')
      } else {
        await createRecord('matches', record)
        showToast('Match created')
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
      <PageHeader title="Matches" count={DB.matches.length} onAdd={openAdd} addLabel="+ Add Match" />

      {showForm && (
        <FormShell
          title={editing ? `Edit Match — ${editing.id}` : 'Add Match'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Competition">
            <SearchSelect
              value={form.compId}
              onChange={(compId) => {
                const comp = DB.competitions.find((c) => c.id === compId)
                setForm({ ...form, compId, season: comp?.season || form.season })
              }}
              options={compOptions}
              placeholder="Search competitions..."
            />
          </Field>
          <Field label="Season">
            <input value={form.season} onChange={set('season')} className={inputClass} placeholder="2024/25" />
          </Field>
          <Field label="Home Team *">
            <SearchSelect
              value={form.homeTeamId}
              onChange={(homeTeamId) => {
                const team = DB.teams.find((t) => t.id === homeTeamId)
                setForm({ ...form, homeTeamId, stadium: form.stadium || team?.stadium || '' })
              }}
              options={teamOptions}
              placeholder="Search home team..."
            />
          </Field>
          <Field label="Away Team *">
            <SearchSelect
              value={form.awayTeamId}
              onChange={(awayTeamId) => setForm({ ...form, awayTeamId })}
              options={teamOptions}
              placeholder="Search away team..."
            />
          </Field>
          <Field label="Date *">
            <input type="date" value={form.date} onChange={set('date')} className={inputClass} required />
          </Field>
          <Field label="Time">
            <input type="time" value={form.time} onChange={set('time')} className={inputClass} />
          </Field>
          <Field label="Stadium">
            <input value={form.stadium} onChange={set('stadium')} className={inputClass} />
          </Field>
          <Field label="Referee">
            <input value={form.referee} onChange={set('referee')} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option>Scheduled</option>
              <option>Live</option>
              <option>Finished</option>
              <option>Postponed</option>
            </select>
          </Field>
          <Field label="Home Score">
            <input type="number" min="0" value={form.homeScore} onChange={set('homeScore')} className={inputClass} />
          </Field>
          <Field label="Away Score">
            <input type="number" min="0" value={form.awayScore} onChange={set('awayScore')} className={inputClass} />
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {DB.matches.map((m) => (
          <ListCard
            key={m.id}
            title={`${teamName(m.homeTeamId)} vs ${teamName(m.awayTeamId)}`}
            subtitle={`ID: ${m.id} · ${DB.competitions.find((c) => c.id === m.compId)?.name || m.compId || '—'} · ${m.season || '—'} · ${m.date || '—'} ${m.time || ''} · ${m.status || ''} · ${m.homeScore ?? 0}-${m.awayScore ?? 0}`}
            onEdit={() => openEdit(m)}
            onDelete={() => {
              if (confirm('Delete this match?')) deleteRecord('matches', m.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
