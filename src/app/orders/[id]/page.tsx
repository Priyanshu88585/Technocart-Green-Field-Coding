import { notFound } from "next/navigation";
import { getOrder, getMenuItems } from "@/app/actions";
import { OrderDetailClient } from "@/components/orders/OrderDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  return {
    title: order ? `Order #${order.orderNumber}` : "Order Details",
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, menuItems] = await Promise.all([
    getOrder(id),
    getMenuItems(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <OrderDetailClient initialOrder={order} menuItems={menuItems} />
    </div>
  );
}
