import { BentoCard, MockUI } from "./BentoCard";
import { Bot, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading, SectionLabel, GrayTitle, GoldTitle } from "@/components/reusables";
import { AI_TAGS, SLOTS } from "@/lib/data";

export function FeaturesSection() {
  return (
    <section className="relative z-10 py-28 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <SectionLabel>Features</SectionLabel>
        <SectionHeading gray="Everything you need," gold="nothing you don't" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-7">
          <BentoCard
            icon={<Bot size={20} className="text-amber-400" />}
            title={<GrayTitle>AI Question Generator</GrayTitle>}
            desc="Interviewers get a live AI co-pilot generating role-specific questions on demand — system design, behavioural, DSA — all tailored to the candidate's level."
          >
            <div className="flex flex-wrap gap-2 mt-5">
              {AI_TAGS.map((t) => (
                <Badge key={t.label} variant={t.active ? "gold" : "outline"}>
                  {t.label}
                </Badge>
              ))}
            </div>
          </BentoCard>
        </div>

        <div className="col-span-12 md:col-span-5">
          <BentoCard
            icon={<Wallet size={16} className="text-amber-400" />}
            title={<GrayTitle>Credit System</GrayTitle>}
            desc="Subscribe for monthly credits. Book sessions. Interviewers earn and withdraw any time."
          >
            <div className="mt-5 rounded-xl bg-[#141417] border border-white/10 p-5 flex justify-between items-end">
              <div>
                <p className="text-xs text-stone-600 mb-1">Your balance</p>
                <p className="font-serif text-4xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  28
                </p>
                <p className="text-xs text-stone-600 mt-1">credits remaining</p>
              </div>

              <Badge variant="secondary">+10 this month</Badge>
            </div>
          </BentoCard>
        </div>

        <div className="col-span-12 md:col-span-4">
          <BentoCard
            icon="📹"
            title="HD Video Calls"
            desc="Powered by Stream. Screen sharing, recording, and instant playback links — all built in."
          >
            <MockUI rows={3} />
          </BentoCard>
        </div>

        <div className="col-span-12 md:col-span-4">
          <BentoCard
            icon="💬"
            title="Persistent Chat"
            desc="Message your interviewer before and after the call. Share resources, prep notes, and follow-ups in one thread."
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <BentoCard
            icon="🔒"
            title="Security by Arcjet"
            desc="Bot protection, rate limiting, and abuse prevention baked into every API route."
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <BentoCard
            icon="📊"
            title={<GrayTitle>AI Feedback Reports</GrayTitle>}
            desc="Post-interview analysis by Gemini with actionable insights."
          >
            <MockUI rows={5} />
          </BentoCard>
        </div>

        <div className="col-span-12 md:col-span-6">
          <BentoCard
            icon="🗓️"
            title={<GoldTitle>Slot-based Scheduling</GoldTitle>}
            desc="Interviewers set availability once. Interviewees pick from open slots and confirm with one click — no back-and-forth needed."
          >
            <div className="flex flex-wrap gap-2 mt-5">
              {SLOTS.map((s) => (
                <span
                  key={s.label}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${s.cls}`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
