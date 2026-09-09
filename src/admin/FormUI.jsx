import { useState } from "react";

export const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-[#12181A] focus:outline-none focus:ring-2 focus:ring-[#1E7245]/30 focus:border-[#1E7245]";

export const mutedInputClass = `${inputClass} bg-gray-100 text-gray-600 cursor-not-allowed`;

export function Field({ label, hint, full, children }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-semibold text-[#123B2A] mb-2">{label}</label>
      {children}
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}

export function IdField({ value }) {
  return (
    <Field label="ID" hint="Generated automatically" full>
      <input value={value || "Will be generated on save"} disabled className={mutedInputClass} />
    </Field>
  );
}

export function SearchSelect({ value, onChange, options, placeholder = "Search and select..." }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((o) => String(o.value) === String(value));
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative">
      <input
        className={inputClass}
        placeholder={placeholder}
        value={open ? query : selected?.label || ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
      />
      {open && (
        <div className="absolute z-30 w-full mt-1 max-h-52 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            type="button"
            className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
            onMouseDown={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}
          >
            {placeholder}
          </button>
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
          )}
          {filtered.map((o) => (
            <button
              type="button"
              key={o.value}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-[#E8F4EE] ${
                String(o.value) === String(value) ? "bg-[#E8F4EE] font-semibold" : ""
              }`}
              onMouseDown={() => {
                onChange(o.value);
                setOpen(false);
                setQuery("");
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormShell({ title, onSubmit, onCancel, children, saving }) {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#123B2A] mb-5">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1E7245] hover:bg-[#123B2A] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 px-6 py-3 rounded-lg font-semibold text-[#123B2A] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PageHeader({ title, count, onAdd, addLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
      <h1 className="text-3xl font-bold text-[#123B2A]">
        {title}
        {typeof count === "number" ? (
          <span className="text-lg font-semibold text-gray-500 ml-2">({count})</span>
        ) : null}
      </h1>
      <button
        onClick={onAdd}
        className="bg-[#123B2A] hover:bg-[#1E7245] text-white px-5 py-2.5 rounded-lg text-sm font-bold"
      >
        {addLabel}
      </button>
    </div>
  );
}

export function ListCard({ title, subtitle, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <b className="text-[#123B2A]">{title}</b>
        {subtitle ? <div className="text-sm text-gray-500 mt-1">{subtitle}</div> : null}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="border border-[#1E7245] text-[#1E7245] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#E8F4EE]"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="border border-red-500 text-red-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
