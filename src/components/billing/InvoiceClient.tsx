"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/money";

interface OrderItem {
  id: string;
  itemName: string;
  unitPriceInPaise: number;
  quantity: number;
  lineTotalInPaise: number;
}

interface Payment {
  id: string;
  amountInPaise: number;
  method: string;
  reference: string;
  createdAt: Date;
}

interface Order {
  id: string;
  orderNumber: number;
  orderType: string;
  tableNumber: string;
  status: string;
  note: string;
  subtotalInPaise: number;
  discountPercent: number;
  discountInPaise: number;
  taxPercent: number;
  taxInPaise: number;
  servicePercent: number;
  serviceInPaise: number;
  totalInPaise: number;
  createdAt: Date;
  items: OrderItem[];
  payments: Payment[];
}

interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  currencySymbol: string;
  receiptFooter: string;
}

export function InvoiceClient({
  order,
  settings,
}: {
  order: Order;
  settings: RestaurantSettings;
}) {
  const totalPaid = order.payments.reduce((sum, p) => sum + p.amountInPaise, 0);
  const balanceRemaining = Math.max(0, order.totalInPaise - totalPaid);

  const handlePrint = () => {
    window.print();
  };

  // Indian GST split into CGST (half) and SGST (half) if taxPercent is present
  const halfTaxPaise = Math.round(order.taxInPaise / 2);
  const halfTaxPercent = (order.taxPercent / 2).toFixed(1);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Control Actions Header (Hidden in Print) */}
      <div className="no-print flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/orders/${order.id}`}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-bold text-white">
              Customer Tax Invoice & Thermal Receipt
            </h1>
            <p className="text-xs text-zinc-400">Order #{order.orderNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/orders/new"
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 transition-colors"
          >
            New Order
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>

      {/* The Printable Bill Container */}
      <div className="print-receipt bg-zinc-950 sm:rounded-3xl border border-white/[0.1] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="no-print absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10" />

        {/* Restaurant Branding Header */}
        <div className="text-center pb-6 border-b border-dashed border-white/20 print:border-black/30 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white print:text-black">
            {settings.name}
          </h2>
          <p className="text-xs text-zinc-400 print:text-zinc-700">
            {settings.address}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-zinc-400 print:text-zinc-700">
            <span>Ph: {settings.phone}</span>
            {settings.email && <span>• {settings.email}</span>}
          </div>
          {settings.gstNumber && (
            <p className="text-xs font-mono font-semibold text-purple-400 print:text-black">
              GSTIN: {settings.gstNumber}
            </p>
          )}
          <div className="inline-block px-3 py-0.5 rounded-full bg-white/[0.05] print:bg-black/5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 print:text-black mt-1">
            TAX INVOICE / BILL OF SUPPLY
          </div>
        </div>

        {/* Invoice Metadata */}
        <div className="py-4 border-b border-dashed border-white/20 print:border-black/30 grid grid-cols-2 text-xs text-zinc-300 print:text-black gap-y-1.5 font-mono">
          <div>
            <span className="text-zinc-500 print:text-zinc-600">Bill No:</span>{" "}
            <strong>#{order.orderNumber}</strong>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 print:text-zinc-600">Date:</span>{" "}
            <strong>{new Date(order.createdAt).toLocaleDateString("en-IN")}</strong>
          </div>
          <div>
            <span className="text-zinc-500 print:text-zinc-600">Type:</span>{" "}
            <strong className="capitalize">{order.orderType}</strong>
            {order.tableNumber && ` (T-${order.tableNumber})`}
          </div>
          <div className="text-right">
            <span className="text-zinc-500 print:text-zinc-600">Time:</span>{" "}
            <strong>{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-4 border-b border-dashed border-white/20 print:border-black/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/20 print:border-black/30 text-zinc-400 print:text-black uppercase text-[10px] tracking-wider">
                <th className="pb-2 text-left font-bold">Item Description</th>
                <th className="pb-2 text-center font-bold">Qty</th>
                <th className="pb-2 text-right font-bold">Rate</th>
                <th className="pb-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] print:divide-black/10">
              {order.items.map((item) => (
                <tr key={item.id} className="text-zinc-200 print:text-black">
                  <td className="py-2 font-medium">{item.itemName}</td>
                  <td className="py-2 text-center font-mono">{item.quantity}</td>
                  <td className="py-2 text-right font-mono text-zinc-400 print:text-black">
                    {formatCurrency(item.unitPriceInPaise, settings.currencySymbol)}
                  </td>
                  <td className="py-2 text-right font-mono font-bold">
                    {formatCurrency(item.lineTotalInPaise, settings.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="py-4 border-b border-dashed border-white/20 print:border-black/30 space-y-1.5 text-xs text-zinc-300 print:text-black font-mono">
          <div className="flex justify-between">
            <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>{formatCurrency(order.subtotalInPaise, settings.currencySymbol)}</span>
          </div>

          {order.discountInPaise > 0 && (
            <div className="flex justify-between text-emerald-400 print:text-black">
              <span>Discount ({order.discountPercent}%)</span>
              <span>-{formatCurrency(order.discountInPaise, settings.currencySymbol)}</span>
            </div>
          )}

          {/* Tax Breakdown */}
          {order.taxInPaise > 0 && (
            <>
              <div className="flex justify-between text-zinc-400 print:text-black text-[11px]">
                <span>CGST ({halfTaxPercent}%)</span>
                <span>+{formatCurrency(halfTaxPaise, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 print:text-black text-[11px]">
                <span>SGST ({halfTaxPercent}%)</span>
                <span>+{formatCurrency(order.taxInPaise - halfTaxPaise, settings.currencySymbol)}</span>
              </div>
            </>
          )}

          {order.serviceInPaise > 0 && (
            <div className="flex justify-between text-zinc-400 print:text-black text-[11px]">
              <span>Service Charge ({order.servicePercent}%)</span>
              <span>+{formatCurrency(order.serviceInPaise, settings.currencySymbol)}</span>
            </div>
          )}

          {/* Grand Total Row */}
          <div className="pt-2 border-t-2 border-white/40 print:border-black flex justify-between items-baseline text-sm sm:text-base font-black text-white print:text-black">
            <span>NET TOTAL</span>
            <span>{formatCurrency(order.totalInPaise, settings.currencySymbol)}</span>
          </div>
        </div>

        {/* Payments Summary */}
        <div className="py-4 border-b border-dashed border-white/20 print:border-black/30 space-y-1 text-xs text-zinc-300 print:text-black font-mono">
          <div className="flex justify-between">
            <span>Paid Amount</span>
            <span className="font-bold">{formatCurrency(totalPaid, settings.currencySymbol)}</span>
          </div>
          {order.payments.map((p) => (
            <div key={p.id} className="flex justify-between text-[11px] text-zinc-400 print:text-zinc-700">
              <span className="capitalize">• {p.method} {p.reference ? `(${p.reference})` : ""}</span>
              <span>{formatCurrency(p.amountInPaise, settings.currencySymbol)}</span>
            </div>
          ))}

          {balanceRemaining > 0 ? (
            <div className="flex justify-between text-amber-400 print:text-black font-bold pt-1">
              <span>Balance Due</span>
              <span>{formatCurrency(balanceRemaining, settings.currencySymbol)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-emerald-400 print:text-black font-bold pt-1">
              <span>Bill Status</span>
              <span>PAID IN FULL ✓</span>
            </div>
          )}
        </div>

        {/* Footer Greetings */}
        <div className="pt-6 text-center space-y-2 text-xs text-zinc-400 print:text-zinc-700">
          <p className="font-semibold">{settings.receiptFooter}</p>
          <p className="text-[10px] text-zinc-500 print:text-zinc-500">
            Computer generated tax invoice • No signature required
          </p>
        </div>
      </div>
    </div>
  );
}
