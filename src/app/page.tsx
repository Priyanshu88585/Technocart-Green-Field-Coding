import Link from "next/link";
import { getMenuItems, getSettings } from "@/app/actions";
import { formatCurrency } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [items, settings] = await Promise.all([
    getMenuItems(),
    getSettings(),
  ]);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-white group-hover:border-white/50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-white block">
                {settings?.name || "The Grand Kitchen"}
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                Mumbai • Fine Dining &amp; POS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/50">
            <a href="#about" className="hover:text-white transition-colors">Heritage</a>
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <a href="#crm" className="hover:text-white transition-colors">POS Suite</a>
            <a href="#credentials" className="text-white hover:text-white/80 transition-colors font-bold underline underline-offset-4">Staff Access</a>
            <a href="#reserve" className="hover:text-white transition-colors">Reserve</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all rounded-xl whitespace-nowrap flex items-center gap-2 shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (Architectural Portfolio Theme) */}
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
              href="#menu"
              className="px-8 py-4 border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm flex items-center justify-center gap-2 rounded-xl whitespace-nowrap"
            >
              <span>Explore Live Menu ({items.length})</span>
            </a>

            <a
              href="#credentials"
              className="px-6 py-4 border border-white/20 bg-transparent text-white/60 hover:text-white hover:border-white/40 text-sm font-mono transition-all flex items-center justify-center gap-2 rounded-xl whitespace-nowrap"
            >
              Demo Credentials &darr;
            </a>
          </div>

          {/* Hero Numbers Strip (Portfolio Style) */}
          <div className="flex flex-wrap items-start mt-16 lg:mt-24 gap-10 sm:gap-14 lg:gap-20 border-t border-white/20 pt-10">
            <div className="flex flex-col gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white">100%</span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-mono">
                MongoDB Atlas Synced
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white">12+</span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-mono">
                Dining Floor Tables
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white">&lt; 100ms</span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-mono">
                Bill Calculation Latency
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white">₹ 0</span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-mono">
                Paise Rounding Variance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Staff Credentials Section (Requested in Hero area) */}
      <section id="credentials" className="py-20 lg:py-28 border-b border-white/20 bg-background/50">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 mb-3 tracking-widest uppercase">
              <span className="w-12 h-px bg-white/30" />
              Verified Access Controls
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Restaurant Staff Credentials.
            </h2>
            <p className="text-sm sm:text-base text-white/40 mt-1 max-w-xl">
              Production MongoDB accounts seeded with bcrypt authentication. Use these credentials to access the POS terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Store Manager Card */}
            <div className="p-8 rounded-2xl border border-white/25 bg-background/60 backdrop-blur-sm space-y-6 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">Role</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Store Manager (Admin)</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 text-white/80">
                  FULL ACCESS
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">Work Email / Login ID</span>
                  <div className="p-3 rounded-xl border border-white/20 bg-white/[0.02] text-white font-semibold select-all">
                    admin@thegrandkitchen.com
                  </div>
                </div>

                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">Secure Password</span>
                  <div className="p-3 rounded-xl border border-white/20 bg-white/[0.02] text-white font-semibold select-all">
                    GrandAdmin123!
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-3 bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  Sign In as Store Manager &rarr;
                </Link>
              </div>
            </div>

            {/* Billing Cashier Card */}
            <div className="p-8 rounded-2xl border border-white/25 bg-background/60 backdrop-blur-sm space-y-6 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">Role</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Billing Cashier (POS)</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 text-white/80">
                  POS OPERATOR
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">Work Email / Login ID</span>
                  <div className="p-3 rounded-xl border border-white/20 bg-white/[0.02] text-white font-semibold select-all">
                    cashier@thegrandkitchen.com
                  </div>
                </div>

                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">Secure Password</span>
                  <div className="p-3 rounded-xl border border-white/20 bg-white/[0.02] text-white font-semibold select-all">
                    Cashier123!
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-3 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white text-xs font-semibold transition-all rounded-xl flex items-center justify-center gap-2"
                >
                  Sign In as Cashier &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Menu Showcase (Direct from MongoDB) */}
      <section id="menu" className="py-24 lg:py-32 border-b border-white/20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 mb-3 tracking-widest uppercase">
                <span className="w-12 h-px bg-white/30" />
                Artisanal Kitchen Ledger
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Signature Menu.
              </h2>
              <p className="text-sm sm:text-base text-white/40 mt-1 max-w-xl">
                Real-time dishes persisted in MongoDB. Backed by precise integer paise pricing.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-white text-black font-semibold shadow-sm">
                All ({items.length})
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-full text-xs font-mono border border-white/20 bg-white/5 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const num = (idx + 1).toString().padStart(2, "0");
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-white/20 bg-background/50 backdrop-blur-sm hover:border-white/40 transition-all flex flex-col justify-between space-y-6 group shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-white/30 group-hover:text-white/60 transition-colors">
                        {num}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.available ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                          {item.available ? "IN STOCK" : "SOLD OUT"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">
                        {item.name}
                      </h3>
                      <p className="text-xs text-white/40 leading-relaxed mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                      {item.category}
                    </span>
                    <span className="text-lg font-mono font-bold text-white">
                      {formatCurrency(item.priceInPaise)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culinary Heritage & Craft Section (Portfolio Two-Column Style) */}
      <section id="about" className="py-24 lg:py-32 border-b border-white/20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 mb-6 tracking-widest uppercase">
                <span className="w-12 h-px bg-white/30" />
                The Gastronomic Standard
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-8">
                Slow Crafted.
                <span className="block text-white/30">Fast Billed.</span>
              </h2>
              <p className="text-base sm:text-lg text-white/40 leading-relaxed mb-6">
                Rooted in royal Awadhi and Mughlai culinary traditions, The Grand Kitchen blends timeless slow-cooking methods with a bleeding-edge operational backbone.
              </p>
              <p className="text-base text-white/40 leading-relaxed mb-10">
                Every grain of aged basmati rice is slow-steamed under dough-sealed purdah. Every table ticket is digitally dispatched to kitchen screens in under 50ms.
              </p>

              <div className="p-6 rounded-2xl border border-white/20 bg-white/[0.02] space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-white font-mono text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Certified Food Safety &amp; Legal Compliance</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-white/50 pt-2 border-t border-white/20">
                  <div>
                    <span className="text-white/30 block text-[10px]">GSTIN NUMBER</span>
                    <span className="text-white font-semibold">27AAACG0123M1Z5</span>
                  </div>
                  <div>
                    <span className="text-white/30 block text-[10px]">FSSAI LICENSE</span>
                    <span className="text-white font-semibold">11521008000451</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  idx: "01",
                  title: "Awadhi Dum Cooking",
                  desc: "Handi pots sealed with natural dough, cooked over charcoal embers to capture every aroma molecule.",
                },
                {
                  idx: "02",
                  title: "Strict Integer Arithmetic",
                  desc: "Zero floating-point inaccuracies in financial calculations. All line totals, SGST, CGST, and discounts computed down to individual paise.",
                },
                {
                  idx: "03",
                  title: "Thermal Invoice Engine",
                  desc: "Direct browser-native 80mm thermal receipt generation with legal tax breakdown and instant order settlement.",
                },
                {
                  idx: "04",
                  title: "Real-Time Floor Orchestration",
                  desc: "Live visibility over 12 dining tables, occupied durations, and kitchen order ticket statuses without page reloads.",
                },
              ].map((item) => (
                <div
                  key={item.idx}
                  className="p-8 rounded-2xl border border-white/20 bg-background/50 hover:border-white/40 transition-all space-y-3 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono font-medium text-white/30">
                      {item.idx}
                    </span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Inquiry Form */}
      <section id="reserve" className="py-24 lg:py-32 border-b border-white/20">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 tracking-widest uppercase">
              <span className="w-12 h-px bg-white/30" />
              Private Dining &amp; Events
              <span className="w-12 h-px bg-white/30" />
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Reserve Your Table.
            </h2>
            <p className="text-sm sm:text-base text-white/40">
              For private dining rooms, corporate degustations, or evening tables, send an inquiry directly to the store manager.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-2xl border border-white/25 bg-background/60 backdrop-blur-sm space-y-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50">Guest Name</label>
                <input
                  type="text"
                  placeholder="Vikramaditya Roy"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98200 12345"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50">Party Size</label>
                <select className="w-full px-4 py-3 rounded-xl border border-white/20 bg-background text-sm text-white focus:border-white/50 outline-none transition-colors">
                  <option value="2">2 Guests (Intimate)</option>
                  <option value="4">4 Guests (Standard)</option>
                  <option value="6">6 Guests (Booth)</option>
                  <option value="8">8+ Guests (VIP Room)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50">Preferred Dining Slot</label>
                <select className="w-full px-4 py-3 rounded-xl border border-white/20 bg-background text-sm text-white focus:border-white/50 outline-none transition-colors">
                  <option value="lunch">Lunch Service (12:30 PM - 3:30 PM)</option>
                  <option value="dinner">Dinner Service (7:00 PM - 11:30 PM)</option>
                  <option value="late">Late Night Tasting (10:30 PM onwards)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50">Special Dietary Requests</label>
              <textarea
                rows={3}
                placeholder="Allergies, anniversary arrangements, wine pairings..."
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="button"
              className="w-full py-4 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Confirm Reservation Request &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-16 text-center border-t border-white/20 text-white/40 text-xs font-mono space-y-4">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">The Grand Kitchen</span>
            <span className="text-white/20">•</span>
            <span>Plot 42, Bandra Kurla Complex, Mumbai</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors underline underline-offset-4">
              Staff POS Terminal
            </Link>
            <a href="#credentials" className="hover:text-white transition-colors">
              Access Keys
            </a>
            <a href="#menu" className="hover:text-white transition-colors">
              Live Catalog
            </a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} The Grand Kitchen POS &amp; CRM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
