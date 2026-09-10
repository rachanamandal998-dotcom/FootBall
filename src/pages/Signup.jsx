import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthAlert, AuthShell, PasswordField, authInputClass } from "../components/AuthForm.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Confirm password must match password.");
      return;
    }

    setLoading(true);
    try {
      const data = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(data.msg || "Account created successfully.");
      const dest = data.user?.role === "admin" ? "/admin" : "/";
      setTimeout(() => navigate(dest, { replace: true }), 700);
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join Sindhuli Football Clubhouse"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#1E7245] hover:underline">
            Login
          </Link>
        </>
      }
    >
      <AuthAlert type="error">{error}</AuthAlert>
      <AuthAlert type="success">{success}</AuthAlert>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-semibold text-[#123B2A] mb-2">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
            className={authInputClass}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-[#123B2A] mb-2">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            className={authInputClass}
            placeholder="john@example.com"
          />
        </div>
        <PasswordField
          id="signup-password"
          label="Password"
          value={form.password}
          onChange={set("password")}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0E3B2E] hover:bg-[#1E7245] text-white py-3 rounded-lg font-bold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
