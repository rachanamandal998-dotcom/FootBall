import { playerName, slotsFor } from "../utils/helpers.js";

export default function Pitch({
  formation = "4-3-3",
  players = [],
  selected = [],
  onSelect,
  interactive = false,
}) {
  const slots = slotsFor(formation);
  const assigned = selected.slice(0, slots.length);

  return (
    <div className="pitch-board relative w-full aspect-[2/3] max-w-sm mx-auto rounded-xl border-4 border-white overflow-hidden shadow-xl">
      <div className="absolute inset-2 border border-white/70 rounded-sm" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/70" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/80" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-28 h-10 border border-white/80 border-t-0" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-28 h-10 border border-white/80 border-b-0" />
      {slots.map((slot, idx) => {
        const pid = assigned[idx];
        const p = players.find((x) => x.id === pid);
        return (
          <button
            type="button"
            disabled={!interactive}
            key={`${slot.role}-${idx}`}
            onClick={() => interactive && onSelect?.(idx, pid)}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 text-center"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <div className={`mx-auto w-9 h-9 rounded-full border-2 grid place-items-center text-[10px] font-bold ${p ? "bg-charcoal text-gold-soft border-gold" : "bg-white/20 text-white border-white/50"}`}>
              {p?.jersey || slot.role.slice(0, 1)}
            </div>
            <div className="text-[9px] text-white font-semibold leading-tight mt-0.5 truncate">
              {p ? playerName(p).split(" ").slice(-1) : "—"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
