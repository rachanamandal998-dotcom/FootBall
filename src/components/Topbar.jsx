import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";

export default function Topbar() {
  const { navOpen, setNavOpen, adminAuthed, setAdminAuthed } = useData();
  const navigate = useNavigate();

  const links = [
    ["/", "Home"],
    ["/matches", "Match Center"],
    ["/standings", "Standings"],
    ["/players", "Players"],
    ["/teams", "Teams"],
    ["/competitions", "Competitions"],
    ["/news", "News"],
  ];

  if (adminAuthed) {
    return (
      <div className="sticky top-0 z-50 bg-[#0E3B2E] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#F5F2E8]">
            <div className="w-8 h-8 rounded-full border-2 border-[#E4CD8A] bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)] animate-spin-slow" />
            <b className="font-barlow font-extrabold text-base tracking-[0.3px]">
              SINDHULI FC CLUBHOUSE
            </b>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E9E4D2] text-xs hidden md:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A344]" />
              Admin Mode
            </span>
            <button
              onClick={() => {
                setAdminAuthed(false);
                navigate("/");
              }}
              className="border border-white/30 text-[#F5F2E8] px-4 py-2 rounded-sm text-[13px] font-semibold hover:border-[#E4CD8A] hover:text-[#E4CD8A] transition-colors"
            >
              Exit to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-[#0E3B2E] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-[#F5F2E8] cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-full border-2 border-[#E4CD8A] shrink-0 bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)] animate-spin-slow" />
          <div className="flex flex-col leading-[1.05]">
            <b className="font-barlow font-extrabold text-[15px] tracking-[0.3px]">
              SINDHULI FC CLUBHOUSE
            </b>
            <span className="text-[10px] text-[#E4CD8A] tracking-[0.5px]">
              MANAGE · PLAY · CONNECT
            </span>
          </div>
        </div>

        <nav
          className={`lg:flex items-center gap-0.5 ${
            navOpen
              ? "flex flex-col absolute top-16 left-0 right-0 bg-[#0E3B2E] p-2 border-t border-white/10 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.4)]"
              : "hidden"
          }`}
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 text-sm font-medium rounded-sm border-b-2 transition-colors ${
                  isActive
                    ? "text-[#E4CD8A] border-[#C7A344]"
                    : "text-[#E9E4D2] border-transparent hover:text-[#F5F2E8]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate("/admin")}
            className="bg-[#C7A344] hover:bg-[#E4CD8A] text-[#12181A] font-semibold text-[13.5px] px-4 py-2 rounded-sm transition-colors"
          >
            Manager Login
          </button>
          <button
            className="lg:hidden text-[#F5F2E8] text-xl leading-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
}