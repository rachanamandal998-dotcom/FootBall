import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function Players() {
  const { DB, saveData, showToast } = useData()

  const players = DB?.players || []
  const teams = DB?.teams || []

  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)

  const [form, setForm] = useState({
    name: '',
    dob: '',
    position: '',
    jerseyNumber: '',
    teamId: '',
    nationality: 'Nepal',
    status: 'Active',
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
      dob: '',
      position: '',
      jerseyNumber: '',
      teamId: '',
      nationality: 'Nepal',
      status: 'Active',
    })

    setEditingPlayer(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    setEditingPlayer(null)

    setForm({
      name: '',
      dob: '',
      position: '',
      jerseyNumber: '',
      teamId: '',
      nationality: 'Nepal',
      status: 'Active',
    })

    setShowForm(true)
  }

  const handleEdit = (player) => {
    setEditingPlayer(player)

    setForm({
      name: player.name || '',
      dob: player.dob || '',
      position: player.position || '',
      jerseyNumber: player.jerseyNumber || '',
      teamId: player.teamId || '',
      nationality: player.nationality || 'Nepal',
      status: player.status || 'Active',
    })

    setShowForm(true)
  }

  const calculateAge = (dob) => {
    if (!dob) return ''

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDifference =
      today.getMonth() - birthDate.getMonth()

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      showToast('Player name is required', 'err')
      return
    }

    if (!form.position) {
      showToast('Please select a position', 'err')
      return
    }

    if (editingPlayer) {
      const updatedPlayers = players.map((player) =>
        player.id === editingPlayer.id
          ? {
              ...player,
              ...form,
              jerseyNumber: form.jerseyNumber
                ? Number(form.jerseyNumber)
                : '',
            }
          : player
      )

      saveData({
        ...DB,
        players: updatedPlayers,
      })

      showToast('Player updated successfully')
    } else {
      const newPlayer = {
        id: Date.now(),
        name: form.name.trim(),
        dob: form.dob,
        position: form.position,
        jerseyNumber: form.jerseyNumber
          ? Number(form.jerseyNumber)
          : '',
        teamId: form.teamId,
        nationality: form.nationality.trim(),
        status: form.status,
      }

      saveData({
        ...DB,
        players: [...players, newPlayer],
      })

      showToast('Player added successfully')
    }

    resetForm()
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this player?'
    )

    if (!confirmed) return

    saveData({
      ...DB,
      players: players.filter((player) => player.id !== id),
    })

    showToast('Player deleted successfully')
  }

  const getTeamName = (teamId) => {
    const team = teams.find(
      (team) => String(team.id) === String(teamId)
    )

    return team?.name || 'No team'
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#123B2A]">
            Players
          </h1>

          <p className="mt-2 text-gray-600">
            Manage Sindhuli Football Club players.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-[#123B2A] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1E7245]"
        >
          + Add Player
        </button>

      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            {editingPlayer ? 'Edit Player' : 'Add New Player'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Player Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Ram Thapa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />

                {form.dob && (
                  <p className="text-sm text-gray-500 mt-2">
                    Age: {calculateAge(form.dob)} years
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Position *
                </label>

                <select
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="">Select position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>

              {/* Jersey Number */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Jersey Number
                </label>

                <input
                  type="number"
                  name="jerseyNumber"
                  value={form.jerseyNumber}
                  onChange={handleChange}
                  placeholder="Example: 10"
                  min="1"
                  max="99"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Team
                </label>

                <select
                  name="teamId"
                  value={form.teamId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="">No team</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nationality
                </label>

                <input
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  placeholder="Example: Nepal"
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
                  <option value="Active">Active</option>
                  <option value="Injured">Injured</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-[#1E7245] text-white px-5 py-3 rounded-lg font-semibold"
              >
                {editingPlayer ? 'Update Player' : 'Save Player'}
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

      {/* Players List */}
      <div className="space-y-4">

        {players.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h2 className="text-xl font-semibold text-[#123B2A]">
              No players yet
            </h2>

            <p className="text-gray-500 mt-2">
              Click "Add Player" to create your first player.
            </p>

          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-[#123B2A]">
                    {player.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">

                    <span>
                      {player.position || 'Position not set'}
                    </span>

                    {player.jerseyNumber && (
                      <span>
                        • #{player.jerseyNumber}
                      </span>
                    )}

                    <span>
                      • {getTeamName(player.teamId)}
                    </span>

                    {player.dob && (
                      <span>
                        • Age {calculateAge(player.dob)}
                      </span>
                    )}

                    {player.nationality && (
                      <span>
                        • {player.nationality}
                      </span>
                    )}

                  </div>

                  <div className="mt-3">

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        player.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : player.status === 'Injured'
                          ? 'bg-yellow-100 text-yellow-700'
                          : player.status === 'Suspended'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {player.status || 'Active'}
                    </span>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => handleEdit(player)}
                    className="border border-[#1E7245] text-[#1E7245] px-4 py-2 rounded-lg font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(player.id)}
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