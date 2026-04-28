import Image from "next/image";
import { LOGOS } from "@/lib/data";

export function LogosSection() {
  return (
    <section className="relative z-10 border-y border-white/10 py-14">
      <p className="text-center text-xs font-medium text-stone-600 tracking-widest uppercase mb-8">
        Interviewees landed roles at
      </p>

      <div className="flex flex-wrap items-center justify-center gap-24 px-6">
        {LOGOS.map((l) => (
          <Image
            key={l.alt}
            src={l.src}
            alt={l.alt}
            width={50}
            height={50}
            className="h-6 w-auto opacity-60 grayscale"
          />
        ))}
      </div>
    </section>
  );
}
