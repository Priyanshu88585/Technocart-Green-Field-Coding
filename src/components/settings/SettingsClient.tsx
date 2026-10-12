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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Restaurant Profile Card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-px bg-white/20" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            01 // PROFILE
          </span>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">
          Restaurant Profile & Branding
        </h2>
        <p className="text-xs text-white/40">
          This information appears on customer tax invoices, thermal printouts, and digital bills.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Restaurant Legal Name *
            </label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Premises Physical Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Front Desk Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Official Billing Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Taxation & Billing Rates */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-px bg-white/20" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            02 // TAX & COMPLIANCE
          </span>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">
          Taxation & Billing Policy
        </h2>
        <p className="text-xs text-white/40">
          Default statutory GST/Tax and optional service charge applied to dining & takeaway tickets.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              GSTIN / Tax ID
            </label>
            <input
              type="text"
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={settings.gstNumber}
              onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Default GST Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.defaultTax}
              onChange={(e) => setSettings({ ...settings, defaultTax: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
              Default Service Charge (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.defaultService}
              onChange={(e) => setSettings({ ...settings, defaultService: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Thermal Receipt Customization */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-px bg-white/20" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            03 // THERMAL FOOTER
          </span>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">
          Receipt Customization
        </h2>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-white/40 block mb-1">
            Receipt Footer Note
          </label>
          <input
            type="text"
            value={settings.receiptFooter}
            onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
            placeholder="e.g. Thank you for dining with us! Please visit again."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 shadow-sm transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving Settings..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
