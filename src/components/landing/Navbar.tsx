import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme";

interface LandingNavbarProps {
  restaurantName?: string;
}

export function LandingNavbar({ restaurantName = "The Grand Kitchen" }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border transition-colors duration-200">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl border border-border bg-card/60 overflow-hidden flex items-center justify-center group-hover:border-foreground/40 transition-colors shrink-0">
            <Image
              src="/logo.png"
              alt="The Grand Kitchen Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight text-foreground block">
              {restaurantName}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
              Mumbai • Fine Dining &amp; POS
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">Heritage</a>
          <a href="#crm" className="hover:text-foreground transition-colors">POS Suite</a>
          <a href="#credentials" className="text-foreground hover:opacity-80 transition-opacity font-bold underline underline-offset-4">Staff Access</a>
          <a href="#reserve" className="hover:text-foreground transition-colors">Reserve</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all rounded-xl whitespace-nowrap flex items-center gap-2 shadow-sm"
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
  );
}
