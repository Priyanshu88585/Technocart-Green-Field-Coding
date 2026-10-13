"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
}

interface CartItem {
  menuItemId: string;
  itemName: string;
  unitPriceInPaise: number;
  quantity: number;
}

interface Settings {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  currency?: string;
  currencySymbol?: string;
  defaultTax?: number;
  defaultService?: number;
  receiptFooter?: string;
}

interface OrderTerminalProps {
  items: MenuItem[];
  settings: Settings;
}

const QUICK_TABLES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export function OrderTerminal({
  items,
  settings,
}: OrderTerminalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTable = searchParams.get("table") || "1";

  const { addToast } = useToast();

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  }, [items]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [tableNumber, setTableNumber] = useState<string>(initialTable);
  const [prevInitialTable, setPrevInitialTable] = useState<string>(initialTable);
  if (prevInitialTable !== initialTable) {
    setPrevInitialTable(initialTable);
    setTableNumber(initialTable);
  }
  const [customTable, setCustomTable] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

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
    setCustomerName("");
    setCustomerPhone("");
    setDiscountPercent(0);
  };

  const bill = useMemo(() => {
    return calculateBill(
      cart.map((i) => ({ unitPriceInPaise: i.unitPriceInPaise, quantity: i.quantity })),
      discountPercent,
      settings.defaultTax,
      settings.defaultService
    );
  }, [cart, discountPercent, settings.defaultTax, settings.defaultService]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addToast("Please select at least one dish for the order ticket", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalTable = orderType === "dine-in" ? (customTable || tableNumber) : "";
      
      let orderNotes = note.trim();
      if (customerName || customerPhone) {
        const crmInfo = `Guest: ${customerName || "Walk-in"}${customerPhone ? ` (${customerPhone})` : ""}`;
        orderNotes = orderNotes ? `${crmInfo} • ${orderNotes}` : crmInfo;
      }

      const res = await createOrder({
        orderType,
        tableNumber: finalTable,
        note: orderNotes,
        discountPercent,
        taxPercent: settings.defaultTax,
        servicePercent: settings.defaultService,
        items: cart.map((i) => ({
          menuItemId: i.menuItemId,
          itemName: i.itemName,
          unitPriceInPaise: i.unitPriceInPaise,
          quantity: i.quantity,
        })),
      });

      if (res?.error) {
        addToast(res.error, "error");
        setIsSubmitting(false);
        return;
      }

      addToast(`Order #${res.data?.orderNumber} created & sent to KOT!`, "success");
      clearCart();
      router.push(`/orders/${res.data?.id}`);
    } catch {
      addToast("Failed to place order. Please check server connection.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full max-h-screen overflow-hidden text-foreground bg-background">
      <div className="flex-1 flex flex-col min-w-0 border-r border-border bg-card/30 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border space-y-4 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                placeholder="Search dishes (e.g., Dum Biryani, Paneer, Naan, Gulab Jamun)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {filteredItems.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-10 h-10 rounded-xl border border-border bg-surface-elevated flex items-center justify-center text-muted-foreground mb-3 font-mono">
                ∅
              </div>
              <p className="text-sm font-semibold text-foreground">No dishes match your query</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                Try searching with another keyword or pick a different category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item, idx) => {
                const inCart = cart.find((i) => i.menuItemId === item.id);
                const num = (idx + 1).toString().padStart(2, "0");

                return (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                      !item.available
                        ? "opacity-40 border-border bg-card/20 cursor-not-allowed"
                        : inCart
                        ? "border-foreground/40 bg-card/80 shadow-md ring-1 ring-border"
                        : "border-border bg-card/60 hover:border-foreground/30 hover:bg-card hover:shadow-lg"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {item.category} • #{num}
                        </span>
                        {inCart && (
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {inCart.quantity}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-border flex items-baseline justify-between">
                      <div className="text-sm font-bold font-mono text-foreground">
                        {formatCurrency(item.priceInPaise, settings.currencySymbol)}
                      </div>

                      <div className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                        <span>+ Add</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-card/40 shrink-0 border-l border-border h-full max-h-screen">
        <div className="p-4 sm:p-5 border-b border-border space-y-3 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                KOT Ticket
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-elevated text-foreground/80 border border-border">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] font-mono text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 p-1 rounded-xl border border-border bg-surface">
            <button
              onClick={() => setOrderType("dine-in")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                orderType === "dine-in"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🍽️ Dine-In Table
            </button>
            <button
              onClick={() => setOrderType("takeaway")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                orderType === "takeaway"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🛍️ Takeaway / Parcel
            </button>
          </div>

          {orderType === "dine-in" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Select Dining Table:</span>
                <span className="text-foreground font-semibold">
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isSel
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      T-{t}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Or custom location (e.g. Terrace-VIP, Booth-2)"
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none font-mono transition-colors"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
            <input
              type="text"
              placeholder="Guest Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors"
            />
            <input
              type="tel"
              placeholder="Mobile Phone (optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none font-mono transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-9 h-9 rounded-xl border border-border bg-surface-elevated flex items-center justify-center text-muted-foreground mb-2">
                🛒
              </div>
              <p className="text-xs font-semibold text-foreground">Order ticket is empty</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Click dish cards on the left to build order ticket.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItemId}
                className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {item.itemName}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {formatCurrency(item.unitPriceInPaise, settings.currencySymbol)} each
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="w-6 h-6 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-mono text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="w-6 h-6 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-mono text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-foreground">
                    {formatCurrency(item.unitPriceInPaise * item.quantity, settings.currencySymbol)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="text-[10px] font-mono text-muted-foreground hover:text-destructive transition-colors mt-0.5 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-border bg-card/80 space-y-3">
          <input
            type="text"
            placeholder="Kitchen notes (e.g. less spicy, allergy warning)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors"
          />

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal ({cart.length} items)</span>
              <span className="text-foreground font-medium">
                {formatCurrency(bill.subtotalInPaise, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span>Discount %</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent || ""}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-12 px-1.5 py-0.5 rounded border border-border bg-surface text-xs text-center text-foreground focus:border-foreground/40 outline-none"
                />
              </div>
              <span className="text-emerald-500 font-semibold">
                -{formatCurrency(bill.discountInPaise, settings.currencySymbol)}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>GST ({settings.defaultTax ?? 5}%)</span>
              <span className="text-foreground">
                +{formatCurrency(bill.taxInPaise, settings.currencySymbol || "₹")}
              </span>
            </div>

            {(settings.defaultService ?? 0) > 0 && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Service Charge ({settings.defaultService}%)</span>
                <span className="text-foreground">
                  +{formatCurrency(bill.serviceInPaise, settings.currencySymbol || "₹")}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-foreground font-mono">
                {formatCurrency(bill.totalInPaise, settings.currencySymbol)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Dispatching KOT to Kitchen...</span>
              </>
            ) : (
              <>
                <span>Dispatch KOT &amp; Place Order</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
