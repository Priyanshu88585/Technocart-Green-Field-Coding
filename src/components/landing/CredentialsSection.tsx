import Link from "next/link";

export function CredentialsSection() {
  return (
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
  );
}
