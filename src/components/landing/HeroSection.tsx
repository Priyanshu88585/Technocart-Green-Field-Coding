import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden border-b border-white/20">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 tracking-widest uppercase">
                <span className="w-12 h-px bg-white/30" />
                Haute Gastronomy &amp; Enterprise POS
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[104px] font-bold tracking-tight leading-[0.88] mb-6">
              <span className="block text-white">The Grand</span>
              <span className="block text-white/30">Kitchen.</span>
            </h1>

            <div className="text-sm sm:text-base font-semibold text-white/80 h-7 mb-6 font-mono">
              &gt; Michelin-Grade Hospitality • Real-time KOT Dispatch • Zero Floating Drift_
            </div>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mb-10">
              Where artisanal Indian culinary mastery unites with a rock-solid restaurant management platform.
              Synchronized directly to MongoDB Atlas with sub-100ms billing settlements and GST thermal print engines.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md sm:max-w-none">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2.5 rounded-xl whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98]"
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

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-white/5 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

              <div className="relative border border-white/15 bg-white/[0.02] rounded-3xl p-3 sm:p-4 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:border-white/30 hover:scale-[1.01]">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3 text-xs font-mono text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/80 font-medium">3D FLOOR TWIN</span>
                  </div>
                  <span className="text-[11px] text-white/40">CELLAR &amp; PRIVATE DINING</span>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-neutral-900 aspect-square">
                  <Image
                    src="/3d-rendering/11530085.jpg"
                    alt="The Grand Kitchen 3D Wine Cellar and Dining Suite"
                    width={800}
                    height={800}
                    priority
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Table Floor Orchestration
                    </span>
                    <span className="text-white/60">POS Sync: 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
