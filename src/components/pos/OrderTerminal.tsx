"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { calculateBill, formatCurrency } from "@/lib/money";
import { createOrder } from "@/app/actions";
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

interface RestaurantSettings {
  defaultTax: number;
  defaultService: number;
  currencySymbol: string;
}

interface CartItem {
  menuItemId: string;
  itemName: string;
  unitPriceInPaise: number;
  quantity: number;
}

const QUICK_TABLES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "VIP-1"];

export function OrderTerminal({
  items,
  settings,
}: {
  items: MenuItem[];
  settings: RestaurantSettings;
}) {
  const router = useRouter();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [tableNumber, setTableNumber] = useState<string>("1");
  const [customTable, setCustomTable] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  // Filter items by category & search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Cart manipulation
  const addToCart = (item: MenuItem) => {
    if (!item.available) {
      addToast(`${item.name} is currently out of stock`, "warning");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          itemName: item.name,
          unitPriceInPaise: item.priceInPaise,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
    setNote("");
    setDiscountPercent(0);
  };

  // Bill calculations using our strict paise math
  const billItems = useMemo(() => {
    return cart.map((i) => ({
      unitPriceInPaise: i.unitPriceInPaise,
      quantity: i.quantity,
    }));
  }, [cart]);

  const bill = useMemo(() => {
    return calculateBill(
      billItems,
      discountPercent,
      settings.defaultTax,
      settings.defaultService
    );
  }, [billItems, discountPercent, settings.defaultTax, settings.defaultService]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addToast("Please add at least one item to the order", "warning");
      return;
    }

    const finalTable = orderType === "dine-in" ? (customTable || tableNumber) : "";
    if (orderType === "dine-in" && !finalTable) {
      addToast("Please assign a table number for dine-in orders", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        orderType,
        tableNumber: finalTable,
        note,
        discountPercent,
        taxPercent: settings.defaultTax,
        servicePercent: settings.defaultService,
        items: cart,
      });

      if (res.error) {
        addToast(res.error, "error");
        setIsSubmitting(false);
        return;
      }

      addToast(`Order #${res.data?.orderNumber} created successfully!`, "success");
      router.push(`/orders/${res.data?.id}`);
    } catch {
      addToast("Failed to place order. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full max-h-screen overflow-hidden">
      {/* LEFT SECTION: Item Catalog (Scrollable) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.08] bg-black/40 overflow-hidden">
        {/* Top Control Bar: Search & Categories */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] space-y-3 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                width="16"
                height="16"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name (e.g., Paneer, Biryani, Naan)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
              {filteredItems.length} items
            </span>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07] border border-white/[0.06]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-zinc-500 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-400">No dishes found</p>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching with another keyword or pick a different category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredItems.map((item) => {
                const inCart = cart.find((i) => i.menuItemId === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                      !item.available
                        ? "opacity-50 border-white/[0.04] bg-white/[0.01]"
                        : inCart
                        ? "bg-purple-950/20 border-purple-500/40 shadow-sm shadow-purple-500/10"
                        : "bg-zinc-900/60 border-white/[0.08] hover:border-purple-500/30 hover:bg-zinc-900/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400/90">
                          {item.category}
                        </span>
                        {!item.available && (
                          <span className="text-[10px] font-semibold text-rose-400 uppercase bg-rose-500/10 px-1.5 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-mono">
                        {formatCurrency(item.priceInPaise, settings.currencySymbol)}
                      </span>

                      {inCart ? (
                        <div
                          className="flex items-center gap-1.5 bg-purple-600 rounded-lg p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-white hover:bg-purple-700 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-1">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-white hover:bg-purple-700 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={!item.available}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-purple-600 text-zinc-200 hover:text-white transition-all group-hover:border-purple-500/50"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Cart & Billing Sidebar */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col bg-zinc-950 border-l border-white/[0.08] h-full overflow-hidden">
        {/* Order Header / Dine-in vs Takeaway Toggle */}
        <div className="p-4 border-b border-white/[0.08] space-y-3 bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Current Order</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Dine-In vs Takeaway Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setOrderType("dine-in")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                orderType === "dine-in"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🍽️ Dine-In
            </button>
            <button
              onClick={() => setOrderType("takeaway")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                orderType === "takeaway"
                  ? "bg-purple-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🛍️ Takeaway / Parcel
            </button>
          </div>

          {/* Table Selector (Only for Dine-in) */}
          {orderType === "dine-in" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Select Dining Table:</span>
                <span className="text-purple-400 font-semibold">
                  Table {customTable || tableNumber}
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_TABLES.map((t) => {
                  const isSel = !customTable && tableNumber === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setTableNumber(t);
                        setCustomTable("");
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                        isSel
                          ? "bg-purple-600 text-white"
                          : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      T-{t}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Or type custom table (e.g. Garden-2, VIP)"
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          )}
        </div>

        {/* Cart Items List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-white/[0.04]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-zinc-500 space-y-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-sm font-medium text-zinc-400">Your cart is empty</p>
              <p className="text-xs text-zinc-500 max-w-[220px]">
                Click dishes on the menu to add them to this order ticket.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.menuItemId} className="py-3 flex items-center justify-between gap-3 group">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-100 truncate">
                    {item.itemName}
                  </h4>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {formatCurrency(item.unitPriceInPaise, settings.currencySymbol)} each
                  </div>
                </div>

                {/* Qty controller */}
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/[0.1] text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-bold text-white px-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/[0.1] text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <div className="text-right min-w-[70px]">
                  <div className="font-mono text-xs font-bold text-white">
                    {formatCurrency(item.unitPriceInPaise * item.quantity, settings.currencySymbol)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Notes & Calculations Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-zinc-950/90 space-y-3">
          {/* Notes Input */}
          <input
            type="text"
            placeholder="Special instructions (e.g. less oil, extra spicy)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
          />

          {/* Discount & Calculations */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-mono font-medium text-zinc-200">
                {formatCurrency(bill.subtotalInPaise, settings.currencySymbol)}
              </span>
            </div>

            {/* Discount selector */}
            <div className="flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span>Discount %</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent || ""}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-12 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-xs text-center text-white focus:outline-none"
                />
              </div>
              <span className="font-mono text-emerald-400">
                -{formatCurrency(bill.discountInPaise, settings.currencySymbol)}
              </span>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between text-zinc-400">
              <span>GST ({settings.defaultTax}%)</span>
              <span className="font-mono text-zinc-200">
                +{formatCurrency(bill.taxInPaise, settings.currencySymbol)}
              </span>
            </div>

            {/* Service Charge if applicable */}
            {settings.defaultService > 0 && (
              <div className="flex items-center justify-between text-zinc-400">
                <span>Service Charge ({settings.defaultService}%)</span>
                <span className="font-mono text-zinc-200">
                  +{formatCurrency(bill.serviceInPaise, settings.currencySymbol)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Total Amount
              </span>
              <span className="text-xl font-extrabold text-purple-400 font-mono">
                {formatCurrency(bill.totalInPaise, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Placing Order...
              </>
            ) : (
              <>
                Place Order & Open Ticket
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
