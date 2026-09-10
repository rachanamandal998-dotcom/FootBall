import { Routes, Route } from 'react-router-dom'

import AdminLayout from '../admin/AdminLayout.jsx'
import Dashboard from '../admin/Dashboard.jsx'
import Players from '../admin/Players.jsx'
import Matches from '../admin/Matches.jsx'
import Competitions from '../admin/Competitions.jsx'
import News from '../admin/News.jsx'
import Settings from '../admin/Settings.jsx'
import AdminTeams from '../admin/AdminTeams.jsx'
import Injuries from '../admin/Injuries.jsx'
import Training from '../admin/Training.jsx'
import Users from '../admin/Users.jsx'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
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
    </Routes>
  )
}
