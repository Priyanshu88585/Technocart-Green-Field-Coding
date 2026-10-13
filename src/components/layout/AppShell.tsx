"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/" || pathname === "/login";

  if (isPublicRoute) {
    return <main className="min-h-screen bg-background text-foreground transition-colors duration-200">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background text-foreground transition-colors duration-200">{children}</main>
    </div>
  );
}
