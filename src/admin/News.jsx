import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { ImageField } from "./FormUI.jsx";
const EMPTY = { title:"", image:"", content:"", author:"Sports Desk", category:"Community", date:"", status:"Published" };

export default function News() {
  const { DB, createRecord, updateRecord, deleteRecord, showToast } = useData();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return showToast("Title and content are required.", true);
    try {
      if (editing) await updateRecord("news", editing.id, form); else await createRecord("news", form);
      showToast(form.status === "Published" ? "News published." : "News saved.");
      setForm(null); setEditing(null);
    } catch (err) { showToast(err.message, true); }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6"><h1 className="font-display text-4xl text-pitch">News</h1><button className="bg-pitch text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ ...EMPTY, date: new Date().toISOString().slice(0,10) }); }}>+ Add</button></div>
      {form && (
        <form onSubmit={save} className="bg-white border rounded-xl p-5 mb-6 space-y-3">
          <input className="border rounded px-3 py-2 w-full" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <ImageField label="Featured image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <textarea className="border rounded px-3 py-2 w-full h-32" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="grid md:grid-cols-3 gap-3">
            <input className="border rounded px-3 py-2" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <select className="border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["Match","Team","Player","Transfer","Competition","Community"].map((c) => <option key={c}>{c}</option>)}</select>
            <select className="border rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Published</option><option>Draft</option><option>Unpublished</option></select>
          </div>
          <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex gap-2"><button className="bg-pitch text-white px-4 py-2 rounded">Save</button><button type="button" className="border px-4 py-2 rounded" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}
      <div className="bg-white border rounded-xl divide-y">
        {DB.news.map((n) => (
          <div key={n.id} className="p-4 flex justify-between">
            <div><b>{n.title}</b><div className="text-sm text-ink/60">{n.category} · {n.status} · {n.date}</div></div>
            <div className="space-x-2"><button className="text-turf font-semibold" onClick={() => { setEditing(n); setForm({ ...EMPTY, ...n }); }}>Edit</button><button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this article?")) await deleteRecord("news", n.id); }}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
