import { NavLink } from 'react-router-dom'

const links = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Players', path: '/admin/players' },
  { name: 'Teams', path: '/admin/teams' },
  { name: 'Matches', path: '/admin/matches' },
  { name: 'Competitions', path: '/admin/competitions' },
  { name: 'News', path: '/admin/news' },
  { name: 'Settings', path: '/admin/settings' },
]

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#123B2A] text-white p-5">

      {/* Logo / Club Name */}
      <div className="mb-8 pb-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-[#1E7245] flex items-center justify-center text-xl">
            ⚽
          </div>

          <div>
            <h1 className="text-lg font-bold">
              Sindhuli FC
            </h1>

            <p className="text-xs text-white/60">
              Football Clubhouse
            </p>
          </div>

        </div>

        <p className="text-sm text-white/60 mt-4">
          Manager Panel
        </p>

      </div>

      {/* Navigation */}
      <nav className="space-y-1">

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-[#1E7245] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}

      </nav>

      {/* Bottom Info */}
      <div className="mt-10 pt-5 border-t border-white/10">

        <p className="text-xs text-white/40">
          Sindhuli Football Clubhouse
        </p>

        <p className="text-xs text-white/40 mt-1">
          Manage. Play. Connect.
        </p>

      </div>

    </aside>
  )
}