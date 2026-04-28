import { ROLES } from "@/lib/data";
import { SectionHeading, SectionLabel } from "@/components/reusables";

export function RolesSection() {
  return (
    <section className="relative z-10 pb-28 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <SectionLabel>Who it&apos;s for</SectionLabel>
        <SectionHeading gray="Built for both sides" gold="of the table" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {ROLES.map((role) => (
          <div
            key={role.label}
            className="relative bg-[#0f0f11] border border-white/10 hover:border-amber-400/20 rounded-2xl p-12 h-full transition duration-300 overflow-hidden"
          >
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />

            <span className="inline-block text-xs font-semibold text-amber-400 tracking-widest uppercase border border-amber-400/20 bg-amber-400/10 rounded-full px-3 py-1.5 mb-5">
              {role.label}
            </span>

            <h3 className="font-serif text-2xl tracking-tight mb-4">
              {role.title}
            </h3>

            <p className="text-sm text-stone-400 leading-relaxed mb-8">
              {role.desc}
            </p>

            <ul className="space-y-3">
              {role.perks.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-stone-400">
                  <span className="mt-0.5 min-w-4 h-4 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs text-amber-400">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
