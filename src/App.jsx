import { Routes, Route } from 'react-router-dom'
import PublicRouter from './router/PublicRouter.jsx'
import Admin from './pages/Admin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import Players from './admin/Players.jsx'
import Matches from './admin/Matches.jsx'
import Competitions from './admin/Competitions.jsx'
import News from './admin/News.jsx'
import Settings from './admin/Settings.jsx'
import AdminTeams from './admin/AdminTeams.jsx'
import Injuries from './admin/Injuries.jsx'
import Training from './admin/Training.jsx'
import Users from './admin/Users.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="players" element={<Players />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="matches" element={<Matches />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="news" element={<News />} />
          <Route path="injuries" element={<Injuries />} />
          <Route path="training" element={<Training />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/*" element={<PublicRouter />} />
    </Routes>
  )
}
