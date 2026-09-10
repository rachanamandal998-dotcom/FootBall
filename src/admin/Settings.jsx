
import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { DB, saveData, showToast } = useData()
  const { user } = useAuth()

  const meta = DB?.meta || {}

  const [form, setForm] = useState({
    clubName: meta.clubName || 'Sindhuli Football Clubhouse',
    shortName: meta.shortName || 'SFC',
    tagline: meta.tagline || 'Manage. Play. Connect.',
    location: meta.location || 'Sindhuli, Nepal',
    email: meta.email || '',
    phone: meta.phone || '',
    website: meta.website || '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = (e) => {
    e.preventDefault()

    if (!form.clubName.trim()) {
      showToast('Club name is required', true)
      return
    }

    saveData({
      ...DB,
      meta: {
        ...meta,
        ...form,
      },
    })

    showToast('Settings saved successfully')
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#123B2A]">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage club and admin settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Club Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            Club Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Club Name
              </label>

              <input
                type="text"
                name="clubName"
                value={form.clubName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Short Name
              </label>

              <input
                type="text"
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Tagline
              </label>

              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Contact Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="club@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+977..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Website
              </label>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

          </div>
        </div>

        {/* Signed-in account */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            Signed-in account
          </h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{user?.name || '—'}</span></p>
            <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{user?.email || '—'}</span></p>
            <p><span className="text-gray-500">Role:</span> <span className="font-semibold capitalize">{user?.role || '—'}</span></p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Authentication is managed by your account. Use Signup/Login instead of a shared admin password.
          </p>
        </div>

        {/* Save */}
        <div className="flex justify-end">

          <button
            type="submit"
            className="bg-[#123B2A] hover:bg-[#1E7245] text-white px-6 py-3 rounded-lg font-semibold"
          >
            Save Settings
          </button>

        </div>

      </form>

    </div>
  )
}

