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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Orders & Table Management
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Track dining tickets, kitchen orders, settled bills, and cancellations
          </p>
        </div>

        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all self-start sm:self-auto"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
