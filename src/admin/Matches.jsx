import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function Matches() {
  const { DB, saveData, showToast } = useData()

  const matches = DB?.matches || []
  const teams = DB?.teams || []
  const competitions = DB?.competitions || []

  const [showForm, setShowForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)

  const [form, setForm] = useState({
    homeTeamId: '',
    awayTeamId: '',
    competitionId: '',
    date: '',
    time: '',
    venue: '',
    status: 'Scheduled',
    homeScore: '',
    awayScore: '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      homeTeamId: '',
      awayTeamId: '',
      competitionId: '',
      date: '',
      time: '',
      venue: '',
      status: 'Scheduled',
      homeScore: '',
      awayScore: '',
    })

    setEditingMatch(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    setEditingMatch(null)

    setForm({
      homeTeamId: '',
      awayTeamId: '',
      competitionId: '',
      date: '',
      time: '',
      venue: '',
      status: 'Scheduled',
      homeScore: '',
      awayScore: '',
    })

    setShowForm(true)
  }

  const handleEdit = (match) => {
    setEditingMatch(match)

    setForm({
      homeTeamId: match.homeTeamId || '',
      awayTeamId: match.awayTeamId || '',
      competitionId: match.competitionId || '',
      date: match.date || '',
      time: match.time || '',
      venue: match.venue || '',
      status: match.status || 'Scheduled',
      homeScore:
        match.homeScore !== undefined ? match.homeScore : '',
      awayScore:
        match.awayScore !== undefined ? match.awayScore : '',
    })

    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.homeTeamId) {
      showToast('Please select the home team', 'err')
      return
    }

    if (!form.awayTeamId) {
      showToast('Please select the away team', 'err')
      return
    }

    if (form.homeTeamId === form.awayTeamId) {
      showToast('Home and away teams cannot be the same', 'err')
      return
    }

    if (!form.date) {
      showToast('Match date is required', 'err')
      return
    }

    if (editingMatch) {
      const updatedMatches = matches.map((match) =>
        match.id === editingMatch.id
          ? {
              ...match,
              ...form,
              homeScore:
                form.homeScore === ''
                  ? ''
                  : Number(form.homeScore),
              awayScore:
                form.awayScore === ''
                  ? ''
                  : Number(form.awayScore),
            }
          : match
      )

      saveData({
        ...DB,
        matches: updatedMatches,
      })

      showToast('Match updated successfully')
    } else {
      const newMatch = {
        id: Date.now(),
        homeTeamId: form.homeTeamId,
        awayTeamId: form.awayTeamId,
        competitionId: form.competitionId,
        date: form.date,
        time: form.time,
        venue: form.venue.trim(),
        status: form.status,
        homeScore:
          form.homeScore === ''
            ? ''
            : Number(form.homeScore),
        awayScore:
          form.awayScore === ''
            ? ''
            : Number(form.awayScore),
      }

      saveData({
        ...DB,
        matches: [...matches, newMatch],
      })

      showToast('Match added successfully')
    }

    resetForm()
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this match?'
    )

    if (!confirmed) return

    saveData({
      ...DB,
      matches: matches.filter((match) => match.id !== id),
    })

    showToast('Match deleted successfully')
  }

  const getTeamName = (teamId) => {
    const team = teams.find(
      (team) => String(team.id) === String(teamId)
    )

    return team?.name || 'Unknown Team'
  }

  const getCompetitionName = (competitionId) => {
    const competition = competitions.find(
      (competition) =>
        String(competition.id) === String(competitionId)
    )

    return competition?.name || ''
  }

  const getScore = (match) => {
    if (
      match.homeScore === '' ||
      match.homeScore === undefined ||
      match.awayScore === '' ||
      match.awayScore === undefined
    ) {
      return 'vs'
    }

    return `${match.homeScore} - ${match.awayScore}`
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#123B2A]">
            Matches
          </h1>

          <p className="mt-2 text-gray-600">
            Manage fixtures and match results.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-[#123B2A] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1E7245]"
        >
          + Add Match
        </button>

      </div>

      {/* Match Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold text-[#123B2A] mb-5">
            {editingMatch ? 'Edit Match' : 'Add New Match'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Home Team */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Home Team *
                </label>

                <select
                  name="homeTeamId"
                  value={form.homeTeamId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="">
                    Select home team
                  </option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Away Team */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Away Team *
                </label>

                <select
                  name="awayTeamId"
                  value={form.awayTeamId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="">
                    Select away team
                  </option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Competition */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Competition
                </label>

                <select
                  name="competitionId"
                  value={form.competitionId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="">
                    Select competition
                  </option>

                  {competitions.map((competition) => (
                    <option
                      key={competition.id}
                      value={competition.id}
                    >
                      {competition.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Venue
                </label>

                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Example: Sindhuli Stadium"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Match Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kickoff Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Match Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>
                  <option value="Live">
                    Live
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Postponed">
                    Postponed
                  </option>
                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Home Score */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Home Score
                </label>

                <input
                  type="number"
                  name="homeScore"
                  value={form.homeScore}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

              {/* Away Score */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Away Score
                </label>

                <input
                  type="number"
                  name="awayScore"
                  value={form.awayScore}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1E7245]"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-[#1E7245] text-white px-5 py-3 rounded-lg font-semibold"
              >
                {editingMatch
                  ? 'Update Match'
                  : 'Save Match'}
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

      {/* Matches List */}
      <div className="space-y-4">

        {matches.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h2 className="text-xl font-semibold text-[#123B2A]">
              No matches yet
            </h2>

            <p className="text-gray-500 mt-2">
              Click "Add Match" to create your first fixture.
            </p>

          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >

              {/* Competition + Status */}
              <div className="flex flex-wrap justify-between gap-3 mb-5">

                <div className="text-sm text-gray-500">
                  {getCompetitionName(match.competitionId) ||
                    'Friendly Match'}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    match.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : match.status === 'Live'
                      ? 'bg-red-100 text-red-700'
                      : match.status === 'Postponed'
                      ? 'bg-yellow-100 text-yellow-700'
                      : match.status === 'Cancelled'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {match.status || 'Scheduled'}
                </span>

              </div>

              {/* Teams + Score */}
              <div className="grid grid-cols-3 items-center text-center gap-4">

                <div>
                  <h2 className="font-bold text-[#123B2A]">
                    {getTeamName(match.homeTeamId)}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Home
                  </p>
                </div>

                <div>
                  <div className="text-2xl font-bold text-[#123B2A]">
                    {getScore(match)}
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {match.date}
                    {match.time && ` • ${match.time}`}
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-[#123B2A]">
                    {getTeamName(match.awayTeamId)}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Away
                  </p>
                </div>

              </div>

              {/* Venue */}
              {match.venue && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  📍 {match.venue}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-2 mt-5 pt-4 border-t border-gray-100">

                <button
                  type="button"
                  onClick={() => handleEdit(match)}
                  className="border border-[#1E7245] text-[#1E7245] px-4 py-2 rounded-lg font-semibold"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(match.id)}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}