import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { fmtDate } from "../utils/helpers.js";

export default function Reports() {
  const { DB, updateRecord, showToast } = useData();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const rows = useMemo(() => (DB.reports || []).filter((r) => {
    if (status && r.status !== status) return false;
    if (category && r.category !== category) return false;
    if (q && !`${r.name} ${r.subject} ${r.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [DB.reports, status, category, q]);
  const setStatusOf = async (r, next) => {
    try {
      await updateRecord("reports", r.id, { ...r, status: next, reviewedAt: new Date().toISOString() });
      showToast(next === "Resolved" ? "Report marked as resolved." : `Report marked as ${next}.`);
    } catch (err) { showToast(err.message, true); }
  };
  const saveNotes = async (r, notes) => {
    await updateRecord("reports", r.id, { ...r, managerNotes: notes });
    showToast("Manager notes saved.");
  };
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-display text-4xl text-pitch">Reports</h1>
      <p className="text-sm text-ink/60 mb-4">New reports: {(DB.reports || []).filter((r) => r.status === "New").length}</p>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input className="border rounded px-3 py-2" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{["New","In Review","Resolved","Archived"].map((s) => <option key={s}>{s}</option>)}</select>
        <select className="border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{["General Contact","Match Report","Player Report","Team Report","Website Issue","Correction Request","Community Feedback","Other"].map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="bg-white border rounded-xl divide-y">
        {rows.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex justify-between gap-3">
              <button className="text-left" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <b>{r.subject}</b>
                <div className="text-sm text-ink/60">{r.name} · {r.category} · {r.status} · {fmtDate(r.createdAt)}</div>
              </button>
              <div className="flex flex-wrap gap-1">
                <button className="text-xs border px-2 py-1" onClick={() => setStatusOf(r, "In Review")}>In Review</button>
                <button className="text-xs border px-2 py-1" onClick={() => setStatusOf(r, "Resolved")}>Resolved</button>
                <button className="text-xs border px-2 py-1" onClick={() => setStatusOf(r, "Archived")}>Archive</button>
              </div>
            </div>
            {open === r.id && (
              <div className="mt-3 text-sm bg-ivory p-3">
                <p>{r.message}</p>
                <p className="mt-2 text-ink/60">{r.email} {r.phone}</p>
                <textarea className="w-full border rounded mt-3 p-2" defaultValue={r.managerNotes} placeholder="Private manager notes" onBlur={(e) => saveNotes(r, e.target.value)} />
              </div>
            )}
          </div>
        ))}
        {!rows.length && <div className="p-6 text-ink/50">No reports received.</div>}
      </div>
    </div>
  );
}
