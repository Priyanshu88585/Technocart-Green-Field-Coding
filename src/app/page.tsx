import { getSettings } from "@/app/actions";
import {
  LandingNavbar,
  HeroSection,
  CredentialsSection,
  HeritageSection,
  ReservationSection,
  LandingFooter,
} from "@/components/landing";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  let settings;
  try {
    settings = await getSettings();
  } catch (e) {
    console.error("Failed to load settings:", e);
    settings = { name: "The Grand Kitchen", address: "Plot 42, Bandra Kurla Complex, Mumbai" };
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
      <LandingNavbar restaurantName={settings?.name} />
      <HeroSection />
      <CredentialsSection />
      <HeritageSection />
      <ReservationSection />
      <LandingFooter restaurantName={settings?.name} address={settings?.address} />
    </div>
  );
}
