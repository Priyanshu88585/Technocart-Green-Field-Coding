import { notFound } from "next/navigation";
import { getOrder, getSettings } from "@/app/actions";
import { InvoiceClient } from "@/components/billing/InvoiceClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  return {
    title: order ? `Bill #${order.orderNumber}` : "Invoice",
  };
}

export default async function BillingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrder(id),
    getSettings(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <InvoiceClient order={order} settings={settings} />
    </div>
  );
}
