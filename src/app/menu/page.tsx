import { getMenuItems } from "@/app/actions";
import { MenuManagementClient } from "@/components/menu/MenuManagementClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu Management",
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-white/[0.08]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Restaurant Menu Catalog
        </h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Manage food items, categories, pricing, and live kitchen availability
        </p>
      </div>

      <MenuManagementClient initialItems={items} />
    </div>
  );
}
