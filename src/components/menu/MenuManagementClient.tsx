"use client";

import { useState, useMemo } from "react";
import { formatCurrency, rupeesToPaise } from "@/lib/money";
import { createMenuItem, updateMenuItem, deleteMenuItem } from "@/app/actions";
import { useToast } from "@/components/ui/ToastProvider";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  priceInPaise: number;
  available: boolean;
  sortOrder: number;
}

const DEFAULT_CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
];

export function MenuManagementClient({ initialItems }: { initialItems: MenuItem[] }) {
  const { addToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [formCustomCategory, setFormCustomCategory] = useState<string>("");
  const [formPriceRupees, setFormPriceRupees] = useState<number>(0);
  const [formDescription, setFormDescription] = useState<string>("");
  const [formAvailable, setFormAvailable] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.category));
    DEFAULT_CATEGORIES.forEach((cat) => set.add(cat));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory(DEFAULT_CATEGORIES[0]);
    setFormCustomCategory("");
    setFormPriceRupees(0);
    setFormDescription("");
    setFormAvailable(true);
    setShowAddModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormCustomCategory("");
    setFormPriceRupees(item.priceInPaise / 100);
    setFormDescription(item.description);
    setFormAvailable(item.available);
    setShowAddModal(true);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedStatus = !item.available;
    try {
      const res = await updateMenuItem(item.id, { available: updatedStatus });
      if (res.error) {
        addToast(res.error, "error");
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, available: updatedStatus } : i))
        );
        addToast(
          `${item.name} is now marked ${updatedStatus ? "Available" : "Sold Out"}`,
          "info"
        );
      }
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      const res = await deleteMenuItem(item.id);
      if (res.error) {
        addToast(res.error, "error");
      } else {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        addToast(`Deleted ${item.name}`, "success");
      }
    } catch {
      addToast("Failed to delete item", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast("Dish name is required", "warning");
      return;
    }
    if (formPriceRupees <= 0) {
      addToast("Price must be at least ₹1", "warning");
      return;
    }

    const finalCategory = formCustomCategory.trim() || formCategory;
    const priceInPaise = rupeesToPaise(formPriceRupees);

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await updateMenuItem(editingItem.id, {
          name: formName.trim(),
          category: finalCategory,
          priceInPaise,
          description: formDescription.trim(),
          available: formAvailable,
        });

        if (res.error) {
          addToast(res.error, "error");
        } else if (res.data) {
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? res.data! : i))
          );
          addToast("Menu item updated!", "success");
          setShowAddModal(false);
        }
      } else {
        const res = await createMenuItem({
          name: formName.trim(),
          category: finalCategory,
          priceInPaise,
          description: formDescription.trim(),
          available: formAvailable,
          sortOrder: items.length + 1,
        });

        if (res.error) {
          addToast(res.error, "error");
        } else if (res.data) {
          setItems((prev) => [...prev, res.data!]);
          addToast("New dish added to menu!", "success");
          setShowAddModal(false);
        }
      }
    } catch {
      addToast("Failed to save menu item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
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
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Dish
          </button>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border backdrop-blur-md transition-all flex flex-col justify-between space-y-4 ${
              !item.available
                ? "bg-zinc-950/40 border-white/[0.04] opacity-75"
                : "bg-zinc-900/60 border-white/[0.08] hover:border-purple-500/30"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                  {item.category}
                </span>

                {/* Instant Availability Switch */}
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    item.available
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                  }`}
                  title="Click to toggle availability"
                >
                  {item.available ? "In Stock" : "Sold Out"}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
              {item.description && (
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-base font-bold text-white font-mono">
                {formatCurrency(item.priceInPaise)}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete Item"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-white/[0.1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Menu Dish" : "Add New Dish"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadai Paneer, Tandoori Roti"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={formPriceRupees || ""}
                    onChange={(e) => setFormPriceRupees(parseFloat(e.target.value) || 0)}
                    placeholder="250"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Custom Category (optional)
                </label>
                <input
                  type="text"
                  placeholder="Or enter new category name"
                  value={formCustomCategory}
                  onChange={(e) => setFormCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Description / Ingredients
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the dish"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formAvailable}
                  onChange={(e) => setFormAvailable(e.target.checked)}
                  className="rounded border-white/20 bg-zinc-950 text-purple-600 focus:ring-0"
                />
                <label htmlFor="availCheck" className="text-xs text-zinc-300 select-none cursor-pointer">
                  Available in POS & Taking Orders
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  {isSubmitting ? "Saving..." : editingItem ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
