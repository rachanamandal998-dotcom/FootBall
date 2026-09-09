import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'

export default function Admin(){
  const { DB, saveData, adminAuthed, setAdminAuthed, showToast } = useData()
  const [pass, setPass] = useState('')
  const [tab, setTab] = useState('teams')
  const [editing, setEditing] = useState(null) // {type, id, data}
  const [form, setForm] = useState({})

  const login = () => {
    if(pass === (DB.meta?.adminPass || 'admin123')){
      setAdminAuthed(true); showToast('Admin login success')
    } else showToast('Wrong password', true)
  }

  const openEdit = (type, item) => {
    setEditing({type, id: item.id})
    setForm(item)
    window.scrollTo(0,0)
  }

  const openAdd = (type) => {
    const blank = type==='teams'? {id: Date.now().toString(), name:'', shortName:''} :
                  type==='players'? {id: Date.now().toString(), name:'', teamId: DB.teams[0]?.id, position:'FW'} :
                  type==='matches'? {id: Date.now().toString(), homeTeamId: DB.teams[0]?.id, awayTeamId: DB.teams[1]?.id, status:'Scheduled', date:''} :
                  {id: Date.now().toString(), title:'', content:''}
    setEditing({type, id: 'new'})
    setForm(blank)
  }

  const save = () => {
    const newDB = {...DB}
    if(editing.id === 'new'){
      newDB[tab] = [...newDB[tab], form]
    } else {
      newDB[tab] = newDB[tab].map(i=> i.id===editing.id? form : i)
    }
    saveData(newDB)
    setEditing(null); showToast('Saved')
  }

  const del = (id) => {
    if(!confirm('Delete?')) return
    const newDB = {...DB, [tab]: DB[tab].filter(i=>i.id!==id)}
    saveData(newDB); showToast('Deleted')
  }

  if(!adminAuthed){
    return (
      <div className="max-w- mx-auto px-6 py-20">
        <h1 className="font-barlow text- font-bold text-center">Admin Login</h1>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full mt-6 border p-3 rounded- text-" />
        <button onClick={login} className="w-full mt-3 bg-[#0E3B2E] text-white py-3 rounded- text- font-bold">Login</button>
        <p className="text- text-center mt-3">Default: admin123</p>
      </div>
    )
  }

  return (
    <div className="max-w- mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-barlow text- font-bold">Admin</h1>
        <button onClick={()=>setAdminAuthed(false)} className="text- border px-3 py-1 rounded-">Logout</button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {['teams','players','matches','news'].map(t=>(
          <button key={t} onClick={()=>{setTab(t); setEditing(null)}} className={`px-4 py-2 rounded- text- font-bold capitalize ${tab===t?'bg-[#0E3B2E] text-white':'bg-[#E9E4D2]'}`}>{t}</button>
        ))}
        <button onClick={()=>openAdd(tab)} className="ml-auto bg-[#C7A344] px-4 py-2 rounded- text- font-bold">+ Add {tab}</button>
      </div>

      {/* EDIT FORM - THIS IS THE FORM THAT WAS NOT OPENING */}
      {editing && (
        <div className="bg-white border p-6 rounded- mb-6">
          <h2 className="font-bold text- mb-4">{editing.id==='new'?'Add':'Edit'} {tab}</h2>
          <div className="grid gap-3">
            {Object.keys(form).slice(0,6).map(key=>(
              <div key={key}>
                <label className="text- tracking-">{key}</label>
                <input value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full border p-2 rounded- text- mt-1" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="bg-[#0E3B2E] text-white px-6 py-2 rounded- text- font-bold">Save</button>
            <button onClick={()=>setEditing(null)} className="border px-6 py-2 rounded- text-">Cancel</button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-2">
        {DB[tab].map(item=>(
          <div key={item.id} className="bg-white border p-4 rounded- flex justify-between items-center">
            <div className="text-"><b>{item.name || item.title || item.id}</b> <span className="text-[#2A3532] text-"> - {item.id}</span></div>
            <div className="flex gap-2">
              <button onClick={()=>openEdit(tab,item)} className="text- bg-[#E9E4D2] px-3 py-1 rounded-">Edit</button>
              <button onClick={()=>del(item.id)} className="text- bg-red-100 text-red-600 px-3 py-1 rounded-">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}