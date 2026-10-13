import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ThemeProvider } from "@/components/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "The Grand Kitchen — Restaurant CRM & POS Billing",
    template: "%s | The Grand Kitchen",
  },
  description:
    "Architectural Restaurant CRM & POS Billing Suite. Live kitchen floor orchestration, real-time KOT dispatch, inventory catalog, and instant thermal settlement.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tgk_theme')||'dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);}catch(e){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground transition-colors duration-200`}
      >
        <ThemeProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
