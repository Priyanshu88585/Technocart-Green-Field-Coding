import Link from "next/link";
import { getDashboardStats, getOrders } from "@/app/actions";
import { formatCurrency } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, activeOrdersList] = await Promise.all([
    getDashboardStats(),
    getOrders("active"),
  ]);

  const averageOrderValue =
    stats.ordersToday > 0 ? Math.round(stats.revenueToday / stats.ordersToday) : 0;

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            POS Live Terminal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Restaurant Operations & Billing
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Real-time table orders, kitchen pipeline, revenue overview, and billing settlement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Take New Order
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-zinc-200 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            All Orders
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Today */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Today&apos;s Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <span className="font-semibold text-base">₹</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(stats.revenueToday)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span>Settled bills today</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
        </div>

        {/* Orders Today */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Orders Count
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stats.ordersToday}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
              <span>Recorded today</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
        </div>

        {/* Active Dining / Kitchen */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
              {stats.activeOrders}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Tables / Takeaway pending</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all" />
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Avg. Ticket Size (AOV)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(averageOrderValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
              <span>Per customer ticket</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
        </div>
      </div>

      {/* Active Orders Live Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Live Active Tables & Orders
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {activeOrdersList.length} In-Progress
            </span>
          </div>
          <Link
            href="/orders"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-1"
          >
            Manage all orders
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {activeOrdersList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-300">No active orders right now</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              All tables are settled and clear. Click &apos;Take New Order&apos; to start taking orders from customers.
            </p>
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/80 text-white text-xs font-medium hover:bg-purple-600 transition-colors"
            >
              Start New Order
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrdersList.map((order) => {
              const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-zinc-900/70 border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                            order.orderType === "dine-in"
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {order.orderType}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">{orderTime}</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-lg font-bold text-zinc-100">
                        {order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway / Parcel"}
                      </div>
                      <div className="text-base font-bold text-purple-400 font-mono">
                        {formatCurrency(order.totalInPaise)}
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                      <div className="text-xs text-zinc-400 font-medium">
                        {order.items.length} items ordered:
                      </div>
                      <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 transition-colors"
                    >
                      View & Settle
                    </Link>
                    <Link
                      href={`/billing/${order.id}`}
                      className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-semibold text-purple-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Bill
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Recent Orders & Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Order History
            </h2>
            <Link
              href="/orders"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Type / Table</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-zinc-500">
                      No orders placed today yet. New orders will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono font-medium text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 text-zinc-300">
                        <span className="capitalize">{order.orderType}</span>
                        {order.tableNumber && (
                          <span className="text-zinc-500 ml-1">({order.tableNumber})</span>
                        )}
                      </td>
                      <td className="py-3 text-zinc-400">
                        {order.items.length} items
                      </td>
                      <td className="py-3 font-mono font-semibold text-zinc-100">
                        {formatCurrency(order.totalInPaise)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            order.status === "completed"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : order.status === "active"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Items (1 col) */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Top Selling Dishes
            </h2>
            <Link
              href="/menu"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Menu
            </Link>
          </div>

          <div className="space-y-3">
            {stats.topItems.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                No item sales recorded today yet
              </p>
            ) : (
              stats.topItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                    {item.quantity} sold
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick shortcuts widget */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Quick Management
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/menu"
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-zinc-300 text-center block transition-colors"
              >
                🍽️ Manage Menu
              </Link>
              <Link
                href="/settings"
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-zinc-300 text-center block transition-colors"
              >
                ⚙️ Tax & Store Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
