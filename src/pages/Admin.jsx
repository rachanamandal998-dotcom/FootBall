import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'

export default function Admin(){
  const { DB, adminAuthed, setAdminAuthed, showToast } = useData()
  const [pass, setPass] = useState('')

  const login = (e) => {
    e?.preventDefault()
    if(pass === (DB.meta?.adminPass || 'admin123')){
      setAdminAuthed(true)
      showToast('Admin login success')
    } else {
      showToast('Wrong password', true)
    }
  }

  if(!adminAuthed){
    return (
      <div className="min-h-screen bg-[#F5F2E8] flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="font-barlow text-3xl font-bold text-[#123B2A] text-center">Admin Login</h1>
          <p className="text-sm text-gray-500 text-center mt-2">Sindhuli Football Clubhouse</p>
          <input
            type="password"
            value={pass}
            onChange={e=>setPass(e.target.value)}
            placeholder="Password"
            className="w-full mt-6 border border-gray-300 p-3 rounded-lg"
            autoFocus
          />
          <button type="submit" className="w-full mt-3 bg-[#0E3B2E] text-white py-3 rounded-lg font-bold">
            Login
          </button>
          <p className="text-sm text-center mt-3 text-gray-500">Default: admin123</p>
        </form>
      </div>
    )
  }

  return <Outlet />
}
