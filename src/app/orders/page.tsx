import Link from "next/link";
import { getOrders } from "@/app/actions";
import { OrdersListClient } from "@/components/orders/OrdersListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders Management",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-px bg-white/20" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
              02 // ORDERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Orders & Floor Ledger
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Track dining tickets, kitchen pipelines, settled receipts, and guest accounts
          </p>
        </div>

        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-all self-start sm:self-auto shadow-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Take New Order
        </Link>
      </div>

      <OrdersListClient initialOrders={orders} />
    </div>
  );
}
