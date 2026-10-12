"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, rupeesToPaise } from "@/lib/money";
import { recordPayment, updateOrderStatus, addItemToOrder } from "@/app/actions";
import { useToast } from "@/components/ui/ToastProvider";

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

interface MenuItem {
  id: string;
  name: string;
  priceInPaise: number;
  category: string;
  available: boolean;
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
  completedAt: Date | null;
  items: OrderItem[];
  payments: Payment[];
}

export function OrderDetailClient({
  initialOrder,
  menuItems,
}: {
  initialOrder: Order;
  menuItems: MenuItem[];
}) {
  const { addToast } = useToast();
  const [order, setOrder] = useState<Order>(initialOrder);

  // Payment form state
  const totalPaid = order.payments.reduce((sum, p) => sum + p.amountInPaise, 0);
  const balanceRemaining = Math.max(0, order.totalInPaise - totalPaid);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "other">("cash");
  const [paymentAmountRupees, setPaymentAmountRupees] = useState<number>(balanceRemaining / 100);
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // Add Item to existing order state
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>(menuItems[0]?.id || "");
  const [addQuantity, setAddQuantity] = useState<number>(1);
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmountRupees <= 0) {
      addToast("Payment amount must be greater than 0", "warning");
      return;
    }

    const amountInPaise = rupeesToPaise(paymentAmountRupees);
    if (amountInPaise > balanceRemaining) {
      addToast("Payment cannot exceed outstanding balance", "warning");
      return;
    }

    setIsPaying(true);
    try {
      const res = await recordPayment({
        orderId: order.id,
        amountInPaise,
        method: paymentMethod,
        reference: paymentRef,
      });

      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast(`Payment of ${formatCurrency(amountInPaise)} recorded!`, "success");
        // refresh local state
        const newPaid = totalPaid + amountInPaise;
        const newStatus = newPaid >= order.totalInPaise ? "completed" : order.status;
        setOrder((prev) => ({
          ...prev,
          status: newStatus,
          payments: [
            ...prev.payments,
            {
              id: res.data?.id || crypto.randomUUID(),
              amountInPaise,
              method: paymentMethod,
              reference: paymentRef,
              createdAt: new Date(),
            },
          ],
        }));
        setPaymentRef("");
        setPaymentAmountRupees(Math.max(0, (order.totalInPaise - newPaid) / 100));
      }
    } catch {
      addToast("Failed to record payment", "error");
    } finally {
      setIsPaying(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === "cancelled" && !confirm("Cancel this order?")) return;
    try {
      const res = await updateOrderStatus(order.id, newStatus);
      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast(`Order marked as ${newStatus}`, "success");
        setOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const menuItem = menuItems.find((m) => m.id === selectedMenuItemId);
    if (!menuItem) return;

    setIsAddingItem(true);
    try {
      const res = await addItemToOrder(order.id, {
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        unitPriceInPaise: menuItem.priceInPaise,
        quantity: addQuantity,
      });

      if (res.error) {
        addToast(res.error, "error");
      } else if (res.data) {
        addToast(`Added ${addQuantity}x ${menuItem.name} to order!`, "success");
        setOrder((prev) => ({
          ...prev,
          ...res.data,
          items: res.data.items,
        }));
        setShowAddItem(false);
        setAddQuantity(1);
        const updatedTotal = res.data.totalInPaise;
        const remaining = Math.max(0, updatedTotal - totalPaid);
        setPaymentAmountRupees(remaining / 100);
      }
    } catch {
      addToast("Failed to add dish", "error");
    } finally {
      setIsAddingItem(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Details Header Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-bold text-white">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                order.status === "completed"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : order.status === "active"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              {order.status === "active" && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
              {order.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-2">
            <span>
              Type: <strong className="text-zinc-200 capitalize">{order.orderType}</strong>
            </span>
            {order.tableNumber && (
              <span>
                Table: <strong className="text-purple-400">{order.tableNumber}</strong>
              </span>
            )}
            <span>
              Placed:{" "}
              <strong className="text-zinc-300 font-mono">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </strong>
            </span>
            {order.note && (
              <span className="text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded">
                Note: {order.note}
              </span>
            )}
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/billing/${order.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Tax Bill
          </Link>

          {order.status === "active" && (
            <>
              <button
                onClick={() => handleStatusUpdate("completed")}
                className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
              >
                ✓ Mark Completed
              </button>
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-colors"
              >
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ordered Items List & Add Item (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">
                Ordered Items ({order.items.length})
              </h2>

              {order.status === "active" && (
                <button
                  onClick={() => setShowAddItem(!showAddItem)}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {showAddItem ? "Close Item Picker" : "Add More Items"}
                </button>
              )}
            </div>

            {/* Expandable Add Item Form */}
            {showAddItem && (
              <form
                onSubmit={handleAddItem}
                className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3"
              >
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Append Additional Dish to Table
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedMenuItemId}
                      onChange={(e) => setSelectedMenuItemId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {formatCurrency(item.priceInPaise)} ({item.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-xs text-white text-center focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isAddingItem}
                      className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                    >
                      {isAddingItem ? "Adding..." : "+ Add Dish"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Item</th>
                    <th className="pb-3 font-semibold text-center">Qty</th>
                    <th className="pb-3 font-semibold text-right">Rate</th>
                    <th className="pb-3 font-semibold text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-semibold text-zinc-100">{item.itemName}</td>
                      <td className="py-3 text-center font-mono font-medium text-zinc-300">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-400">
                        {formatCurrency(item.unitPriceInPaise)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {formatCurrency(item.lineTotalInPaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History & Settlement */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">
                Payment History & Settlement
              </h2>
              <span
                className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                  balanceRemaining === 0
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                }`}
              >
                {balanceRemaining === 0 ? "Fully Paid" : `Due: ${formatCurrency(balanceRemaining)}`}
              </span>
            </div>

            {order.payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider text-[11px]">
                      <th className="pb-2 font-semibold">Method</th>
                      <th className="pb-2 font-semibold">Amount</th>
                      <th className="pb-2 font-semibold">Reference</th>
                      <th className="pb-2 font-semibold text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {order.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 font-semibold capitalize text-purple-400">
                          {p.method}
                        </td>
                        <td className="py-2.5 font-mono font-bold text-white">
                          {formatCurrency(p.amountInPaise)}
                        </td>
                        <td className="py-2.5 text-zinc-400 font-mono">
                          {p.reference || "Direct Settlement"}
                        </td>
                        <td className="py-2.5 text-right text-zinc-500 font-mono">
                          {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-2">No payment entries recorded yet.</p>
            )}

            {/* Record Payment Form (if balance remaining) */}
            {balanceRemaining > 0 && order.status !== "cancelled" && (
              <form
                onSubmit={handleRecordPayment}
                className="pt-4 border-t border-white/[0.08] space-y-3"
              >
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Record Settlement Payment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="upi">📱 UPI / QR</option>
                      <option value="card">💳 Credit/Debit Card</option>
                      <option value="other">📝 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balanceRemaining / 100}
                      value={paymentAmountRupees}
                      onChange={(e) => setPaymentAmountRupees(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/[0.1] text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      Reference / Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI Ref / Cashier"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                >
                  {isPaying ? "Recording Payment..." : "Record Payment & Complete"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Financial Calculation Summary Card (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">
              Bill Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Items Subtotal</span>
                <span className="font-mono text-zinc-200">
                  {formatCurrency(order.subtotalInPaise)}
                </span>
              </div>

              {order.discountInPaise > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({order.discountPercent}%)</span>
                  <span className="font-mono">
                    -{formatCurrency(order.discountInPaise)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>GST / Tax ({order.taxPercent}%)</span>
                <span className="font-mono text-zinc-200">
                  +{formatCurrency(order.taxInPaise)}
                </span>
              </div>

              {order.serviceInPaise > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Service Charge ({order.servicePercent}%)</span>
                  <span className="font-mono text-zinc-200">
                    +{formatCurrency(order.serviceInPaise)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.08] flex items-baseline justify-between">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Grand Total
                </span>
                <span className="text-xl font-extrabold text-purple-400 font-mono">
                  {formatCurrency(order.totalInPaise)}
                </span>
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex justify-between text-xs text-zinc-400">
                <span>Total Paid</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatCurrency(totalPaid)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-zinc-400">
                <span>Balance Due</span>
                <span className="font-mono text-amber-400 font-bold">
                  {formatCurrency(balanceRemaining)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link
                href={`/billing/${order.id}`}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                View Customer Receipt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
