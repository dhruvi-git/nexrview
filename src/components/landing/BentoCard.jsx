export function MockUI({ rows = 3 }) {
  const widths = ["w-4/5", "w-3/5", "w-2/5", "w-4/5", "w-1/2"];
  const colors = [
    "bg-white/5",
    "bg-white/5",
    "bg-amber-400/15",
    "bg-white/5",
    "bg-white/5",
  ];

  return (
    <div className="mt-5 rounded-xl bg-[#141417] border border-white/10 overflow-hidden">
      <div className="h-9 bg-white/5 border-b border-white/10 flex items-center px-3.5 gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full ${widths[i]} ${colors[i]}`}
          />
        ))}
      </div>
    </div>
  );
}

export function BentoCard({ icon, title, desc, children, className = "" }) {
  return (
    <div
      className={`relative bg-[#0f0f11] border border-white/10 hover:border-amber-400/20 rounded-2xl p-9 h-full transition duration-300 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 via-transparent pointer-events-none" />

      <span className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl mb-5">
        {icon}
      </span>

      <h3 className="font-serif text-xl tracking-tight mb-2">{title}</h3>

      <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>

      {children}
    </div>
  );
}
