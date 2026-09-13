const TROPHIES = [
  { name: "District League", season: "2024/25", metal: "from-[#C7A344] to-[#8a6a1e]" },
  { name: "Marin Cup", season: "2023/24", metal: "from-[#d9d9d9] to-[#7a7a7a]" },
  { name: "Youth Shield", season: "2025", metal: "from-[#b87333] to-[#6a3e16]" },
];

export default function TrophyCabinet() {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {TROPHIES.map((t) => (
        <div key={t.name} className="text-center">
          <div className="mx-auto w-20 h-28 relative" style={{ perspective: "600px" }}>
            <div className={`absolute inset-0 rounded-b-lg bg-gradient-to-b ${t.metal} shadow-xl`} style={{ transform: "rotateX(8deg)" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full bg-inherit opacity-90" />
              <div className="absolute top-6 -left-3 w-6 h-10 border-4 border-current rounded-l-full opacity-70" />
              <div className="absolute top-6 -right-3 w-6 h-10 border-4 border-current rounded-r-full opacity-70" />
            </div>
          </div>
          <div className="font-display font-bold mt-3">{t.name}</div>
          <div className="text-xs text-ink/60">{t.season}</div>
        </div>
      ))}
    </div>
  );
}
