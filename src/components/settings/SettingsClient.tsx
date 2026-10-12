"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface Settings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  currency: string;
  currencySymbol: string;
  defaultTax: number;
  defaultService: number;
  receiptFooter: string;
}

export function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSettings(settings);
      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast("Restaurant settings updated successfully!", "success");
      }
    } catch {
      addToast("Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Restaurant Profile Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Restaurant Profile & Branding
        </h2>
        <p className="text-xs text-zinc-400">
          This information appears on customer tax invoices, receipts, and headers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Full Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Taxation & Billing Rates */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Taxation & Billing Policy
        </h2>
        <p className="text-xs text-zinc-400">
          Default GST/Tax and service charge applied to all newly created orders.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              GSTIN / Tax ID
            </label>
            <input
              type="text"
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={settings.gstNumber}
              onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Default GST / Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.defaultTax}
              onChange={(e) => setSettings({ ...settings, defaultTax: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Default Service Charge (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.defaultService}
              onChange={(e) => setSettings({ ...settings, defaultService: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Thermal Receipt Customization */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Receipt Customization
        </h2>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            Receipt Footer Note
          </label>
          <input
            type="text"
            value={settings.receiptFooter}
            onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
            placeholder="e.g. Thank you for dining with us! Please visit again."
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving Settings..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
