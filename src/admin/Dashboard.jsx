import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'

export default function Dashboard() {
  const { DB } = useData()

  const players = DB?.players || []
  const teams = DB?.teams || []
  const matches = DB?.matches || []
  const news = DB?.news || []
  const competitions = DB?.competitions || []

  const upcomingMatches = matches.filter(
    (match) =>
      match.status === 'Scheduled' ||
      match.status === 'Upcoming'
  )

  const recentMatches = [...matches]
    .sort((a, b) => {
      return new Date(b.date || 0) - new Date(a.date || 0)
    })
    .slice(0, 5)

  const stats = [
    {
      title: 'Players',
      value: players.length,
      link: '/admin/players',
    },
    {
      title: 'Teams',
      value: teams.length,
      link: '/admin/teams',
    },
    {
      title: 'Upcoming Matches',
      value: upcomingMatches.length,
      link: '/admin/matches',
    },
    {
      title: 'News',
      value: news.length,
      link: '/admin/news',
    },
  ]

  const getTeamName = (teamId) => {
    const team = teams.find(
      (team) => String(team.id) === String(teamId)
    )

    return team?.name || 'Unknown Team'
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#123B2A]">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-1">
          Manage Sindhuli Football Clubhouse
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">
              {stat.title}
            </p>

            <h2 className="text-3xl font-bold text-[#123B2A] mt-2">
              {stat.value}
            </h2>

            <p className="text-sm text-[#1E7245] mt-3">
              Manage →
            </p>
          </Link>
        ))}

      </div>

      {/* Welcome */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <h2 className="text-xl font-bold text-[#123B2A]">
          Welcome, Manager
        </h2>

        <p className="text-gray-600 mt-2">
          Use the sidebar to manage players, teams, matches,
          competitions and club news.
        </p>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">

        <h2 className="text-xl font-bold text-[#123B2A] mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <Link
            to="/admin/players"
            className="bg-[#123B2A] text-white rounded-xl p-5 hover:bg-[#1E7245] transition"
          >
            <div className="text-2xl mb-2">⚽</div>

            <h3 className="font-bold">
              Add Player
            </h3>

            <p className="text-sm text-gray-200 mt-1">
              Register a new club player
            </p>
          </Link>

          <Link
            to="/admin/teams"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">👥</div>

            <h3 className="font-bold text-[#123B2A]">
              Manage Teams
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Create and manage club teams
            </p>
          </Link>

          <Link
            to="/admin/matches"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🏟️</div>

            <h3 className="font-bold text-[#123B2A]">
              Add Match
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Create a fixture or update a result
            </p>
          </Link>

          <Link
            to="/admin/news"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📰</div>

            <h3 className="font-bold text-[#123B2A]">
              Create News
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Publish club news and announcements
            </p>
          </Link>

        </div>

      </div>

      {/* Upcoming Matches */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-xl font-bold text-[#123B2A]">
              Upcoming Matches
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Next scheduled fixtures
            </p>
          </div>

          <Link
            to="/admin/matches"
            className="text-sm font-semibold text-[#1E7245]"
          >
            View All →
          </Link>

        </div>

        {upcomingMatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming matches.
          </div>
        ) : (
          <div className="space-y-3">

            {upcomingMatches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="border border-gray-100 rounded-lg p-4"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                  <div>
                    <p className="font-semibold text-[#123B2A]">
                      {getTeamName(match.homeTeamId)}
                      <span className="mx-2 text-gray-400">
                        vs
                      </span>
                      {getTeamName(match.awayTeamId)}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {match.date || 'Date not set'}

                      {match.time && (
                        <span> • {match.time}</span>
                      )}

                      {match.venue && (
                        <span> • {match.venue}</span>
                      )}
                    </p>
                  </div>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                    {match.status || 'Scheduled'}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Recent Matches */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-xl font-bold text-[#123B2A]">
              Recent Matches
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest match activity
            </p>
          </div>

          <Link
            to="/admin/matches"
            className="text-sm font-semibold text-[#1E7245]"
          >
            Manage Matches →
          </Link>

        </div>

        {recentMatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No match data available.
          </div>
        ) : (
          <div className="space-y-3">

            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-gray-100 last:border-0 pb-3 last:pb-0"
              >

                <div>
                  <p className="font-semibold text-[#123B2A]">
                    {getTeamName(match.homeTeamId)}
                    <span className="mx-2 text-gray-400">
                      vs
                    </span>
                    {getTeamName(match.awayTeamId)}
                  </p>

                  <p className="text-sm text-gray-500">
                    {match.date || 'No date'}
                  </p>
                </div>

                <div className="font-bold text-[#123B2A]">
                  {match.homeScore !== '' &&
                  match.homeScore !== undefined &&
                  match.awayScore !== '' &&
                  match.awayScore !== undefined
                    ? `${match.homeScore} - ${match.awayScore}`
                    : 'vs'}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Database Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-bold text-[#123B2A]">
            Club Overview
          </h2>

          <div className="mt-4 space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Players
              </span>

              <span className="font-semibold">
                {players.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Teams
              </span>

              <span className="font-semibold">
                {teams.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Competitions
              </span>

              <span className="font-semibold">
                {competitions.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                News Articles
              </span>

              <span className="font-semibold">
                {news.length}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-[#123B2A] rounded-xl p-6 shadow-sm text-white">

          <h2 className="text-lg font-bold">
            Sindhuli Football Clubhouse
          </h2>

          <p className="text-gray-200 mt-2">
            Manage. Play. Connect.
          </p>

          <p className="text-sm text-gray-300 mt-5">
            Your football management system is ready to
            manage club operations from one place.
          </p>

        </div>

      </div>

    </div>
  )
}