import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass } from './FormUI.jsx'

const EMPTY = { id: '', title: '', category: 'General', content: '', date: '', author: '', status: 'Published' }

export default function News() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...EMPTY,
      id: nextId('n'),
      date: new Date().toISOString().split('T')[0],
    })
    setShowForm(true)
  }

  const openEdit = (n) => {
    setEditing(n)
    setForm({
      id: n.id || '',
      title: n.title || '',
      category: n.category || 'General',
      content: n.content || '',
      date: n.date || '',
      author: n.author || '',
      status: n.status || 'Published',
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
    if (!form.title.trim()) return showToast('Title is required', true)
    if (!form.content.trim()) return showToast('Content is required', true)

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('news', editing.id, form)
        showToast('News updated')
      } else {
        await createRecord('news', form)
        showToast('News created')
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
      <PageHeader title="News" count={DB.news.length} onAdd={openAdd} addLabel="+ Add News" />

      {showForm && (
        <FormShell
          title={editing ? `Edit News — ${editing.id}` : 'Add News'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Title *" full>
            <input value={form.title} onChange={set('title')} className={inputClass} required />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={set('category')} className={inputClass}>
              <option>General</option>
              <option>Match Report</option>
              <option>Transfer</option>
              <option>Club News</option>
              <option>Feature</option>
            </select>
          </Field>
          <Field label="Date">
            <input type="date" value={form.date} onChange={set('date')} className={inputClass} />
          </Field>
          <Field label="Author">
            <input value={form.author} onChange={set('author')} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </Field>
          <Field label="Content *" full>
            <textarea value={form.content} onChange={set('content')} className={inputClass} rows="6" required />
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {DB.news.map((n) => (
          <ListCard
            key={n.id}
            title={n.title}
            subtitle={`ID: ${n.id} · ${n.category || '—'} · ${n.date || '—'} · ${n.author || '—'} · ${n.status || ''} · ${(n.content || '').slice(0, 80)}${(n.content || '').length > 80 ? '…' : ''}`}
            onEdit={() => openEdit(n)}
            onDelete={() => {
              if (confirm('Delete this article?')) deleteRecord('news', n.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
