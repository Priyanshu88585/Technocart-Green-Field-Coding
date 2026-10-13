import Link from "next/link";
import Image from "next/image";

interface LandingFooterProps {
  restaurantName?: string;
  address?: string;
}

export function LandingFooter({
  restaurantName = "The Grand Kitchen",
  address = "Plot 42, Bandra Kurla Complex, Mumbai",
}: LandingFooterProps) {
  return (
    <footer className="py-16 text-center border-t border-border text-muted-foreground text-xs font-mono space-y-4">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg border border-border bg-card/60 overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="The Grand Kitchen Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <span className="font-bold text-foreground text-sm">{restaurantName}</span>
          <span className="text-muted-foreground/30">•</span>
          <span>{address}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-foreground transition-colors underline underline-offset-4">
            Staff POS Terminal
          </Link>
          <a href="#credentials" className="hover:text-foreground transition-colors">
            Access Keys
          </a>
        </div>

        <div>
          &copy; {new Date().getFullYear()} {restaurantName} POS &amp; CRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
