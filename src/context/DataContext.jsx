import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiCreate, apiDelete, apiGetAllCollections, apiStats, apiUpdate } from "../api/client.js";
import { ageFromDOB } from "../utils/helpers.js";
import { useAuth } from "./AuthContext.jsx";

export const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataContext.Provider");
  return ctx;
};

function ensure(d = {}) {
  return {
    teams: d.teams || [],
    players: d.players || [],
    matches: d.matches || [],
    competitions: d.competitions || [],
    news: d.news || [],
    injuries: d.injuries || [],
    training: d.training || [],
    reports: d.reports || [],
    staff: d.staff || [],
    transfers: d.transfers || [],
    contracts: d.contracts || [],
    stadiums: d.stadiums || [],
  };
}

function computeStandings(comp, matches) {
  if (!comp) return [];
  const win = comp.pointsWin ?? 3;
  const draw = comp.pointsDraw ?? 1;
  const loss = comp.pointsLoss ?? 0;
  const rows = {};
  (comp.teamIds || []).forEach((tid) => {
    rows[tid] = { teamId: tid, played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
  });
  const seen = new Set();
  matches
    .filter((m) => m.compId === comp.id && m.status === "Finished")
    .forEach((m) => {
      const key = m.id;
      if (seen.has(key)) return;
      seen.add(key);
      const h = rows[m.homeTeamId];
      const a = rows[m.awayTeamId];
      if (!h || !a) return;
      h.played += 1;
      a.played += 1;
      h.gf += m.homeScore || 0;
      h.ga += m.awayScore || 0;
      a.gf += m.awayScore || 0;
      a.ga += m.homeScore || 0;
      if (m.homeScore > m.awayScore) {
        h.won += 1;
        a.lost += 1;
        h.pts += win;
        a.pts += loss;
      } else if (m.homeScore < m.awayScore) {
        a.won += 1;
        h.lost += 1;
        a.pts += win;
        h.pts += loss;
      } else {
        h.draw += 1;
        a.draw += 1;
        h.pts += draw;
        a.pts += draw;
      }
    });
  return Object.values(rows)
    .map((r) => ({ ...r, gd: r.gf - r.ga }))
    .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf)
    .map((r, i) => ({ ...r, position: i + 1 }));
}

function computePlayerStats(player, matches) {
  const s = { apps: 0, starts: 0, minutes: 0, goals: 0, assists: 0, yellow: 0, red: 0, cleanSheets: 0 };
  const pid = player.id;
  const isKeeper = String(player.position || "").toLowerCase().includes("goal");
  matches.forEach((m) => {
    if (!["Finished", "Live", "Half Time", "Abandoned"].includes(m.status)) return;
    const xiH = m.lineups?.home?.startingXI || [];
    const xiA = m.lineups?.away?.startingXI || [];
    const subH = m.lineups?.home?.substitutes || [];
    const subA = m.lineups?.away?.substitutes || [];
    const started = xiH.includes(pid) || xiA.includes(pid);
    const benched = subH.includes(pid) || subA.includes(pid);
    const onTeam = m.homeTeamId === player.teamId || m.awayTeamId === player.teamId;
    const cameOn = (m.events || []).some((ev) => ev.type === "sub" && ev.playerOnId === pid);
    const involved = started || cameOn || (!(xiH.length + xiA.length) && onTeam);
    if (!involved && !benched && !(m.events || []).some((ev) => [ev.playerId, ev.scorerId, ev.assistId, ev.playerOffId, ev.playerOnId].includes(pid))) {
      return;
    }
    if (involved) {
      s.apps += 1;
      if (started || (!(xiH.length + xiA.length) && onTeam)) {
        s.starts += 1;
        s.minutes += 90;
      } else if (cameOn) {
        const ev = (m.events || []).find((e) => e.type === "sub" && e.playerOnId === pid);
        s.minutes += Math.max(1, 90 - (ev?.minute || 70));
      }
    }
    (m.events || []).forEach((ev) => {
      const who = ev.playerId || ev.scorerId;
      if (ev.type === "goal" && ev.goalType !== "Own Goal" && who === pid) s.goals += 1;
      if (ev.assistId === pid) s.assists += 1;
      if (ev.type === "yellow" && who === pid) s.yellow += 1;
      if (ev.type === "red" && who === pid) s.red += 1;
    });
    if (isKeeper && m.status === "Finished" && (started || involved)) {
      const conceded = m.homeTeamId === player.teamId ? m.awayScore : m.homeScore;
      if (Number(conceded) === 0) s.cleanSheets += 1;
    }
  });
  return s;
}

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [DB, setDB] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [statsBundle, setStatsBundle] = useState(null);

  const load = useCallback(async () => {
    const remote = await apiGetAllCollections();
    setDB(ensure(remote));
    try {
      setStatsBundle(await apiStats());
    } catch {
      setStatsBundle(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setDB(ensure());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load, isAuthenticated]);

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr });
    setTimeout(() => setToast(null), 2800);
  };

  const refresh = async () => {
    try {
      await load();
    } catch (err) {
      showToast(err.message || "Could not refresh data", true);
    }
  };

  const createRecord = async (collection, record) => {
    const saved = await apiCreate(collection, record);
    await load();
    return saved;
  };

  const updateRecord = async (collection, id, record) => {
    const saved = await apiUpdate(collection, id, record);
    await load();
    return saved;
  };

  const deleteRecord = async (collection, id) => {
    await apiDelete(collection, id);
    await load();
  };

  const team = (id) => DB?.teams.find((t) => t.id === id);
  const player = (id) => DB?.players.find((p) => p.id === id);
  const teamPlayers = (id) => DB?.players.filter((p) => p.teamId === id) || [];

  const standingsFor = (compId) => {
    if (!DB) return [];
    const comp = DB.competitions.find((c) => c.id === compId);
    return computeStandings(comp, DB.matches);
  };

  const playerStats = (pid) => {
    if (!DB) return { apps: 0, starts: 0, minutes: 0, goals: 0, assists: 0, yellow: 0, red: 0, cleanSheets: 0 };
    const p = DB.players.find((x) => x.id === pid);
    if (!p) return { apps: 0, starts: 0, minutes: 0, goals: 0, assists: 0, yellow: 0, red: 0, cleanSheets: 0 };
    return computePlayerStats(p, DB.matches);
  };

  const leagueLeaders = (key, n = 5) => {
    if (!DB) return [];
    return DB.players
      .map((p) => ({ p, s: playerStats(p.id) }))
      .sort((a, b) => (b.s[key] || 0) - (a.s[key] || 0))
      .filter((x) => x.s[key] > 0)
      .slice(0, n);
  };

  const value = useMemo(
    () => ({
      DB,
      refresh,
      createRecord,
      updateRecord,
      deleteRecord,
      team,
      player,
      teamPlayers,
      standingsFor,
      playerStats,
      leagueLeaders,
      navOpen,
      setNavOpen,
      showToast,
      toast,
      statsBundle,
      ageFromDOB,
    }),
    [DB, navOpen, toast, statsBundle],
  );

  if (!DB) {
    return (
      <div className="min-h-screen bg-pitch text-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
          <p className="font-display text-2xl tracking-wide">Loading Sindhuli Football Clubhouse</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[300] px-4 py-3 rounded-lg text-sm shadow-xl text-ivory bg-charcoal border-l-4 ${
            toast.isErr ? "border-l-[#A6372B]" : "border-l-turf"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </DataContext.Provider>
  );
}
