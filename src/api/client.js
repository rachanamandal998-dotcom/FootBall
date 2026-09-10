import { getStoredToken, clearToken } from "./auth.js";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const PATHS = {
  teams: "/teams",
  players: "/players",
  matches: "/matches",
  news: "/news",
  competitions: "/competitions",
  injuries: "/injuries",
  training: "/training",
};

export function normalizeDoc(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const next = { ...doc };
  if (!next.id && next._id) next.id = String(next._id);
  return next;
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    if (res.status === 401 && token && path !== "/auth/me") {
      clearToken();
    }
    const msg = data?.msg || data?.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export async function apiList(collection) {
  const path = PATHS[collection];
  if (!path) return null;
  const data = await request(path);
  return Array.isArray(data) ? data.map(normalizeDoc) : null;
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
    if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length) {
      out[key] = result.value;
    }
  });
  return out;
}
