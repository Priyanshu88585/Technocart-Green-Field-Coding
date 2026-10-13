"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/money";
import { updateOrderStatus } from "@/app/actions";
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
  discountInPaise: number;
  taxInPaise: number;
  serviceInPaise: number;
  totalInPaise: number;
  createdAt: Date;
  items: OrderItem[];
  payments: Payment[];
}

export function OrdersListClient({ initialOrders }: { initialOrders: Order[] }) {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        selectedStatus === "all" || order.status === selectedStatus;
      const matchType =
        selectedType === "all" || order.orderType === selectedType;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        order.orderNumber.toString().includes(q) ||
        order.tableNumber.toLowerCase().includes(q) ||
        (order.note && order.note.toLowerCase().includes(q)) ||
        order.items.some((i) => i.itemName.toLowerCase().includes(q));

      return matchStatus && matchType && matchSearch;
    });
  }, [orders, selectedStatus, selectedType, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast(`Order marked as ${newStatus}`, "success");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      addToast("Failed to update order status", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6 text-foreground max-w-[1500px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Orders" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => {
            const active = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-foreground focus:border-foreground/40 outline-none font-mono transition-colors"
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine-In</option>
            <option value="takeaway">Takeaway</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by #, table, guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none font-mono transition-colors"
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-center space-y-3">
          <div className="w-10 h-10 rounded-xl border border-border bg-surface-elevated flex items-center justify-center mx-auto text-muted-foreground font-mono">
            ∅
          </div>
          <p className="text-sm font-semibold text-foreground">No orders matching your criteria</p>
          <p className="text-xs font-mono text-muted-foreground">
            Try switching filters or clear the search query.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase tracking-widest text-[10px] font-mono bg-surface-elevated/40">
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Table / Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Dishes Ordered</th>
                  <th className="py-3.5 px-4 font-semibold">Total Bill</th>
                  <th className="py-3.5 px-4 font-semibold">Time</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-4 px-4 font-bold text-foreground">
                        #{order.orderNumber}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-border bg-surface-elevated text-foreground/80">
                          {order.orderType}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-foreground">
                        <div>{order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway"}</div>
                        {order.note && (
                          <div className="text-[10px] text-muted-foreground truncate max-w-[140px] mt-0.5">
                            {order.note}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs font-sans">
                        <div className="text-foreground/80 truncate font-medium">
                          {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} total pcs
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-foreground">
                        {formatCurrency(order.totalInPaise)}
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        {dateStr}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
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
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/30 text-foreground font-medium text-xs transition-colors"
                          >
                            KOT
                          </Link>

                          <Link
                            href={`/billing/${order.id}`}
                            className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
                          >
                            Bill
                          </Link>

                          {order.status === "active" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "completed")}
                              disabled={isUpdating === order.id}
                              className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Settle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
