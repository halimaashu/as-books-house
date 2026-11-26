import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function LearningBannerPromo() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="learning-banner-promo">
      <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-6 overflow-hidden rounded-[2rem] bg-[#10283f] px-6 py-8 text-white shadow-xl shadow-[#10283f]/15 sm:px-10 md:flex-row md:items-center md:px-12 md:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#e87817]/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-200"><Sparkles size={14} /> YOUR PROGRESS, YOUR STORY</span>
          <h2 id="learning-banner-promo" className="text-2xl font-bold tracking-tight sm:text-3xl">Turn your learning journey into a banner</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Celebrate what you’re studying and share your next milestone with friends.</p>
        </div>
        <Link href="/learning-banner" className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e87817] px-5 py-3 font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#f28a2d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Create your banner <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  );
}
