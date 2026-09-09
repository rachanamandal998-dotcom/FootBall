import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F5F2E8] flex">

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-6 md:p-8">
        <Outlet />
      </main>

    </div>
  )
}