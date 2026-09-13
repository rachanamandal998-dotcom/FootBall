import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import GlobalSearch from "./GlobalSearch.jsx";

const links = [
  ["/", "Home"],
  ["/matches", "Match Center"],
  ["/standings", "Standings"],
  ["/players", "Players"],
  ["/teams", "Teams"],
  ["/competitions", "Competitions"],
  ["/news", "News"],
  ["/contact", "Contact / Report"],
];

export default function Topbar() {
  const { navOpen, setNavOpen } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-pitch border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 text-ivory shrink-0">
          <div className="w-9 h-9 rounded-full border-2 border-gold-soft shrink-0 bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)] animate-spin-slow" />
          <div className="text-left leading-[1.05]">
            <b className="font-display font-extrabold text-[15px] tracking-[0.4px]">SINDHULI FOOTBALL CLUBHOUSE</b>
            <div className="text-[10px] text-gold-soft tracking-[0.6px]">MANAGE · PLAY · CONNECT</div>
          </div>
        </button>

        <nav
          className={`lg:flex items-center ${
            navOpen
              ? "flex flex-col absolute top-16 left-0 right-0 bg-pitch p-2 border-t border-white/10 shadow-xl"
              : "hidden"
          }`}
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 text-[13px] font-medium rounded-sm border-b-2 ${
                  isActive ? "text-gold-soft border-gold" : "text-[#E9E4D2] border-transparent hover:text-ivory"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block">
            <GlobalSearch />
          </div>
          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/15">
              <div className="w-8 h-8 rounded-full bg-turf text-ivory text-xs font-bold grid place-items-center">
                {(user.name || "M")[0]}
              </div>
              <div className="leading-tight mr-1">
                <div className="text-[12px] text-ivory font-semibold">{user.name}</div>
                <div className="text-[10px] text-gold-soft flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Manager · Online
                </div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="border border-white/30 text-ivory px-3 py-1.5 rounded-sm text-[12px] font-semibold hover:border-gold-soft hover:text-gold-soft"
              >
                Sign Out
              </button>
            </div>
          ) : null}
          <button className="lg:hidden text-ivory text-xl" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
