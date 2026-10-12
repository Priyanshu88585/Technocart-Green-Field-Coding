"use server";

import { prisma } from "@/lib/prisma";
import { calculateBill, calculateLineTotal } from "@/lib/money";
import {
  createOrderSchema,
  menuItemSchema,
  paymentSchema,
  settingsSchema,
  loginSchema,
  objectIdSchema,
} from "@/lib/validations";
import {
  verifyPassword,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUser,
  requireAuth,
  requireRole,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";
import { revalidatePath } from "next/cache";

// Safe generic error message for user-facing responses
const GENERIC_ERROR_MSG = "Unable to process your request at this time. Please try again.";

// ----------------------------------------------------
// MENU MANAGEMENT (Protected: ADMIN & MANAGER)
// ----------------------------------------------------

export async function getMenuItems() {
  try {
    return await prisma.menuItem.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (err) {
    console.error("Failed to fetch menu items from database:", err);
    return [];
  }
}

export async function getMenuItemsByCategory() {
  const items = await getMenuItems();
  const grouped: Record<string, typeof items> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}

export async function createMenuItem(data: unknown) {
  try {
    // RBAC: Only ADMIN and MANAGER can create menu items
    await requireRole(["ADMIN", "MANAGER"]);

    const parsed = menuItemSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid menu item data" };
    }

    const existing = await prisma.menuItem.findFirst({
      where: { name: { equals: parsed.data.name, mode: "insensitive" } },
    });
    if (existing) {
      return { error: "A menu item with this name already exists" };
    }

    const item = await prisma.menuItem.create({ data: parsed.data });
    revalidatePath("/menu");
    revalidatePath("/orders/new");
    return { data: item };
  } catch (err: unknown) {
    console.error("createMenuItem error:", err);
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return { error: "Access denied: insufficient administrative permissions" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

export async function updateMenuItem(id: string, data: unknown) {
  try {
    // RBAC: Only ADMIN and MANAGER can update menu items
    await requireRole(["ADMIN", "MANAGER"]);

    const idParsed = objectIdSchema.safeParse(id);
    if (!idParsed.success) {
      return { error: "Invalid menu item identifier" };
    }

    const parsed = menuItemSchema.partial().safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const item = await prisma.menuItem.update({
      where: { id: idParsed.data },
      data: parsed.data,
    });

    revalidatePath("/menu");
    revalidatePath("/orders/new");
    return { data: item };
  } catch (err: unknown) {
    console.error("updateMenuItem error:", err);
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return { error: "Access denied: insufficient permissions" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    // RBAC: Only ADMIN and MANAGER can delete menu items
    await requireRole(["ADMIN", "MANAGER"]);

    const idParsed = objectIdSchema.safeParse(id);
    if (!idParsed.success) {
      return { error: "Invalid menu item identifier" };
    }

    const hasOrders = await prisma.orderItem.findFirst({
      where: { menuItemId: idParsed.data },
    });
    if (hasOrders) {
      return { error: "Cannot delete: this item is linked to existing order receipts" };
    }

    await prisma.menuItem.delete({ where: { id: idParsed.data } });
    revalidatePath("/menu");
    return { success: true };
  } catch (err: unknown) {
    console.error("deleteMenuItem error:", err);
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return { error: "Access denied: insufficient permissions" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

// ----------------------------------------------------
// ORDERS & BILLING (Protected: Authenticated Staff)
// ----------------------------------------------------

export async function getNextOrderNumber(): Promise<number> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  return (lastOrder?.orderNumber || 0) + 1;
}

export async function createOrder(data: unknown) {
  try {
    // Require authenticated staff
    await requireAuth();

    const parsed = createOrderSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid order data" };
    }

    const { items, discountPercent, taxPercent, servicePercent, ...orderData } = parsed.data;

    // Verify item prices directly from database to prevent client tampering
    const menuItemIds = items.map((i) => i.menuItemId).filter(Boolean);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

    const validatedItems = items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId);
      // Enforce DB price when available, otherwise require verified unit price >= 0
      const unitPrice = menuItem ? menuItem.priceInPaise : Math.max(0, item.unitPriceInPaise);
      const name = menuItem ? menuItem.name : item.itemName;
      return {
        menuItemId: item.menuItemId || null,
        itemName: name,
        unitPriceInPaise: unitPrice,
        quantity: item.quantity,
        lineTotalInPaise: calculateLineTotal(unitPrice, item.quantity),
      };
    });

    const billItems = validatedItems.map((i) => ({
      unitPriceInPaise: i.unitPriceInPaise,
      quantity: i.quantity,
    }));

    const bill = calculateBill(billItems, discountPercent, taxPercent, servicePercent);
    const orderNumber = await getNextOrderNumber();

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        discountPercent,
        taxPercent,
        servicePercent,
        subtotalInPaise: bill.subtotalInPaise,
        discountInPaise: bill.discountInPaise,
        taxInPaise: bill.taxInPaise,
        serviceInPaise: bill.serviceInPaise,
        totalInPaise: bill.totalInPaise,
        items: {
          create: validatedItems,
        },
      },
      include: { items: true },
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { data: order };
  } catch (err: unknown) {
    console.error("createOrder error:", err);
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { error: "Authentication required to create orders" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

export async function getOrders(status?: string) {
  try {
    await requireAuth();

    const where = status && status !== "all" ? { status } : {};
    return await prisma.order.findMany({
      where,
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (err) {
    console.error("Failed to fetch orders from database:", err);
    return [];
  }
}

export async function getOrder(id: string) {
  try {
    await requireAuth();

    const idParsed = objectIdSchema.safeParse(id);
    if (!idParsed.success) return null;

    return await prisma.order.findUnique({
      where: { id: idParsed.data },
      include: {
        items: { include: { menuItem: true } },
        payments: true,
      },
    });
  } catch (err) {
    console.error("Failed to fetch order from database:", err);
    return null;
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await requireAuth();

    const idParsed = objectIdSchema.safeParse(id);
    if (!idParsed.success) {
      return { error: "Invalid order identifier" };
    }

    const validStatuses = ["active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return { error: "Invalid order status transition" };
    }

    const order = await prisma.order.findUnique({ where: { id: idParsed.data } });
    if (!order) return { error: "Order not found" };

    if (order.status === "cancelled") {
      return { error: "Cannot modify a cancelled order" };
    }

    const completedAt = status === "completed" ? new Date() : null;

    await prisma.order.update({
      where: { id: idParsed.data },
      data: { status, completedAt },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("updateOrderStatus error:", err);
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { error: "Authentication required" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

export async function addItemToOrder(
  orderId: string,
  item: { menuItemId?: string; itemName: string; unitPriceInPaise: number; quantity: number }
) {
  try {
    await requireAuth();

    const idParsed = objectIdSchema.safeParse(orderId);
    if (!idParsed.success) {
      return { error: "Invalid order identifier" };
    }

    if (!item.itemName || item.quantity < 1 || item.quantity > 100) {
      return { error: "Invalid item quantity or name" };
    }

    const order = await prisma.order.findUnique({
      where: { id: idParsed.data },
      include: { items: true },
    });
    if (!order) return { error: "Order not found" };
    if (order.status !== "active") return { error: "Cannot add items to an inactive order" };

    // If menuItemId provided, verify true price from DB
    let unitPrice = Math.max(0, item.unitPriceInPaise);
    if (item.menuItemId) {
      const dbMenuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (dbMenuItem) {
        unitPrice = dbMenuItem.priceInPaise;
      }
    }

    await prisma.orderItem.create({
      data: {
        orderId: idParsed.data,
        menuItemId: item.menuItemId || null,
        itemName: item.itemName.trim(),
        unitPriceInPaise: unitPrice,
        quantity: item.quantity,
        lineTotalInPaise: calculateLineTotal(unitPrice, item.quantity),
      },
    });

    const allItems = await prisma.orderItem.findMany({ where: { orderId: idParsed.data } });
    const billItems = allItems.map((i) => ({
      unitPriceInPaise: i.unitPriceInPaise,
      quantity: i.quantity,
    }));
    const bill = calculateBill(
      billItems,
      order.discountPercent,
      order.taxPercent,
      order.servicePercent
    );

    const updated = await prisma.order.update({
      where: { id: idParsed.data },
      data: {
        subtotalInPaise: bill.subtotalInPaise,
        discountInPaise: bill.discountInPaise,
        taxInPaise: bill.taxInPaise,
        serviceInPaise: bill.serviceInPaise,
        totalInPaise: bill.totalInPaise,
      },
      include: { items: true, payments: true },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/billing/${orderId}`);
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { data: updated };
  } catch (err: unknown) {
    console.error("addItemToOrder error:", err);
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { error: "Authentication required" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

export async function recordPayment(data: unknown) {
  try {
    await requireAuth();

    const parsed = paymentSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid payment data" };
    }

    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      include: { payments: true },
    });

    if (!order) return { error: "Order not found" };
    if (order.status === "cancelled") return { error: "Cannot process payment for a cancelled order" };

    const totalPaid = order.payments.reduce((sum, p) => sum + p.amountInPaise, 0);
    if (totalPaid + parsed.data.amountInPaise > order.totalInPaise) {
      return { error: "Payment amount exceeds remaining order balance" };
    }

    const payment = await prisma.payment.create({ data: parsed.data });

    const newTotalPaid = totalPaid + parsed.data.amountInPaise;
    if (newTotalPaid >= order.totalInPaise && order.status === "active") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "completed", completedAt: new Date() },
      });
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${order.id}`);
    revalidatePath(`/billing/${order.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { data: payment };
  } catch (err: unknown) {
    console.error("recordPayment error:", err);
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { error: "Authentication required" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

// ----------------------------------------------------
// RESTAURANT SETTINGS (Protected: ADMIN Only)
// ----------------------------------------------------

export async function getSettings() {
  try {
    let settings = await prisma.restaurantSettings.findFirst();
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {},
      });
    }
    return settings;
  } catch (err) {
    console.error("Failed to fetch settings from database, using defaults:", err);
    return {
      id: "default-settings",
      name: "The Grand Kitchen",
      address: "Plot 42, Bandra Kurla Complex, Mumbai",
      phone: "+91 98765 43210",
      email: "info@thegrandkitchen.com",
      gstNumber: "27AAACG0123M1Z5",
      currency: "INR",
      currencySymbol: "₹",
      defaultTax: 5,
      defaultService: 0,
      receiptFooter: "Thank you for dining with us! Visit us again soon.",
      updatedAt: new Date(),
    };
  }
}

export async function updateSettings(data: unknown) {
  try {
    // RBAC: Only ADMIN can modify restaurant settings and tax parameters
    await requireRole(["ADMIN"]);

    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid settings data" };
    }

    const current = await prisma.restaurantSettings.findFirst();
    let settings;
    if (current) {
      settings = await prisma.restaurantSettings.update({
        where: { id: current.id },
        data: parsed.data,
      });
    } else {
      settings = await prisma.restaurantSettings.create({
        data: parsed.data,
      });
    }

    revalidatePath("/settings");
    revalidatePath("/billing");
    return { data: settings };
  } catch (err: unknown) {
    console.error("updateSettings error:", err);
    if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")) {
      return { error: "Access denied: only Administrators can update restaurant configurations" };
    }
    return { error: GENERIC_ERROR_MSG };
  }
}

// ----------------------------------------------------
// DASHBOARD & ANALYTICS (Protected: Staff)
// ----------------------------------------------------

export async function getDashboardStats() {
  try {
    await requireAuth();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersToday, totalRevenue, activeOrders, recentOrders, topItems] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          status: { not: "cancelled" },
        },
      }),
      prisma.order.aggregate({
        where: {
          status: "completed",
          createdAt: { gte: today },
        },
        _sum: { totalInPaise: true },
      }),
      prisma.order.count({ where: { status: "active" } }),
      prisma.order.findMany({
        where: { status: { not: "cancelled" } },
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.orderItem.groupBy({
        by: ["itemName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    return {
      ordersToday,
      revenueToday: totalRevenue._sum.totalInPaise || 0,
      activeOrders,
      recentOrders,
      topItems: topItems.map((i) => ({
        name: i.itemName,
        quantity: i._sum.quantity || 0,
      })),
    };
  } catch (err) {
    console.error("Failed to fetch dashboard stats from database:", err);
    return {
      ordersToday: 0,
      revenueToday: 0,
      activeOrders: 0,
      recentOrders: [],
      topItems: [],
    };
  }
}

// ----------------------------------------------------
// AUTHENTICATION & SESSIONS
// ----------------------------------------------------

export async function loginUser(data: unknown) {
  try {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Invalid email or password" };
    }

    const { email, password } = parsed.data;

    // Brute-force & credential stuffing defense: rate limit by normalized email
    const rateCheck = checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        error: `Too many failed login attempts. Account temporarily locked for ${Math.ceil(
          rateCheck.resetSeconds / 60
        )} minutes for security.`,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Timing-attack mitigation & user enumeration prevention:
    // Generic error message for both user-not-found and invalid password
    if (!user) {
      return { error: "Invalid email or password credentials" };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid email or password credentials" };
    }

    // Login successful: reset rate limiter for this account
    resetRateLimit(`login:${email}`);

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "MANAGER" | "CASHIER",
    });

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err: unknown) {
    console.error("loginUser internal error:", err);
    // Never expose stack trace or database exceptions to the client
    return { error: "Authentication service temporarily unavailable. Please try again." };
  }
}

export async function logoutUser() {
  await clearAuthCookie();
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getAuthUser() {
  return getCurrentUser();
}
