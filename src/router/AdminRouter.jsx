import { Routes, Route } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout.jsx";
import Dashboard from "../admin/Dashboard.jsx";
import Players from "../admin/Players.jsx";
import AdminTeams from "../admin/AdminTeams.jsx";
import Matches from "../admin/Matches.jsx";
import Competitions from "../admin/Competitions.jsx";
import AdminStandings from "../admin/AdminStandings.jsx";
import Staff from "../admin/Staff.jsx";
import Training from "../admin/Training.jsx";
import Injuries from "../admin/Injuries.jsx";
import Transfers from "../admin/Transfers.jsx";
import Contracts from "../admin/Contracts.jsx";
import News from "../admin/News.jsx";
import Reports from "../admin/Reports.jsx";
import Statistics from "../admin/Statistics.jsx";
import Settings from "../admin/Settings.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="players" element={<Players />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="matches" element={<Matches />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="standings" element={<AdminStandings />} />
          <Route path="staff" element={<Staff />} />
          <Route path="training" element={<Training />} />
          <Route path="injuries" element={<Injuries />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="news" element={<News />} />
          <Route path="reports" element={<Reports />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
