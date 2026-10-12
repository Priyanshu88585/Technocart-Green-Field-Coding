"use server";

import { prisma } from "@/lib/prisma";
import { calculateBill, calculateLineTotal } from "@/lib/money";
import { createOrderSchema, menuItemSchema, paymentSchema, settingsSchema, loginSchema } from "@/lib/validations";
import { verifyPassword, setAuthCookie, clearAuthCookie, getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMenuItems() {
  return prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
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
  const parsed = menuItemSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  const existing = await prisma.menuItem.findFirst({
    where: { name: parsed.data.name },
  });
  if (existing) {
    return { error: "A menu item with this name already exists" };
  }
  const item = await prisma.menuItem.create({ data: parsed.data });
  revalidatePath("/menu");
  return { data: item };
}

export async function updateMenuItem(id: string, data: unknown) {
  const parsed = menuItemSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  const item = await prisma.menuItem.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath("/menu");
  revalidatePath("/orders/new");
  return { data: item };
}

export async function deleteMenuItem(id: string) {
  const hasOrders = await prisma.orderItem.findFirst({
    where: { menuItemId: id },
  });
  if (hasOrders) {
    return { error: "Cannot delete: this item has been used in orders" };
  }
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/menu");
  return { success: true };
}

export async function getNextOrderNumber(): Promise<number> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  return (lastOrder?.orderNumber || 0) + 1;
}

export async function createOrder(data: unknown) {
  const parsed = createOrderSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid order data" };
  }

  const { items, discountPercent, taxPercent, servicePercent, ...orderData } = parsed.data;

  const menuItemIds = items.map((i) => i.menuItemId).filter(Boolean);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const validatedItems = items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId);
    const unitPrice = menuItem ? menuItem.priceInPaise : item.unitPriceInPaise;
    const name = menuItem ? menuItem.name : item.itemName;
    return {
      menuItemId: item.menuItemId,
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
  revalidatePath("/");
  return { data: order };
}

export async function getOrders(status?: string) {
  const where = status && status !== "all" ? { status } : {};
  return prisma.order.findMany({
    where,
    include: {
      items: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { menuItem: true } },
      payments: true,
    },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  const validStatuses = ["active", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status" };
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return { error: "Order not found" };

  if (order.status === "cancelled") {
    return { error: "Cannot modify a cancelled order" };
  }

  const completedAt = status === "completed" ? new Date() : null;

  await prisma.order.update({
    where: { id },
    data: { status, completedAt },
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function addItemToOrder(
  orderId: string,
  item: { menuItemId?: string; itemName: string; unitPriceInPaise: number; quantity: number }
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return { error: "Order not found" };
  if (order.status !== "active") return { error: "Cannot add items to an inactive order" };

  await prisma.orderItem.create({
    data: {
      orderId,
      menuItemId: item.menuItemId || null,
      itemName: item.itemName,
      unitPriceInPaise: item.unitPriceInPaise,
      quantity: item.quantity,
      lineTotalInPaise: calculateLineTotal(item.unitPriceInPaise, item.quantity),
    },
  });

  const allItems = await prisma.orderItem.findMany({ where: { orderId } });
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
    where: { id: orderId },
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
  revalidatePath("/");
  return { data: updated };
}

export async function recordPayment(data: unknown) {
  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid payment data" };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { payments: true },
  });

  if (!order) return { error: "Order not found" };
  if (order.status === "cancelled") return { error: "Cannot pay for a cancelled order" };

  const totalPaid = order.payments.reduce((sum, p) => sum + p.amountInPaise, 0);
  if (totalPaid + parsed.data.amountInPaise > order.totalInPaise) {
    return { error: "Payment exceeds order total" };
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
  revalidatePath("/");
  return { data: payment };
}

export async function getSettings() {
  let settings = await prisma.restaurantSettings.findFirst();
  if (!settings) {
    settings = await prisma.restaurantSettings.create({
      data: {},
    });
  }
  return settings;
}

export async function updateSettings(data: unknown) {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid settings" };
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
}

export async function getDashboardStats() {
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
}

export async function loginUser(data: unknown) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid email or password" };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { error: "No account found with this email address" };
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return { error: "Incorrect password. Please verify credentials." };
  }

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

