import { Routes, Route } from 'react-router-dom'
import PublicRouter from './router/PublicRouter.jsx'
import AdminRouter from './router/AdminRouter.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { GuestRoute } from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/*" element={<PublicRouter />} />
    </Routes>
  )
}
