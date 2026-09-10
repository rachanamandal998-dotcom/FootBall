import { useEffect, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import {
  createUserRequest,
  deleteUserRequest,
  fetchUsers,
  updateUserRequest,
} from '../api/auth.js'
import { Field, FormShell, PageHeader, ListCard, inputClass } from './FormUI.jsx'

const EMPTY = { name: '', email: '', role: 'user', password: '' }

export default function Users() {
  const { showToast } = useData()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const load = async () => {
    try {
      const data = await fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      showToast(err.message || 'Unable to load users', true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role === 'admin' ? 'admin' : 'user',
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
    if (!form.name.trim()) return showToast('Name is required', true)
    if (!form.email.trim()) return showToast('Email is required', true)
    if (!editing && !form.password.trim()) return showToast('Password is required for new users', true)
    if (form.password && form.password.length < 8) {
      return showToast('Password must be at least 8 characters', true)
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    }
    if (form.password.trim()) payload.password = form.password

    setSaving(true)
    try {
      if (editing) {
        await updateUserRequest(editing.id, payload)
        showToast('User updated')
      } else {
        await createUserRequest(payload)
        showToast('User created')
      }
      reset()
      await load()
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
          title={editing ? `Edit User — ${editing.email}` : 'Add User'}
          onSubmit={handleSubmit}
          onCancel={reset}
          saving={saving}
        >
          <Field label="Name *">
            <input value={form.name} onChange={set('name')} className={inputClass} required />
          </Field>
          <Field label="Email *">
            <input type="email" value={form.email} onChange={set('email')} className={inputClass} required />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={set('role')} className={inputClass}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label={editing ? 'Password (leave blank to keep current)' : 'Password *'} full>
            <input type="password" value={form.password} onChange={set('password')} className={inputClass} />
          </Field>
        </FormShell>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading users...</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <ListCard
              key={user.id}
              title={user.name}
              subtitle={`${user.email} · ${user.role}`}
              onEdit={() => openEdit(user)}
              onDelete={async () => {
                if (!confirm('Delete this user?')) return
                try {
                  await deleteUserRequest(user.id)
                  showToast('User deleted')
                  await load()
                } catch (err) {
                  showToast(err.message || 'Delete failed', true)
                }
              }}
            />
          ))}
          {!users.length && <p className="text-sm text-gray-500">No users yet.</p>}
        </div>
      )}
    </div>
  )
}
