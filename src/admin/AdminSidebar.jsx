import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

const links = [
  ["Dashboard", "/admin"],
  ["Players", "/admin/players"],
  ["Teams", "/admin/teams"],
  ["Matches", "/admin/matches"],
  ["Competitions", "/admin/competitions"],
  ["Standings", "/admin/standings"],
  ["Staff", "/admin/staff"],
  ["Training", "/admin/training"],
  ["Injuries", "/admin/injuries"],
  ["Transfers", "/admin/transfers"],
  ["Contracts", "/admin/contracts"],
  ["News", "/admin/news"],
  ["Reports", "/admin/reports"],
  ["Statistics", "/admin/statistics"],
  ["Settings", "/admin/settings"],
];

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { DB } = useData();
  const navigate = useNavigate();
  const newReports = (DB.reports || []).filter((r) => r.status === "New").length;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-[#123B2A] text-white p-5 overflow-y-auto transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="mb-6 pb-4 border-b border-white/10">
          <h1 className="font-display text-xl font-extrabold">Sindhuli FC</h1>
          <p className="text-xs text-gold-soft">Manager dashboard</p>
          <p className="text-xs text-white/70 mt-2 truncate">{user?.name}</p>
        </div>
        <nav className="space-y-1">
          {links.map(([name, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              onClick={onClose}
              className={({ isActive }) => `flex items-center justify-between rounded-lg px-4 py-2.5 text-sm ${isActive ? "bg-turf" : "text-white/75 hover:bg-white/10"}`}
            >
              <span>{name}</span>
              {name === "Reports" && newReports > 0 && (
                <span className="bg-gold text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full">{newReports} New</span>
              )}
            </NavLink>
          ))}
        </nav>
        <button
          className="mt-8 w-full text-left px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 text-sm"
          onClick={async () => {
            await logout();
            navigate("/admin", { replace: true });
          }}
        >
          Sign out
        </button>
      </aside>
    </>
  );
}
