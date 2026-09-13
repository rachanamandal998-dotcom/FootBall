const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function parseResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { msg: text };
  }
  if (!res.ok) {
    throw new Error(data?.msg || data?.message || res.statusText || "Request failed");
  }
  return data;
}

export function loginRequest({ email, password }) {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(parseResponse);
}

export function fetchMe() {
  return fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).then(parseResponse);
}

export function logoutRequest() {
  return fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then(parseResponse)
    .catch(() => null);
}

export function fetchUsers() {
  return fetch(`${API_BASE}/users`, { credentials: "include" }).then(parseResponse);
}

export function createUserRequest(payload) {
  return fetch(`${API_BASE}/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parseResponse);
}

export function updateUserRequest(id, payload) {
  return fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parseResponse);
}

export function deleteUserRequest(id) {
  return fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  }).then(parseResponse);
}
