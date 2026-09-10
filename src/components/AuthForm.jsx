import { useState } from "react";
import { Link } from "react-router-dom";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[#0E3B2E] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#C7A344]/10" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-[#1E7245]/40" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#E4CD8A] bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)]" />
          <p className="mt-3 text-[#E4CD8A] text-xs tracking-[0.2em] font-semibold">
            SINDHULI FC CLUBHOUSE
          </p>
        </div>

        <div className="bg-[#F5F2E8] rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123B2A] text-center">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-gray-600 text-center mt-2">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-gray-600">{footer}</div> : null}
        </div>

        <p className="text-center text-[#E9E4D2]/70 text-xs mt-5">
          <Link to="/" className="hover:text-[#E4CD8A]">
            ← Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}

export function PasswordField({ id, label, value, onChange, autoComplete, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#123B2A] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 bg-white"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#1E7245]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function AuthAlert({ type, children }) {
  if (!children) return null;
  const isError = type === "error";
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm mb-4 ${
        isError ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-[#0E3B2E] border border-emerald-200"
      }`}
    >
      {children}
    </div>
  );
}

export const authInputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 bg-white";
