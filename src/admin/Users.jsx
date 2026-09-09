import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { nextId } from '../utils/helpers.js'
import { Field, IdField, FormShell, PageHeader, ListCard, inputClass } from './FormUI.jsx'

const EMPTY = { id: '', username: '', displayName: '', email: '', role: 'admin', password: '' }

export default function Users() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData()
  const users = DB.users || []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY, id: nextId('u') })
    setShowForm(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({
      id: user.id || '',
      username: user.username || '',
      displayName: user.displayName || '',
      email: user.email || '',
      role: user.role || 'admin',
      password: '',
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
    if (!form.username.trim()) return showToast('Username is required', true)
    if (!editing && !form.password.trim()) return showToast('Password is required for new users', true)

    const record = {
      username: form.username.trim(),
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      role: form.role,
      id: form.id,
    }
    if (form.password.trim()) record.password = form.password
    else if (editing?.password) record.password = editing.password

    setSaving(true)
    try {
      if (editing) {
        await updateRecord('users', editing.id, record)
        showToast('User updated')
      } else {
        await createRecord('users', record)
        showToast('User created')
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
      <PageHeader title="Users" count={users.length} onAdd={openAdd} addLabel="+ Add User" />

      {showForm && (
        <FormShell
          title={editing ? `Edit User — ${editing.id}` : 'Add User'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <IdField value={form.id} />
          <Field label="Username *">
            <input value={form.username} onChange={set('username')} className={inputClass} required />
          </Field>
          <Field label="Display Name">
            <input value={form.displayName} onChange={set('displayName')} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={set('role')} className={inputClass}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
            </select>
          </Field>
          <Field label={editing ? 'Password (leave blank to keep current)' : 'Password *'} full>
            <input type="password" value={form.password} onChange={set('password')} className={inputClass} />
          </Field>
        </FormShell>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <ListCard
            key={user.id}
            title={user.displayName || user.username}
            subtitle={`ID: ${user.id} · @${user.username} · ${user.email || '—'} · ${user.role || 'admin'}`}
            onEdit={() => openEdit(user)}
            onDelete={() => {
              if (confirm('Delete this user?')) deleteRecord('users', user.id)
            }}
          />
        ))}
        {!users.length && <p className="text-sm text-gray-500">No users yet.</p>}
      </div>
    </div>
  )
}
