import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden border-b border-white/20">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        {/* Eyebrow Label with divider line */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 tracking-widest uppercase">
            <span className="w-12 h-px bg-white/30" />
            Haute Gastronomy &amp; Enterprise POS
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
          </span>
        </div>

        {/* Main Architectural Heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-[112px] font-bold tracking-tight leading-[0.88] mb-8">
          <span className="block text-white">The Grand</span>
          <span className="block text-white/30">Kitchen.</span>
        </h1>

        {/* Monospace Sub-headline */}
        <div className="text-sm sm:text-base font-semibold text-white/80 h-7 mb-6 font-mono">
          &gt; Michelin-Grade Hospitality • Real-time KOT Dispatch • Zero Floating Drift_
        </div>

        <p className="text-base sm:text-xl text-white/40 leading-relaxed max-w-2xl mb-12">
          Where artisanal Indian culinary mastery unites with a rock-solid restaurant management platform.
          Synchronized directly to MongoDB Atlas with sub-100ms billing settlements and GST thermal print engines.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md sm:max-w-none">
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2.5 rounded-xl whitespace-nowrap shadow-sm"
          >
            <span>Launch POS Terminal</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <a
            href="#credentials"
            className="px-6 py-4 border border-white/20 bg-transparent text-white/60 hover:text-white hover:border-white/40 text-sm font-mono transition-all flex items-center justify-center gap-2 rounded-xl whitespace-nowrap"
          >
            Demo Credentials &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
