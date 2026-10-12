import Link from "next/link";
import { getMenuItems, getSettings } from "@/app/actions";
import { formatCurrency } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [items, settings] = await Promise.all([
    getMenuItems(),
    getSettings(),
  ]);

  const featuredItems = items.slice(0, 8);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-purple-600/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                {settings?.name || "The Grand Kitchen"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/80 font-semibold">
                Fine Dining & Gastronomy
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#about" className="hover:text-white transition-colors">Our Story</a>
            <a href="#menu" className="hover:text-white transition-colors">Signature Menu</a>
            <a href="#features" className="hover:text-white transition-colors">POS & Billing Suite</a>
            <a href="#credentials" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">Staff Credentials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-zinc-300 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>MUMBAI&apos;S PREMIER FINE DINING • EST. 2018</span>
            <span className="text-zinc-600">•</span>
            <span className="text-purple-400">POWERED BY MONGODB</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Where Culinary Royalty Meets{" "}
            <span className="bg-gradient-to-r from-purple-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              Intelligent Restaurant Billing.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome to <strong className="text-zinc-200">The Grand Kitchen</strong>. Discover artisanal dum-cooked biryanis,
            tandoori delicacies, and fine wine pairings — synchronized with a lightning-fast POS engine, real-time table management,
            and 80mm thermal GST invoice generation.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Access POS Billing Terminal</span>
            </Link>

            <a
              href="#menu"
              className="px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-200 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span>Explore Signature Dishes</span>
            </a>
          </div>

          {/* ============================================================== */}
          {/* HERO DEMO CREDENTIALS CARD (Prominent in Hero Section) */}
          {/* ============================================================== */}
          <div id="credentials" className="pt-10 max-w-4xl mx-auto text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border-2 border-purple-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 space-y-6 relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      Staff Portal Verified Credentials
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        MongoDB Synced
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Use the pre-configured accounts below to log in directly. No public signup needed.
                    </p>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
                >
                  Go to Login Screen →
                </Link>
              </div>

              {/* Two Credentials Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Admin Account */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold tracking-wide uppercase">
                      👑 General Manager (Admin)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">Full Access</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Login ID / Email:</span>
                      <code className="text-purple-300 font-mono font-bold select-all">
                        admin@thegrandkitchen.com
                      </code>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Password:</span>
                      <code className="text-amber-300 font-mono font-bold select-all">
                        GrandAdmin123!
                      </code>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Permissions: View revenue dashboards, manage menu dishes, customize GST/restaurant tax rates, and settle orders.
                  </p>
                </div>

                {/* 2. Cashier Account */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wide uppercase">
                      💳 Billing Cashier (POS)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">Operator</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Login ID / Email:</span>
                      <code className="text-amber-300 font-mono font-bold select-all">
                        cashier@thegrandkitchen.com
                      </code>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Password:</span>
                      <code className="text-purple-300 font-mono font-bold select-all">
                        Cashier123!
                      </code>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Permissions: High-speed POS order terminal, table additions, Cash/UPI/Card split settlement, 80mm invoice printing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">4.9 ★</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">Guest Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">24+</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">Original Dishes in MongoDB</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 tracking-tight">80mm</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">Thermal GST Invoicing</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">100%</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">Integer Paise Precision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Preview */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Artisanal Culinary Catalog
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Signature Chef Specialties
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            Live catalog fetched directly from your MongoDB Atlas database. Each recipe reflects timeless North Indian and Mughal culinary heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-zinc-950/70 border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                    {item.category}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="In Stock" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {item.description || "Authentic freshly prepared specialty seasoned with whole aromatic spices."}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-lg font-bold font-mono text-amber-300">
                  {formatCurrency(item.priceInPaise)}
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">Fine Dining</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Operations & SaaS Capabilities */}
      <section id="features" className="py-20 bg-zinc-950/50 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Enterprise Grade POS Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Built for High-Velocity Restaurant Operations
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
              Engineered with zero floating-point arithmetic errors, real-time table state machines, and Indian GST split invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-black/60 border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">GST Split Invoicing (CGST + SGST)</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Calculates GST with exact split-tax transparency (2.5% CGST + 2.5% SGST). Clean 80mm thermal receipt format ready for physical Epson, Posiflex, and thermal printers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-black/60 border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Dynamic Active Table Appends</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Waiters can append mid-meal orders to existing active dining tables without restarting tickets. The system auto-updates subtotals, discounts, and tax liabilities instantly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-black/60 border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Payment & Split Settlement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full split payment support: settle part bill in Cash and part via UPI QR, recording UTR transaction reference IDs and verifying zero remaining balances before completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Information & Hours */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Visit The Grand Kitchen
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {settings?.name || "The Grand Kitchen"}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {settings?.address || "123 Food Street, Culinary District, Mumbai - 400001"}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-300 font-mono">
              <span>📞 {settings?.phone || "+91 98765 43210"}</span>
              <span>✉️ {settings?.email || "info@thegrandkitchen.com"}</span>
              <span>🏛️ GSTIN: {settings?.gstNumber || "27AABCU9603R1ZM"}</span>
            </div>
          </div>

          <div className="space-y-3 text-left md:text-right shrink-0">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Dining & Kitchen Hours
            </div>
            <div className="text-sm font-bold text-white">
              Monday – Sunday: 11:30 AM – 11:30 PM
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Sign In to Staff Terminal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings?.name || "The Grand Kitchen"}. Powered by Next.js & MongoDB Atlas.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">POS Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
