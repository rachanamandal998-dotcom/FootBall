import { useState } from "react";
import { apiCreate } from "../api/client.js";

const CATS = ["General Contact", "Match Report", "Player Report", "Team Report", "Website Issue", "Correction Request", "Community Feedback", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", category: "General Contact" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiCreate("reports", form);
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not send your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-display text-5xl">Contact / Report</h1>
        <p className="text-ink/70 mt-2">No account needed. Send a message to the clubhouse team.</p>
        {done ? (
          <div className="mt-8 bg-white border border-turf/30 p-8 text-center">
            <div className="text-4xl mb-3">⚽</div>
            <h2 className="font-display text-3xl">Thank you. Your message has been received.</h2>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 bg-white border p-6 space-y-4">
            {error && <div className="text-sm text-[#A6372B]">{error}</div>}
            <input required value={form.name} onChange={set("name")} placeholder="Name" className="w-full border px-3 py-2 rounded" />
            <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" className="w-full border px-3 py-2 rounded" />
            <input value={form.phone} onChange={set("phone")} placeholder="Phone (optional)" className="w-full border px-3 py-2 rounded" />
            <select value={form.category} onChange={set("category")} className="w-full border px-3 py-2 rounded">
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input required value={form.subject} onChange={set("subject")} placeholder="Subject" className="w-full border px-3 py-2 rounded" />
            <textarea required value={form.message} onChange={set("message")} placeholder="Message" rows={5} className="w-full border px-3 py-2 rounded" />
            <button disabled={loading} className="bg-pitch text-white px-5 py-3 rounded font-semibold disabled:opacity-60">{loading ? "Sending..." : "Send message"}</button>
          </form>
        )}
      </div>
    </section>
  );
}
