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
        order.items.some((i) => i.itemName.toLowerCase().includes(q));

      return matchStatus && matchType && matchSearch;
    });
  }, [orders, selectedStatus, selectedType, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "cancelled" && !confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    setIsUpdating(id);
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast(`Order updated to ${newStatus}`, "success");
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      addToast("Failed to update status", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md">
        {/* Status Tabs */}
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right filters: Order Type & Search */}
        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-200 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine-In</option>
            <option value="takeaway">Takeaway</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
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
              placeholder="Filter by #, table, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      {/* Orders Table / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto text-zinc-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-300">No orders matching your criteria</p>
          <p className="text-xs text-zinc-500">
            Try switching filters or clear the search query.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider text-[11px] bg-white/[0.02]">
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Table</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Bill</th>
                  <th className="py-3.5 px-4 font-semibold">Time</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        #{order.orderNumber}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                            order.orderType === "dine-in"
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {order.orderType}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-medium text-zinc-200">
                        {order.tableNumber ? `Table ${order.tableNumber}` : "—"}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-zinc-300 truncate font-medium">
                          {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} total pcs
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-zinc-100">
                        {formatCurrency(order.totalInPaise)}
                      </td>

                      <td className="py-4 px-4 text-zinc-400 font-mono">
                        {dateStr}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
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
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-semibold text-xs transition-colors"
                          >
                            Details
                          </Link>

                          <Link
                            href={`/billing/${order.id}`}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-colors"
                          >
                            Bill
                          </Link>

                          {order.status === "active" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "completed")}
                              disabled={isUpdating === order.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
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
