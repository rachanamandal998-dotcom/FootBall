import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function AdminTeams() {
  const { DB, saveData, showToast } = useData()
  const teams = DB?.teams || []
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)

  const [form, setForm] = useState({
    name: '',
    shortName: '',
    location: '',
    stadium: '',
    coach: '',
    category: '',
    founded: '',
  })

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({ name: '', shortName: '', location: '', stadium: '', coach: '', category: '', founded: '' })
    setEditingTeam(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEdit = (team) => {
    setEditingTeam(team)
    setForm({
      name: team.name || '',
      shortName: team.shortName || '',
      location: team.location || '',
      stadium: team.stadium || '',
      coach: team.coach || team.manager || '',
      category: team.category || '',
      founded: team.founded || '',
    })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { showToast('Team name required', true); return }

    if (editingTeam) {
      const updated = teams.map(t => t.id === editingTeam.id? {...t,...form, manager: form.coach } : t)
      saveData({...DB, teams: updated })
      showToast('Team updated')
    } else {
      const newTeam = { id: `t${Date.now()}`,...form, manager: form.coach }
      saveData({...DB, teams: [...teams, newTeam] })
      showToast('Team added')
    }
    resetForm()
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this team?')) return
    saveData({...DB, teams: teams.filter(t => t.id!== id) })
    showToast('Team deleted')
  }

  return (
    <div className="max-w- mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text- font-bold text-[#123B2A]">Manage Teams</h1>
          <p className="text- text-gray-500">{teams.length} teams</p>
        </div>
        <button onClick={handleAdd} className="bg-[#123B2A] text-white px-5 py-3 rounded- text- font-bold">+ Add Team</button>
      </div>

      {showForm && (
        <div className="bg-white border rounded- p-6 mb-8">
          <h2 className="text- font-bold mb-5">{editingTeam? 'Edit Team' : 'Add Team'}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div><label className="text- font-bold">Team Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Laxmipur FC" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Short Name</label><input name="shortName" value={form.shortName} onChange={handleChange} placeholder="LFC" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Location *</label><input name="location" value={form.location} onChange={handleChange} placeholder="Laxmipur, Sindhuli" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Stadium *</label><input name="stadium" value={form.stadium} onChange={handleChange} placeholder="Laxmipur Ground" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Coach *</label><input name="coach" value={form.coach} onChange={handleChange} placeholder="Rachana Mandal" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Category</label><input name="category" value={form.category} onChange={handleChange} placeholder="Senior / U-19" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div><label className="text- font-bold">Founded</label><input name="founded" value={form.founded} onChange={handleChange} placeholder="2020" className="w-full border px-4 py-3 rounded- text- mt-1" /></div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" className="bg-[#1E7245] text-white px-6 py-3 rounded- text- font-bold">{editingTeam? 'Update Team' : 'Save Team'}</button>
              <button type="button" onClick={resetForm} className="border px-6 py-3 rounded- text-">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {teams.map(t => (
          <div key={t.id} className="bg-white border rounded- p-4 flex justify-between items-center">
            <div><div className="font-bold text-">{t.name} <span className="text- bg-[#E9E4D2] px-2 py-1 rounded ml-2">{t.shortName}</span></div><div className="text- text-gray-500 mt-1">📍 {t.location} | 🏟️ {t.stadium} | 👤 {t.coach} | {t.category} | {t.founded}</div></div>
            <div className="flex gap-2"><button onClick={()=>handleEdit(t)} className="border border-[#1E7245] text-[#1E7245] px-4 py-1.5 rounded- text-">Edit</button><button onClick={()=>handleDelete(t.id)} className="border border-red-500 text-red-500 px-4 py-1.5 rounded- text-">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}