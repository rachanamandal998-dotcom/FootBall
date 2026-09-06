import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'

import Home from '../pages/Home.jsx'
import Matches from '../pages/Matches.jsx'
import MatchDetails from '../pages/MatchDetails.jsx'
import Standings from '../pages/Standings.jsx'
import Players from '../pages/Players.jsx'
import PlayerProfile from '../pages/PlayerProfile.jsx'
import Teams from '../pages/Teams.jsx'
import TeamProfile from '../pages/TeamProfile.jsx'
import Competitions from '../pages/Competitions.jsx'
import CompetitionProfile from '../pages/CompetitionProfile.jsx'
import News from '../pages/News.jsx'
import NewsItem from '../pages/NewsItem.jsx'


export default function PublicRouter(){
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchDetails />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/players" element={<Players/>} />
        <Route path="/players/:id" element={<PlayerProfile />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamProfile />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:id" element={<CompetitionProfile />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsItem />} />
      </Route>
    </Routes>
  )
}