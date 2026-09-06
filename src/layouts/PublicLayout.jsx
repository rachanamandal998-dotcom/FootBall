import { Outlet } from 'react-router-dom'
import Topbar from '../components/Topbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout(){
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2E8]">
      <Topbar />
      <main className="flex-1">
        <Outlet /> {/* Your pages (Home, Matches, etc.) will render here */}
      </main>
      <Footer />
    </div>
  )
}