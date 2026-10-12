import { z } from "zod";

// MongoDB ObjectId validation regex (24 hex characters)
export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId identifier format");

export const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").default(""),
  category: z.string().trim().min(1, "Category is required").max(50, "Category cannot exceed 50 characters"),
  priceInPaise: z
    .number()
    .int("Price must be an integer in paise")
    .min(100, "Price must be at least ₹1.00")
    .max(10_000_000, "Price cannot exceed ₹100,000"),
  available: z.boolean().default(true),
  imageUrl: z.string().trim().max(2000).default(""),
  sortOrder: z.number().int().min(0).max(10000).default(0),
});

export const orderItemSchema = z.object({
  menuItemId: z.string().trim().min(1, "Menu item ID is required"),
  itemName: z.string().trim().min(1, "Item name is required").max(100),
  unitPriceInPaise: z.number().int().min(0, "Price cannot be negative").max(10_000_000),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(500, "Quantity cannot exceed 500"),
});

export const createOrderSchema = z.object({
  orderType: z.enum(["dine-in", "takeaway"]).default("dine-in"),
  tableNumber: z.string().trim().max(20, "Table number cannot exceed 20 characters").default(""),
  note: z.string().trim().max(500, "Note cannot exceed 500 characters").default(""),
  discountPercent: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").default(0),
  taxPercent: z.number().min(0, "Tax cannot be negative").max(50, "Tax cannot exceed 50%").default(5),
  servicePercent: z.number().min(0, "Service charge cannot be negative").max(50, "Service charge cannot exceed 50%").default(0),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item").max(100, "Order cannot exceed 100 item lines"),
});

export const updateOrderSchema = createOrderSchema.partial().extend({
  status: z.enum(["active", "completed", "cancelled"]).optional(),
});

export const addItemToOrderSchema = z.object({
  orderId: objectIdSchema,
  item: z.object({
    menuItemId: z.string().trim().optional(),
    itemName: z.string().trim().min(1, "Item name is required").max(100),
    unitPriceInPaise: z.number().int().min(0).max(10_000_000),
    quantity: z.number().int().min(1).max(100),
  }),
});

export const paymentSchema = z.object({
  orderId: objectIdSchema,
  amountInPaise: z
    .number()
    .int("Payment amount must be an integer in paise")
    .min(1, "Payment amount must be greater than zero")
    .max(100_000_000, "Payment amount exceeds allowable limit"),
  method: z.enum(["cash", "card", "upi", "other"]),
  reference: z.string().trim().max(100, "Reference code cannot exceed 100 characters").default(""),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name is required").max(100),
  address: z.string().trim().max(300).default(""),
  phone: z.string().trim().max(25).default(""),
  email: z.string().trim().email("Valid email address required").or(z.literal("")).default(""),
  gstNumber: z.string().trim().max(25).default(""),
  currency: z.string().trim().max(10).default("INR"),
  currencySymbol: z.string().trim().max(5).default("₹"),
  defaultTax: z.number().min(0).max(50, "Default tax cannot exceed 50%"),
  defaultService: z.number().min(0).max(50, "Default service cannot exceed 50%"),
  receiptFooter: z.string().trim().max(300).default(""),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Valid email address is required")
    .max(255, "Email address is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type AddItemToOrderInput = z.infer<typeof addItemToOrderSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
