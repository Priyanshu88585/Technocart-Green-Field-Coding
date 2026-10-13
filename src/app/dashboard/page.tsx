import Link from "next/link";
import { getDashboardStats, getOrders } from "@/app/actions";
import { formatCurrency } from "@/lib/money";

export const dynamic = "force-dynamic";

const FLOOR_TABLES = [
  { id: "1", name: "T-01", capacity: "2-Top" },
  { id: "2", name: "T-02", capacity: "2-Top" },
  { id: "3", name: "T-03", capacity: "4-Top" },
  { id: "4", name: "T-04", capacity: "4-Top" },
  { id: "5", name: "T-05", capacity: "4-Top" },
  { id: "6", name: "T-06", capacity: "6-Top" },
  { id: "7", name: "T-07", capacity: "6-Top" },
  { id: "8", name: "T-08", capacity: "8-Top" },
  { id: "9", name: "T-09", capacity: "Private Booth" },
  { id: "10", name: "T-10", capacity: "Window View" },
  { id: "11", name: "T-11", capacity: "Chef Counter" },
  { id: "12", name: "T-12", capacity: "Terrace VIP" },
];

export default async function DashboardPage() {
  const [stats, activeOrdersList] = await Promise.all([
    getDashboardStats(),
    getOrders("active"),
  ]);

  const averageOrderValue =
    stats.ordersToday > 0 ? Math.round(stats.revenueToday / stats.ordersToday) : 0;

  const tableOccupancyMap = new Map<string, typeof activeOrdersList[0]>();
  for (const order of activeOrdersList) {
    if (order.tableNumber) {
      const num = order.tableNumber.replace(/\D/g, "");
      if (num) tableOccupancyMap.set(num, order);
    }
  }

  const occupiedCount = tableOccupancyMap.size;
  const vacantCount = FLOOR_TABLES.length - occupiedCount;

  return (
    <div className="min-h-full p-6 sm:p-8 lg:p-12 space-y-12 max-w-[1500px] mx-auto text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-border">
        <div>
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-3 tracking-widest uppercase">
            <span className="w-12 h-px bg-border" />
            Floor Operations & CRM Terminal
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Restaurant Operations.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Live kitchen order ticket pipeline, floor table occupancy, revenue metrics, and instant thermal settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders/new"
            className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 rounded-xl whitespace-nowrap shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Take New Order
          </Link>
          <Link
            href="/orders"
            className="px-5 py-3 border border-border bg-card/60 hover:bg-card hover:border-foreground/30 text-foreground text-sm font-semibold transition-all rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            All Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-foreground/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>Today&apos;s Revenue</span>
            <span className="text-foreground/80 font-bold">₹ INR</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrency(stats.revenueToday)}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Settled &amp; Billed in DB</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-foreground/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>Total Orders</span>
            <span className="text-foreground/80 font-mono">COUNT</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold font-mono text-foreground tracking-tight">
            {stats.ordersToday}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border">
            <span>Customer tickets today</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-foreground/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>Active Pipeline</span>
            <span className="text-amber-500 font-mono">LIVE</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold font-mono text-foreground tracking-tight">
            {stats.activeOrders}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>In-kitchen / awaiting bill</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-foreground/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <span>Average Ticket (AOV)</span>
            <span className="text-foreground/80 font-mono">AVG</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold font-mono text-foreground tracking-tight">
            {formatCurrency(averageOrderValue)}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border">
            <span>Per dining party</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground tracking-wider uppercase">
              <span className="w-8 h-px bg-border" />
              Floor Table Matrix
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface-elevated border border-border text-foreground/80">
              {occupiedCount} Occupied / {vacantCount} Available
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            Click occupied table to bill or inspect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FLOOR_TABLES.map((t) => {
            const activeOrder = tableOccupancyMap.get(t.id);
            const isOccupied = !!activeOrder;

            return (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all ${
                  isOccupied
                    ? "border-amber-500/60 bg-amber-500/[0.08]"
                    : "border-border bg-card/60 hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-foreground">{t.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOccupied
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
                        : "bg-emerald-500/60"
                    }`}
                  />
                </div>
                <div className="text-[11px] font-mono text-muted-foreground mb-3">{t.capacity}</div>

                {isOccupied && activeOrder ? (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-baseline justify-between text-xs font-mono">
                      <span className="text-muted-foreground">#{activeOrder.orderNumber}</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(activeOrder.totalInPaise)}
                      </span>
                    </div>
                    <Link
                      href={`/billing/${activeOrder.id}`}
                      className="block text-center py-1.5 px-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-all shadow-sm"
                    >
                      Instant Bill
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/orders/new?table=${t.id}`}
                    className="block text-center py-1.5 px-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/30 text-foreground/70 hover:text-foreground text-[11px] font-mono transition-all"
                  >
                    + Assign Order
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground tracking-wider uppercase">
              <span className="w-8 h-px bg-border" />
              Kitchen Dispatch Pipeline
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface-elevated border border-border text-foreground/80">
              {activeOrdersList.length} Active
            </span>
          </div>
          <Link
            href="/orders"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            Manage All Orders &rarr;
          </Link>
        </div>

        {activeOrdersList.length === 0 ? (
          <div className="p-12 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-center space-y-3">
            <div className="w-10 h-10 rounded-xl border border-border bg-surface-elevated flex items-center justify-center mx-auto text-muted-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground">All tables are clear and settled</p>
            <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto">
              No orders pending in the kitchen. Launch a new order ticket to begin dining service.
            </p>
            <div className="pt-2">
              <Link
                href="/orders/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                + New Order Ticket
              </Link>
            </div>
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
                  className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-foreground/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">
                          #{order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border border-border bg-surface-elevated text-foreground/80">
                          {order.orderType}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{orderTime}</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-base font-semibold text-foreground">
                        {order.tableNumber ? `Table ${order.tableNumber}` : "Takeaway / Parcel"}
                      </div>
                      <div className="text-base font-bold text-foreground font-mono">
                        {formatCurrency(order.totalInPaise)}
                      </div>
                    </div>

                    {order.note && (
                      <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                        <span>{order.note}</span>
                      </div>
                    )}

                    <div className="space-y-1 pt-2 border-t border-border">
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                        {order.items.length} items ordered
                      </div>
                      <div className="text-xs text-foreground/70 line-clamp-2 leading-relaxed font-mono">
                        {order.items.map((i) => `${i.itemName} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 text-center py-2 px-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/30 text-xs font-semibold text-foreground transition-all"
                    >
                      Inspect KOT
                    </Link>
                    <Link
                      href={`/billing/${order.id}`}
                      className="py-2 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Bill &amp; Settle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground tracking-wider uppercase">
              <span className="w-8 h-px bg-border" />
              Recent Order History
            </span>
            <Link
              href="/orders"
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              Full Ledger &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-elevated/40 text-muted-foreground uppercase tracking-widest text-[10px] font-mono">
                  <th className="py-3 px-3 font-semibold">Order</th>
                  <th className="py-3 px-3 font-semibold">Table / Type</th>
                  <th className="py-3 px-3 font-semibold">Items</th>
                  <th className="py-3 px-3 font-semibold">Amount</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground font-mono">
                      No orders placed today yet. New orders will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-medium text-foreground">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3.5 px-3 text-foreground/80 font-mono">
                        <span className="capitalize">{order.orderType}</span>
                        {order.tableNumber && (
                          <span className="text-muted-foreground ml-1">({order.tableNumber})</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-muted-foreground font-mono">
                        {order.items.length} items
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-foreground">
                        {formatCurrency(order.totalInPaise)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                            order.status === "completed"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : order.status === "active"
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                              : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground tracking-wider uppercase">
              <span className="w-8 h-px bg-border" />
              Culinary Leaderboard
            </span>
            <Link
              href="/menu"
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              Menu &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats.topItems.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground py-6 text-center">
                No dish volume recorded today yet
              </p>
            ) : (
              stats.topItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:border-foreground/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-foreground/70 bg-surface-elevated px-2 py-0.5 rounded border border-border">
                    {item.quantity} sold
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-border space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
              Operational Center
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/menu"
                className="p-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/30 text-xs font-semibold text-foreground text-center block transition-all"
              >
                Menu &amp; Dishes
              </Link>
              <Link
                href="/settings"
                className="p-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-foreground/30 text-xs font-semibold text-foreground text-center block transition-all"
              >
                Store &amp; Tax Config
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
