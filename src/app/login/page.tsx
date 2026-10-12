"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "@/app/actions";
import { useToast } from "@/components/ui/ToastProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });
      if (res?.error) {
        setError(res.error);
        addToast(res.error, "error");
        setLoading(false);
        return;
      }

      addToast(`Welcome back, ${res.data?.name || "Staff Member"}!`, "success");
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during login. Please try again.";
      setError(msg);
      addToast(msg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="p-6 max-w-[1500px] w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl border border-white/25 bg-black/40 overflow-hidden flex items-center justify-center group-hover:border-white/50 transition-colors shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">The Grand Kitchen</span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Staff POS Terminal</span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Restaurant
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-background/80 backdrop-blur-xl p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/25 bg-black/40 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
              <Image
                src="/logo.png"
                alt="Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
                priority
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Restaurant Staff Login
              </h1>
            </div>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Sign in with your verified credentials to access POS billing, kitchen orders, and store operations.
          </p>

          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 rounded-xl border border-white/20 bg-white/[0.02] space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
              <span>Quick Demo Accounts</span>
              <span className="text-white/60">Click to Autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillCredentials("admin@thegrandkitchen.com", "GrandAdmin123!")}
                className="p-3 rounded-xl border border-white/20 bg-white/5 hover:border-white/40 text-left transition-all"
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Store Manager</span>
                  <span className="text-[10px] font-mono text-white/40">ADMIN</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 truncate mt-1">admin@thegrandkitchen.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillCredentials("cashier@thegrandkitchen.com", "Cashier123!")}
                className="p-3 rounded-xl border border-white/20 bg-white/5 hover:border-white/40 text-left transition-all"
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Billing Cashier</span>
                  <span className="text-[10px] font-mono text-white/40">POS</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 truncate mt-1">cashier@thegrandkitchen.com</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                Work Email / Staff ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thegrandkitchen.com"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-mono text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating with MongoDB...</span>
                </>
              ) : (
                <>
                  <span>Sign In to POS Terminal</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/20 text-center">
            <p className="text-[10px] font-mono text-white/40">
              Encrypted session cookies with MongoDB user role verification.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs font-mono text-white/40">
        &copy; {new Date().getFullYear()} The Grand Kitchen POS Systems. All rights reserved.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-white/40 font-mono text-sm">
          Loading Staff Terminal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
