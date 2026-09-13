import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import Matches from "./pages/Matches.jsx";
import MatchDetails from "./pages/MatchDetails.jsx";
import Standings from "./pages/Standings.jsx";
import Players from "./pages/Players.jsx";
import PlayerProfile from "./pages/PlayerProfile.jsx";
import Teams from "./pages/Teams.jsx";
import TeamProfile from "./pages/TeamProfile.jsx";
import Competitions from "./pages/Competitions.jsx";
import CompetitionProfile from "./pages/CompetitionProfile.jsx";
import News from "./pages/News.jsx";
import NewsItem from "./pages/NewsItem.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import AdminPlayers from "./admin/Players.jsx";
import AdminTeams from "./admin/AdminTeams.jsx";
import AdminMatches from "./admin/Matches.jsx";
import AdminCompetitions from "./admin/Competitions.jsx";
import AdminStandings from "./admin/AdminStandings.jsx";
import Staff from "./admin/Staff.jsx";
import Training from "./admin/Training.jsx";
import Injuries from "./admin/Injuries.jsx";
import Transfers from "./admin/Transfers.jsx";
import Contracts from "./admin/Contracts.jsx";
import AdminNews from "./admin/News.jsx";
import Reports from "./admin/Reports.jsx";
import Statistics from "./admin/Statistics.jsx";
import Settings from "./admin/Settings.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="matches" element={<AdminMatches />} />
          <Route path="competitions" element={<AdminCompetitions />} />
          <Route path="standings" element={<AdminStandings />} />
          <Route path="staff" element={<Staff />} />
          <Route path="training" element={<Training />} />
          <Route path="injuries" element={<Injuries />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchDetails />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerProfile />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamProfile />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:id" element={<CompetitionProfile />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsItem />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
