export const uid = () => Math.random().toString(36).slice(2, 9);
export const nextId = (prefix = "") => `${prefix}${Date.now().toString(36)}`;

export const colorFor = (str = "?") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ["#0E3B2E", "#134A38", "#1E7245", "#C7A344", "#A6372B", "#2A5D8A", "#5B3E31"];
  return colors[Math.abs(hash) % colors.length];
};

export const initials = (name = "?") =>
  String(name)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase();

export const fmtDate = (iso = "") => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

export const ageFromDOB = (iso = "") => {
  if (!iso) return "—";
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return "—";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
};

export const FORMATIONS = {
  "4-4-2": { GK: [[50, 90]], DEF: [[12, 72], [34, 74], [66, 74], [88, 72]], MID: [[18, 48], [38, 46], [62, 46], [82, 48]], ATT: [[35, 20], [65, 20]] },
  "4-3-3": { GK: [[50, 90]], DEF: [[12, 72], [34, 74], [66, 74], [88, 72]], MID: [[28, 48], [50, 52], [72, 48]], ATT: [[18, 20], [50, 16], [82, 20]] },
  "4-2-3-1": { GK: [[50, 90]], DEF: [[12, 72], [34, 74], [66, 74], [88, 72]], MID: [[32, 56], [68, 56], [20, 38], [50, 36], [80, 38]], ATT: [[50, 16]] },
  "3-5-2": { GK: [[50, 90]], DEF: [[22, 74], [50, 76], [78, 74]], MID: [[10, 48], [30, 44], [50, 50], [70, 44], [90, 48]], ATT: [[38, 18], [62, 18]] },
  "3-4-3": { GK: [[50, 90]], DEF: [[22, 74], [50, 76], [78, 74]], MID: [[18, 48], [40, 46], [60, 46], [82, 48]], ATT: [[18, 18], [50, 16], [82, 18]] },
  "5-3-2": { GK: [[50, 90]], DEF: [[8, 68], [26, 74], [50, 76], [74, 74], [92, 68]], MID: [[28, 46], [50, 48], [72, 46]], ATT: [[38, 18], [62, 18]] },
};

export function slotsFor(formation = "4-3-3") {
  const map = FORMATIONS[formation] || FORMATIONS["4-3-3"];
  return Object.entries(map).flatMap(([role, pts]) => pts.map((xy, i) => ({ role, i, x: xy[0], y: xy[1] })));
}

export const EVENT_LABEL = {
  goal: "Goal",
  yellow: "Yellow Card",
  red: "Red Card",
  sub: "Substitution",
  assist: "Assist",
};

export const EVENT_ICON = {
  goal: "⚽",
  yellow: "🟨",
  red: "🟥",
  sub: "🔄",
  assist: "🅰️",
};

export function minuteLabel(ev) {
  if (!ev) return "";
  return ev.extra ? `${ev.minute}+${ev.extra}'` : `${ev.minute}'`;
}

export function playerName(p) {
  return p?.displayName || p?.name || `${p?.firstName || ""} ${p?.lastName || ""}`.trim() || "Unknown";
}
