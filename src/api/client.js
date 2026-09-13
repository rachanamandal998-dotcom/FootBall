const API_BASE = import.meta.env.VITE_API_URL || "/api";

const PATHS = {
  teams: "/teams",
  players: "/players",
  matches: "/matches",
  news: "/news",
  competitions: "/competitions",
  injuries: "/injuries",
  training: "/training",
  reports: "/reports",
  staff: "/staff",
  transfers: "/transfers",
  contracts: "/contracts",
  stadiums: "/stadiums",
};

export function normalizeDoc(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const next = { ...doc };
  if (!next.id && next._id) next.id = String(next._id);
  return next;
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = data?.msg || data?.message || res.statusText || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function apiList(collection, query = "") {
  const path = PATHS[collection];
  if (!path) return null;
  const data = await request(`${path}${query}`);
  return Array.isArray(data) ? data.map(normalizeDoc) : null;
}

export async function apiGet(collection, id) {
  const path = PATHS[collection];
  if (!path) return null;
  return normalizeDoc(await request(`${path}/${encodeURIComponent(id)}`));
}

export async function apiCreate(collection, record) {
  const path = PATHS[collection];
  if (!path) return null;
  return normalizeDoc(await request(path, { method: "POST", body: JSON.stringify(record) }));
}

export async function apiUpdate(collection, id, record) {
  const path = PATHS[collection];
  if (!path) return null;
  return normalizeDoc(
    await request(`${path}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(record),
    }),
  );
}

export async function apiDelete(collection, id) {
  const path = PATHS[collection];
  if (!path) return null;
  return request(`${path}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function apiGetAllCollections() {
  const keys = Object.keys(PATHS);
  const results = await Promise.allSettled(keys.map((key) => apiList(key)));
  const out = {};
  keys.forEach((key, i) => {
    const result = results[i];
    if (result.status === "fulfilled" && Array.isArray(result.value)) out[key] = result.value;
  });
  return out;
}

export function apiStats() {
  return request("/stats");
}

export function apiStandings(compId) {
  return request(`/stats/standings${compId ? `?compId=${encodeURIComponent(compId)}` : ""}`);
}

export function apiDashboard() {
  return request("/dashboard");
}

export function apiSearch(q) {
  return request(`/search?q=${encodeURIComponent(q)}`);
}

export function apiSettings() {
  return request("/settings");
}

export function apiSaveSettings(payload) {
  return request("/settings", { method: "PUT", body: JSON.stringify(payload) });
}

export async function apiUpload(file) {
  const body = new FormData();
  body.append("file", file);
  return request("/uploads", { method: "POST", body });
}

export { request, PATHS };
