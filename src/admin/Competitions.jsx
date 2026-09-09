import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function Competitions() {
  const { DB, saveData, showToast } = useData()

  const competitions = DB?.competitions || []

  const [showForm, setShowForm] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState(null)

  const [form, setForm] = useState({
    name: '',
    shortName: '',
    season: '',
    type: 'League',
    organizer: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      name: '',
      shortName: '',
      season: '',
      type: 'League',
      organizer: '',
      startDate: '',
      endDate: '',
      status: 'Upcoming',
    })

    setEditingCompetition(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    setEditingCompetition(null)

    setForm({
      name: '',
      shortName: '',
      season: '',
      type: 'League',
      organizer: '',
      startDate: '',
      endDate: '',
      status: 'Upcoming',
    })

    setShowForm(true)
  }

  const handleEdit = (competition) => {
    setEditingCompetition(competition)

    setForm({
      name: competition.name || '',
      shortName: competition.shortName || '',
      season: competition.season || '',
      type: competition.type || 'League',
      organizer: competition.organizer || '',
      startDate: competition.startDate || '',
      endDate: competition.endDate || '',
      status: competition.status || 'Upcoming',
    })

    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      showToast('Competition name is required', 'err')
      return
    }

    if (!form.season.trim()) {
      showToast('Season is required', 'err')
      return
    }

    if (editingCompetition) {
      const updatedCompetitions = competitions.map(
        (competition) =>
          competition.id === editingCompetition.id
            ? {
                ...competition,
                ...form,
              }
            : competition
      )

      saveData({
        ...DB,
        competitions: updatedCompetitions,
      })

      showToast('Competition updated successfully')
    } else {
      const newCompetition = {
        id: Date.now(),
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        season: form.season.trim(),
        type: form.type,
        organizer: form.organizer.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      }

      saveData({
        ...DB,
        competitions: [
          ...competitions,
          newCompetition,
        ],
      })

      showToast('Competition added successfully')
    }

    resetForm()
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this competition?'
    )

    if (!confirmed) return

    saveData({
      ...DB,
      competitions: competitions.filter(
        (competition) => competition.id !== id
      ),
    })

    showToast('Competition deleted successfully')
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#123B2A]">
            Competitions
          </h1>

          <p className="mt-2 text-gray-600">
            Manage competitions and tournaments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-[#123B2A] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1E7245]"
        >
          + Add Competition
        </button>

      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            {editingCompetition
              ? 'Edit Competition'
              : 'Add New Competition'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Competition Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Sindhuli District League"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Short Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Short Name
                </label>

                <input
                  type="text"
                  name="shortName"
                  value={form.shortName}
                  onChange={handleChange}
                  placeholder="Example: SDL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Season *
                </label>

                <input
                  type="text"
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                  placeholder="Example: 2026"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Competition Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="League">League</option>
                  <option value="Cup">Cup</option>
                  <option value="Tournament">
                    Tournament
                  </option>
                  <option value="Friendly">
                    Friendly
                  </option>
                </select>
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Organizer
                </label>

                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="Example: ANFA / District FA"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-[#1E7245] text-white px-5 py-3 rounded-lg font-semibold"
              >
                {editingCompetition
                  ? 'Update Competition'
                  : 'Save Competition'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-5 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Competition List */}
      <div className="space-y-4">

        {competitions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h2 className="text-xl font-semibold text-[#123B2A]">
              No competitions yet
            </h2>

            <p className="text-gray-500 mt-2">
              Click "Add Competition" to create your first competition.
            </p>

          </div>
        ) : (
          competitions.map((competition) => (
            <div
              key={competition.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-xl font-bold text-[#123B2A]">
                      {competition.name}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        competition.status === 'Ongoing'
                          ? 'bg-green-100 text-green-700'
                          : competition.status === 'Completed'
                          ? 'bg-gray-100 text-gray-600'
                          : competition.status === 'Cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {competition.status || 'Upcoming'}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">

                    {competition.shortName && (
                      <span>
                        {competition.shortName}
                      </span>
                    )}

                    {competition.season && (
                      <span>
                        • Season {competition.season}
                      </span>
                    )}

                    {competition.type && (
                      <span>
                        • {competition.type}
                      </span>
                    )}

                    {competition.organizer && (
                      <span>
                        • {competition.organizer}
                      </span>
                    )}

                  </div>

                  {(competition.startDate ||
                    competition.endDate) && (
                    <p className="text-sm text-gray-500 mt-2">
                      {competition.startDate || 'TBA'}
                      {' → '}
                      {competition.endDate || 'TBA'}
                    </p>
                  )}

                </div>

                {/* Actions */}
                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(competition)
                    }
                    className="border border-[#1E7245] text-[#1E7245] px-4 py-2 rounded-lg font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(competition.id)
                    }
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}