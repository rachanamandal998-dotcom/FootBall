import { useState } from "react";
import { apiUpload } from "../api/client.js";

export const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-[#12181A] focus:outline-none focus:ring-2 focus:ring-[#1E7245]/30 focus:border-[#1E7245]";

export function Field({ label, hint, full, children }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-semibold text-[#123B2A] mb-2">{label}</label>
      {children}
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}

export function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  return (
    <Field label={label} full>
      {value ? <img src={value} alt="" className="w-24 h-24 object-cover rounded mb-2" /> : null}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const data = await apiUpload(file);
            onChange(data.url);
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <p className="text-xs mt-1">Uploading...</p>}
    </Field>
  );
}

export function FormShell({ title, onSubmit, onCancel, saving, children }) {
  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-5 mb-6">
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
      <div className="flex gap-2 mt-5">
        <button disabled={saving} className="bg-pitch text-white px-4 py-2 rounded font-semibold disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}

export function PageHeader({ title, count, onAdd, addLabel }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="font-display text-4xl text-pitch">{title}</h1>
        <p className="text-sm text-ink/60">{count} records</p>
      </div>
      {onAdd && <button onClick={onAdd} className="bg-pitch text-white px-4 py-2 rounded font-semibold">{addLabel}</button>}
    </div>
  );
}
