import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ManagerLogin({ expired }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(expired ? "Session expired. Please sign in again." : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!email.trim() || !password) {
      setError("Manager ID / email and password are required.");
      return;
    }
    if (email.includes("@") && !EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-glow pitch-lines flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-ivory/95 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-pitch text-ivory px-8 py-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-gold bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)] animate-spin-slow" />
          <h1 className="font-display text-3xl font-extrabold mt-4 tracking-wide">Manager Login</h1>
          <p className="text-gold-soft text-sm mt-2">Sindhuli Football Clubhouse</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
          {error ? (
            <div className="bg-[#A6372B]/10 text-[#A6372B] text-sm rounded-lg px-3 py-2">{error}</div>
          ) : (
            <p className="text-sm text-ink/70">Authorized staff only. There is no public sign up.</p>
          )}
          <label className="block">
            <span className="text-sm font-semibold text-pitch">Manager ID / Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-turf/40"
              placeholder="admin@sindhulifc.local"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-pitch">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-turf/40"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pitch hover:bg-turf text-white py-3 rounded-lg font-bold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in...
              </>
            ) : (
              "Enter dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
