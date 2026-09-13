import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiSearch } from "../api/client.js";
import { playerName } from "../utils/helpers.js";

export default function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setHits(await apiSearch(q.trim()));
        setOpen(true);
      } catch {
        setHits(null);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  const go = (path) => {
    navigate(path);
    setQ("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => hits && setOpen(true)}
        placeholder="Search players, teams, matches..."
        className="w-52 xl:w-72 bg-white/10 text-ivory placeholder:text-white/40 rounded-full px-4 py-1.5 text-sm outline-none border border-white/10 focus:border-gold/50"
      />
      {open && hits && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-charcoal rounded-xl shadow-2xl overflow-hidden z-50">
          {["players", "teams", "matches", "competitions", "news"].map((key) =>
            (hits[key] || []).length ? (
              <div key={key} className="border-b border-black/5">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-ink/50">{key}</div>
                {(hits[key] || []).slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-ivory"
                    onMouseDown={() =>
                      go(
                        key === "players"
                          ? `/players/${item.id}`
                          : key === "teams"
                            ? `/teams/${item.id}`
                            : key === "matches"
                              ? `/matches/${item.id}`
                              : key === "competitions"
                                ? `/competitions/${item.id}`
                                : `/news/${item.id}`,
                      )
                    }
                  >
                    {item.title || item.name || playerName(item) || item.stadium || item.id}
                  </button>
                ))}
              </div>
            ) : null,
          )}
          {!Object.values(hits).some((arr) => arr?.length) && (
            <div className="px-3 py-4 text-sm text-ink/60">No matches found.</div>
          )}
        </div>
      )}
    </div>
  );
}
