"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logoutUser, getAuthUser } from "@/app/actions";
import { useToast } from "@/components/ui/ToastProvider";
import { ThemeToggle } from "@/components/theme";

const navItems = [
  {
    label: "POS Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "New Order",
    href: "/orders/new",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "All Orders",
    href: "/orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    label: "Menu Catalog",
    href: "/menu",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "Tax & Settings",
    href: "/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getAuthUser().then((res) => {
      if (res) {
        setUser({
          name: res.name,
          email: res.email,
          role: res.role,
        });
      }
    });
  }, []);

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href === "/orders") {
      return pathname.startsWith("/orders/") && !pathname.startsWith("/orders/new");
    }
    return pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      addToast("You have been logged out.", "info");
      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-surface-elevated border border-border shadow-lg text-foreground cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`no-print fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-xl border-r border-border flex flex-col transition-transform duration-300 ease-out shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-lg border border-border bg-card/60 overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Restaurant Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">The Grand Kitchen</h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">POS & CRM Core</p>
          </div>
          <ThemeToggle className="ml-auto" />
          <button
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              View Restaurant Site
            </Link>
          </div>
        </nav>

        <div className="p-3.5 border-t border-border bg-card/40 space-y-3">
          <div className="flex items-center gap-3 px-1.5">
            <div className="w-9 h-9 rounded-xl border border-border bg-muted flex items-center justify-center text-xs font-mono font-bold text-foreground">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "GM"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Priyanshu (Manager)"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {user?.role || "ADMIN"} • Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground/80 hover:text-foreground text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
