import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiSaveSettings, apiSettings } from "../api/client.js";
import { createUserRequest, deleteUserRequest, fetchUsers } from "../api/auth.js";

export default function Settings() {
  const { user } = useAuth();
  const [site, setSite] = useState({ clubName: "Sindhuli Football Clubhouse", tagline: "Manage. Play. Connect.", heroText: "Your home for football in Sindhuli." });
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" });
  const canUsers = ["super_admin", "admin"].includes(user?.role);

  useEffect(() => {
    apiSettings().then(setSite).catch(() => {});
    if (canUsers) fetchUsers().then(setUsers).catch(() => {});
  }, [canUsers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-display text-4xl text-pitch">Settings</h1>
      {msg && <div className="bg-turf/10 p-3 rounded text-sm">{msg}</div>}
      <form
        className="bg-white border rounded-xl p-5 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await apiSaveSettings(site);
          setMsg("Settings saved.");
        }}
      >
        <h2 className="font-display text-2xl">Clubhouse content</h2>
        <input className="border rounded px-3 py-2 w-full" value={site.clubName || ""} onChange={(e) => setSite({ ...site, clubName: e.target.value })} />
        <input className="border rounded px-3 py-2 w-full" value={site.tagline || ""} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
        <input className="border rounded px-3 py-2 w-full" value={site.heroText || ""} onChange={(e) => setSite({ ...site, heroText: e.target.value })} />
        <button className="bg-pitch text-white px-4 py-2 rounded">Save settings</button>
      </form>
      {canUsers && (
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-display text-2xl mb-3">Staff login accounts</h2>
          <form
            className="grid md:grid-cols-4 gap-2 mb-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await createUserRequest(form);
              setUsers(await fetchUsers());
              setForm({ name: "", email: "", password: "", role: "manager" });
              setMsg("Staff account created.");
            }}
          >
            <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select className="border rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {["super_admin","manager","coach","medical","staff"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <button className="bg-pitch text-white px-4 py-2 rounded md:col-span-4">Create account</button>
          </form>
          {users.map((u) => (
            <div key={u.id} className="flex justify-between py-2 border-t text-sm">
              <span>{u.name} · {u.email} · {u.role}</span>
              <button className="text-[#A6372B]" onClick={async () => { if (confirm("Delete this login?")) { await deleteUserRequest(u.id); setUsers(await fetchUsers()); } }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
