import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).default(""),
  category: z.string().min(1, "Category is required"),
  priceInPaise: z.number().int().min(100, "Price must be at least ₹1.00"),
  available: z.boolean().default(true),
  imageUrl: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  itemName: z.string().min(1),
  unitPriceInPaise: z.number().int().min(0),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999),
});

export const createOrderSchema = z.object({
  orderType: z.enum(["dine-in", "takeaway"]).default("dine-in"),
  tableNumber: z.string().max(20).default(""),
  note: z.string().max(500).default(""),
  discountPercent: z.number().min(0).max(100).default(0),
  taxPercent: z.number().min(0).max(100).default(5),
  servicePercent: z.number().min(0).max(100).default(0),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

export const updateOrderSchema = createOrderSchema.partial().extend({
  status: z.enum(["active", "completed", "cancelled"]).optional(),
});

export const paymentSchema = z.object({
  orderId: z.string().min(1),
  amountInPaise: z.number().int().min(1),
  method: z.enum(["cash", "card", "upi", "other"]),
  reference: z.string().max(100).default(""),
});

export const settingsSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().max(300),
  phone: z.string().max(20),
  email: z.string().email().or(z.literal("")),
  gstNumber: z.string().max(20),
  currency: z.string().default("INR"),
  currencySymbol: z.string().default("₹"),
  defaultTax: z.number().min(0).max(100),
  defaultService: z.number().min(0).max(100),
  receiptFooter: z.string().max(300),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
