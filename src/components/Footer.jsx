import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-2xl font-extrabold">Sindhuli Football Clubhouse</div>
          <p className="text-gold-soft text-sm mt-1">Manage. Play. Connect.</p>
          <p className="text-white/60 text-sm mt-4">
            The home of district football in Sindhuli, Nepal — clubs, players, matches and community.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <Link to="/matches" className="block hover:text-gold-soft">Match Center</Link>
          <Link to="/standings" className="block hover:text-gold-soft">Standings</Link>
          <Link to="/players" className="block hover:text-gold-soft">Players</Link>
          <Link to="/news" className="block hover:text-gold-soft">News</Link>
        </div>
        <div className="text-sm text-white/60">
          <p>Sindhulimadi, Sindhuli</p>
          <p className="mt-2">Public visitors can browse freely. Managers enter through the private clubhouse path.</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/40 py-4">
        © {new Date().getFullYear()} Sindhuli Football Clubhouse
      </div>
    </footer>
  );
}
