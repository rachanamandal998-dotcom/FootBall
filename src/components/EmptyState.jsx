export default function EmptyState({ big, sub, action }) {
  return (
    <div className="py-14 text-center border border-dashed border-[#d9d2bc] bg-white/60">
      <p className="font-display text-2xl text-charcoal">{big}</p>
      {sub ? <p className="text-sm text-ink/60 mt-2">{sub}</p> : null}
      {action}
    </div>
  );
}
