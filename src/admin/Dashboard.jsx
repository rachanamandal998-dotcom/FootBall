import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { apiDashboard } from "../api/client.js";
import { fmtDate } from "../utils/helpers.js";

export default function Dashboard() {
  const { DB, team } = useData();
  const [dash, setDash] = useState(null);
  useEffect(() => {
    apiDashboard().then(setDash).catch(() => setDash(null));
  }, [DB]);

  const totals = dash?.totals || {
    players: DB.players.length,
    teams: DB.teams.length,
    upcoming: DB.matches.filter((m) => m.status === "Scheduled").length,
    completed: DB.matches.filter((m) => m.status === "Finished").length,
    injured: (DB.injuries || []).filter((i) => ["Injured", "Recovering"].includes(i.status)).length,
    competitions: DB.competitions.length,
    newReports: (DB.reports || []).filter((r) => r.status === "New").length,
  };
  const next = dash?.nextMatch || DB.matches.filter((m) => m.status === "Scheduled").sort((a, b) => a.date.localeCompare(b.date))[0];
  const cards = [
    ["Total Players", totals.players, "/admin/players"],
    ["Total Teams", totals.teams, "/admin/teams"],
    ["Upcoming Matches", totals.upcoming, "/admin/matches"],
    ["Completed Matches", totals.completed, "/admin/matches"],
    ["Injured Players", totals.injured, "/admin/injuries"],
    ["Active Competitions", totals.competitions, "/admin/competitions"],
    ["New Reports", totals.newReports, "/admin/reports"],
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-display text-4xl text-pitch">Dashboard</h1>
      <p className="text-ink/70 mt-1">Football in Sindhuli, managed professionally.</p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {cards.map(([title, value, link]) => (
          <Link key={title} to={link} className="bg-white border rounded-xl p-5 hover:shadow-md">
            <p className="text-sm text-ink/60">{title}</p>
            <p className="font-display text-4xl text-pitch mt-1">{value}</p>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-8">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-display text-2xl">Next match</h2>
          {next ? (
            <p className="mt-3 font-semibold">{team(next.homeTeamId)?.name} vs {team(next.awayTeamId)?.name}<span className="block text-sm font-normal text-ink/60">{fmtDate(next.date)} · {next.time} · {next.stadium}</span></p>
          ) : <p className="text-ink/50 mt-3">No upcoming matches.</p>}
        </div>
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-display text-2xl">Alerts</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(dash?.alerts || []).length ? dash.alerts.map((a) => <li key={a} className="bg-gold/15 px-3 py-2 rounded">{a}</li>) : <li className="text-ink/50">No alerts right now.</li>}
          </ul>
        </div>
      </div>
      <div className="bg-white border rounded-xl p-5 mt-5">
        <h2 className="font-display text-2xl">Recent activity</h2>
        <ul className="mt-3 text-sm divide-y">
          {(dash?.activity || []).map((a) => (
            <li key={a.id || a._id} className="py-2 flex justify-between"><span>{a.message}</span><span className="text-ink/40">{fmtDate(a.createdAt)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
