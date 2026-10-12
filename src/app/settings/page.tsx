import { getSettings } from "@/app/actions";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Restaurant Settings",
};

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-white/[0.08]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          System & Billing Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Configure restaurant branding, GST taxation rules, default charges, and receipt notes
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
