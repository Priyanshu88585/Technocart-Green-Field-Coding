import { getMenuItems, getSettings } from "@/app/actions";
import { OrderTerminal } from "@/components/pos/OrderTerminal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Order (POS)",
};

export default async function NewOrderPage() {
  const [items, settings] = await Promise.all([
    getMenuItems(),
    getSettings(),
  ]);

  return <OrderTerminal items={items} settings={settings} />;
}
