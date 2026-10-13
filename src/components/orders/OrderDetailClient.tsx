"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/money";
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
  reference?: string | null;
  createdAt: Date;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceInPaise: number;
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

  const totalPaid = order.payments.reduce((sum, p) => sum + p.amountInPaise, 0);
  const balanceRemaining = Math.max(0, order.totalInPaise - totalPaid);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "other">("cash");
  const [paymentAmountRupees, setPaymentAmountRupees] = useState<number>(balanceRemaining / 100);
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(menuItems[0]?.id || "");
  const [addQuantity, setAddQuantity] = useState(1);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountInPaise = Math.round(paymentAmountRupees * 100);
    if (amountInPaise <= 0) {
      addToast("Payment amount must be greater than zero", "warning");
      return;
    }
    if (amountInPaise > balanceRemaining) {
      addToast("Payment exceeds balance due", "warning");
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
        const newPaid = totalPaid + amountInPaise;
        const fullyPaid = newPaid >= order.totalInPaise;

        setOrder((prev) => ({
          ...prev,
          status: fullyPaid ? "completed" : prev.status,
          payments: [
            ...prev.payments,
            {
              id: res.data?.id || Math.random().toString(),
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
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        addToast(`Order marked as ${newStatus}`, "success");
      } else if (res.error) {
        addToast(res.error, "error");
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
    <div className="space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-bold text-foreground">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border ${
                order.status === "completed"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : order.status === "active"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                  : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {order.status === "active" && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
              {order.status}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider border border-border bg-surface-elevated text-foreground/80">
              {order.orderType}
            </span>
          </div>

          <p className="text-xs font-mono text-muted-foreground mt-2">
            Created: {new Date(order.createdAt).toLocaleString("en-IN")} • Location:{" "}
            {order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway / Parcel"}
          </p>
          {order.note && (
            <p className="text-xs font-mono text-foreground/80 mt-1 bg-surface-elevated/50 p-2 rounded-lg border border-border">
              Notes: {order.note}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/billing/${order.id}`}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Generate Tax Bill
          </Link>

          {order.status === "active" && (
            <button
              onClick={() => handleStatusUpdate("completed")}
              className="px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Mark Completed
            </button>
          )}

          {order.status !== "cancelled" && (
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              className="px-3.5 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Kitchen Order Items ({order.items.length})
              </h2>
              {order.status === "active" && (
                <button
                  onClick={() => setShowAddItem(!showAddItem)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showAddItem ? "✕ Cancel Add" : "+ Add Dish"}
                </button>
              )}
            </div>

            {showAddItem && (
              <form
                onSubmit={handleAddItem}
                className="p-4 rounded-xl border border-border bg-surface-elevated/40 space-y-3"
              >
                <div className="text-xs font-mono uppercase text-muted-foreground">Add to Kitchen Ticket</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedMenuItemId}
                      onChange={(e) => setSelectedMenuItemId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground focus:border-foreground/40 outline-none font-mono"
                    >
                      {menuItems.map((m) => (
                        <option key={m.id} value={m.id} disabled={!m.available}>
                          {m.name} ({formatCurrency(m.priceInPaise)}) {!m.available && "[Sold Out]"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground focus:border-foreground/40 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingItem}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isAddingItem ? "Adding..." : "Add to Order"}
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-widest text-[10px]">
                    <th className="py-2.5 px-2">Dish</th>
                    <th className="py-2.5 px-2 text-right">Rate</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20">
                      <td className="py-3 px-2 font-medium text-foreground">{item.itemName}</td>
                      <td className="py-3 px-2 text-right text-muted-foreground">
                        {formatCurrency(item.unitPriceInPaise)}
                      </td>
                      <td className="py-3 px-2 text-center text-foreground font-bold">
                        x{item.quantity}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-foreground">
                        {formatCurrency(item.lineTotalInPaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotalInPaise)}</span>
              </div>
              {order.discountInPaise > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount ({order.discountPercent}%)</span>
                  <span>-{formatCurrency(order.discountInPaise)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>CGST ({order.taxPercent / 2}%)</span>
                <span>{formatCurrency(Math.round(order.taxInPaise / 2))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>SGST ({order.taxPercent / 2}%)</span>
                <span>{formatCurrency(order.taxInPaise - Math.round(order.taxInPaise / 2))}</span>
              </div>
              {order.serviceInPaise > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge ({order.servicePercent}%)</span>
                  <span>+{formatCurrency(order.serviceInPaise)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Final Total Due</span>
                <span>{formatCurrency(order.totalInPaise)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
              Settlement Status
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface flex justify-between items-baseline">
                <span className="text-muted-foreground text-[11px] uppercase">Paid So Far</span>
                <span className="text-emerald-500 font-bold text-sm">
                  {formatCurrency(totalPaid)}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface flex justify-between items-baseline">
                <span className="text-muted-foreground text-[11px] uppercase">Balance Remaining</span>
                <span
                  className={`font-bold text-sm ${
                    balanceRemaining > 0 ? "text-amber-500" : "text-emerald-500"
                  }`}
                >
                  {formatCurrency(balanceRemaining)}
                </span>
              </div>
            </div>

            {order.payments.length > 0 ? (
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
                  Payment History
                </div>
                <table className="w-full text-xs font-mono">
                  <tbody className="divide-y divide-border">
                    {order.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 text-foreground font-medium uppercase text-[11px]">
                          {p.method}
                        </td>
                        <td className="py-2 text-muted-foreground text-[10px]">
                          {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2 text-right text-emerald-500 font-bold">
                          {formatCurrency(p.amountInPaise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs font-mono text-muted-foreground py-2">No payment entries recorded yet.</p>
            )}

            {balanceRemaining > 0 && order.status !== "cancelled" && (
              <form
                onSubmit={handleRecordPayment}
                className="pt-4 border-t border-border space-y-3"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Record Settlement Payment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                      Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "cash" | "card" | "upi" | "other")}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground focus:border-foreground/40 outline-none font-mono transition-colors"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="upi">📱 UPI / QR</option>
                      <option value="card">💳 Credit/Debit Card</option>
                      <option value="other">📝 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balanceRemaining / 100}
                      value={paymentAmountRupees}
                      onChange={(e) => setPaymentAmountRupees(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground focus:border-foreground/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                      Ref / Txn ID
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying || paymentAmountRupees <= 0}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  {isPaying ? "Recording Payment..." : "Record Payment Entry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
