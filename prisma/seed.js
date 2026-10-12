const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const menuItems = [
  { name: "Butter Chicken", description: "Creamy tomato-based gravy with tender roasted chicken pieces", category: "Main Course", priceInPaise: 35000, sortOrder: 1 },
  { name: "Paneer Tikka Masala", description: "Grilled cottage cheese cubes in rich spiced masala gravy", category: "Main Course", priceInPaise: 28000, sortOrder: 2 },
  { name: "Dal Makhani", description: "Slow-cooked black lentils with fresh cream and butter", category: "Main Course", priceInPaise: 22000, sortOrder: 3 },
  { name: "Chicken Biryani", description: "Fragrant aged basmati rice layered with spiced chicken and saffron", category: "Main Course", priceInPaise: 32000, sortOrder: 4 },
  { name: "Veg Biryani", description: "Aromatic basmati rice with seasonal garden vegetables and spices", category: "Main Course", priceInPaise: 24000, sortOrder: 5 },
  { name: "Palak Paneer", description: "Fresh spinach puree with soft cottage cheese cubes", category: "Main Course", priceInPaise: 24000, sortOrder: 6 },
  { name: "Tandoori Chicken", description: "Whole bone-in chicken marinated in spiced hung yogurt, tandoor grilled", category: "Starters", priceInPaise: 30000, sortOrder: 1 },
  { name: "Paneer Tikka", description: "Marinated cottage cheese and peppers chargrilled on skewers", category: "Starters", priceInPaise: 22000, sortOrder: 2 },
  { name: "Crispy Samosa Platter", description: "Crispy golden pastry triangles stuffed with spiced potatoes and peas", category: "Starters", priceInPaise: 8000, sortOrder: 3 },
  { name: "Chicken Wings", description: "Crispy spiced chicken wings served with mint dip", category: "Starters", priceInPaise: 25000, sortOrder: 4 },
  { name: "Veg Spring Rolls", description: "Crispy vegetable spring rolls served with sweet chilli glaze", category: "Starters", priceInPaise: 15000, sortOrder: 5 },
  { name: "Aloo Paratha", description: "Whole wheat flatbread stuffed with seasoned potato filling", category: "Breads", priceInPaise: 8000, sortOrder: 1 },
  { name: "Garlic Naan", description: "Fluffy leavened flatbread brushed with garlic butter and herbs", category: "Breads", priceInPaise: 6000, sortOrder: 2 },
  { name: "Butter Naan", description: "Classic tandoor-baked flatbread brushed with fresh butter", category: "Breads", priceInPaise: 5000, sortOrder: 3 },
  { name: "Tandoori Roti", description: "Crisp and wholesome whole wheat flatbread baked in clay oven", category: "Breads", priceInPaise: 4000, sortOrder: 4 },
  { name: "Laccha Paratha", description: "Multi-layered flaky whole wheat flatbread", category: "Breads", priceInPaise: 6000, sortOrder: 5 },
  { name: "Gulab Jamun (2 pcs)", description: "Golden milk dumplings steeped in warm rose-cardamom sugar syrup", category: "Desserts", priceInPaise: 12000, sortOrder: 1 },
  { name: "Kesar Rasmalai", description: "Delicate cottage cheese discs immersed in chilled saffron milk", category: "Desserts", priceInPaise: 14000, sortOrder: 2 },
  { name: "Shahi Kheer", description: "Rich slow-simmered basmati rice pudding topped with pistachios", category: "Desserts", priceInPaise: 10000, sortOrder: 3 },
  { name: "Mango Lassi", description: "Thick chilled yogurt beverage blended with sweet Alphonso mango pulp", category: "Beverages", priceInPaise: 12000, sortOrder: 1 },
  { name: "Masala Chai", description: "Traditional simmered black tea infused with ginger and spices", category: "Beverages", priceInPaise: 5000, sortOrder: 2 },
  { name: "Fresh Lime Soda", description: "Zesty freshly squeezed lime juice with club soda (Sweet & Salt)", category: "Beverages", priceInPaise: 8000, sortOrder: 3 },
  { name: "Cold Coffee", description: "Chilled espresso shaken with vanilla cream and chocolate dust", category: "Beverages", priceInPaise: 14000, sortOrder: 4 },
  { name: "Mineral Water (1L)", description: "Purified natural packaged mineral water", category: "Beverages", priceInPaise: 4000, sortOrder: 5 },
];

async function main() {
  console.log("Cleaning dummy/test orders...");
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  console.log("Dummy orders removed. Starting fresh with authentic data.");

  console.log("Seeding authentic restaurant users in MongoDB...");
  const adminPasswordHash = await bcrypt.hash("GrandAdmin123!", 10);
  const cashierPasswordHash = await bcrypt.hash("Cashier123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@thegrandkitchen.com" },
    update: {
      name: "Priyanshu (General Manager)",
      password: adminPasswordHash,
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
    create: {
      name: "Priyanshu (General Manager)",
      email: "admin@thegrandkitchen.com",
      password: adminPasswordHash,
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });

  await prisma.user.upsert({
    where: { email: "cashier@thegrandkitchen.com" },
    update: {
      name: "Rajesh Sharma (Cashier)",
      password: cashierPasswordHash,
      role: "CASHIER",
      phone: "+91 98765 12345",
    },
    create: {
      name: "Rajesh Sharma (Cashier)",
      email: "cashier@thegrandkitchen.com",
      password: cashierPasswordHash,
      role: "CASHIER",
      phone: "+91 98765 12345",
    },
  });
  console.log("Users created: admin@thegrandkitchen.com and cashier@thegrandkitchen.com");

  console.log("Seeding restaurant settings...");
  const existingSettings = await prisma.restaurantSettings.findFirst();
  const settingsData = {
    name: "The Grand Kitchen",
    address: "123 Food Street, Culinary District, Mumbai - 400001",
    phone: "+91 98765 43210",
    email: "info@thegrandkitchen.com",
    gstNumber: "27AABCU9603R1ZM",
    currency: "INR",
    currencySymbol: "₹",
    defaultTax: 5,
    defaultService: 0,
    receiptFooter: "Thank you for dining at The Grand Kitchen! Visit us again soon.",
  };

  if (existingSettings) {
    await prisma.restaurantSettings.update({
      where: { id: existingSettings.id },
      data: settingsData,
    });
  } else {
    await prisma.restaurantSettings.create({
      data: settingsData,
    });
  }

  console.log("Upserting 24 authentic menu items...");
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.menuItem.create({ data: item });
    }
  }

  console.log("MongoDB successfully synced with authentic users, settings, and original menu catalog!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
