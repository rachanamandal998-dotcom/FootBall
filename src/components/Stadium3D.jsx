export default function Stadium3D() {
  return (
    <div className="relative h-72 md:h-80 rounded-3xl overflow-hidden bg-pitch-deep shadow-2xl" style={{ perspective: "900px" }}>
      <div className="absolute inset-0 pitch-lines opacity-40" />
      <div
        className="absolute left-1/2 top-10 -translate-x-1/2 w-[86%] h-56 rounded-[50%] border-[18px] border-[#6b4b32] shadow-inner"
        style={{ transform: "rotateX(58deg)" }}
      >
        <div className="absolute inset-3 rounded-[50%] bg-gradient-to-b from-[#2c9a55] to-[#14703a] border-2 border-white/70">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/80" />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-24 border-2 border-white/70 rounded-sm" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-24 border-2 border-white/70 rounded-sm" />
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-gold-soft text-sm tracking-[0.3em] uppercase">
        Sindhuli Stadium
      </div>
    </div>
  );
}
