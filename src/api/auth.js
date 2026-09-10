const TOKEN_KEY = "sfc_token";
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage failures
  }
}

export function clearToken() {
  storeToken(null);
}

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

function authRequest(path, options = {}) {
  const token = getStoredToken();
  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }).then(parseResponse);
}

export function signupRequest({ name, email, password }) {
  return authRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginRequest({ email, password }) {
  return authRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return authRequest("/auth/me");
}

export function logoutRequest() {
  return authRequest("/auth/logout", { method: "POST" }).catch(() => null);
}

export function fetchUsers() {
  return authRequest("/users");
}

export function createUserRequest(payload) {
  return authRequest("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUserRequest(id, payload) {
  return authRequest(`/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteUserRequest(id) {
  return authRequest(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}
