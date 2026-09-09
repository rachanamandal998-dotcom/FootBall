
import { Routes, Route } from 'react-router-dom'
import PublicRouter from './router/PublicRouter.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin/>} />
      <Route path="/*" element={<PublicRouter />} />
    </Routes>
  )
}

