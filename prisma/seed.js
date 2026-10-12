const { PrismaClient } = require("@prisma/client");

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
    receiptFooter: "Thank you for dining with us! Visit again soon.",
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

  console.log("Upserting menu items...");
  const createdItems = [];
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (existing) {
      const updated = await prisma.menuItem.update({
        where: { id: existing.id },
        data: item,
      });
      createdItems.push(updated);
    } else {
      const created = await prisma.menuItem.create({ data: item });
      createdItems.push(created);
    }
  }

  // Create sample orders if none exist
  const orderCount = await prisma.order.count();
  if (orderCount === 0) {
    console.log("Seeding sample demonstration orders...");

    const itemMap = new Map(createdItems.map((i) => [i.name, i]));
    const butterChicken = itemMap.get("Butter Chicken");
    const garlicNaan = itemMap.get("Garlic Naan");
    const mangoLassi = itemMap.get("Mango Lassi");
    const paneerTikkaMasala = itemMap.get("Paneer Tikka Masala");
    const tandooriRoti = itemMap.get("Tandoori Roti");
    const limeSoda = itemMap.get("Fresh Lime Soda");
    const chickenBiryani = itemMap.get("Chicken Biryani");
    const gulabJamun = itemMap.get("Gulab Jamun (2 pcs)");

    // 1. Active Order on Table 4
    if (butterChicken && garlicNaan && mangoLassi) {
      const subtotal = butterChicken.priceInPaise * 1 + garlicNaan.priceInPaise * 2 + mangoLassi.priceInPaise * 2;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      await prisma.order.create({
        data: {
          orderNumber: 1001,
          orderType: "dine-in",
          tableNumber: "4",
          status: "active",
          note: "Extra butter on naan, served together",
          subtotalInPaise: subtotal,
          discountPercent: 0,
          discountInPaise: 0,
          taxPercent: 5,
          taxInPaise: tax,
          servicePercent: 0,
          serviceInPaise: 0,
          totalInPaise: total,
          items: {
            create: [
              { menuItemId: butterChicken.id, itemName: butterChicken.name, unitPriceInPaise: butterChicken.priceInPaise, quantity: 1, lineTotalInPaise: butterChicken.priceInPaise * 1 },
              { menuItemId: garlicNaan.id, itemName: garlicNaan.name, unitPriceInPaise: garlicNaan.priceInPaise, quantity: 2, lineTotalInPaise: garlicNaan.priceInPaise * 2 },
              { menuItemId: mangoLassi.id, itemName: mangoLassi.name, unitPriceInPaise: mangoLassi.priceInPaise, quantity: 2, lineTotalInPaise: mangoLassi.priceInPaise * 2 },
            ],
          },
        },
      });
    }

    // 2. Active Order on Table 7
    if (paneerTikkaMasala && tandooriRoti && limeSoda) {
      const subtotal = paneerTikkaMasala.priceInPaise * 1 + tandooriRoti.priceInPaise * 4 + limeSoda.priceInPaise * 2;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      await prisma.order.create({
        data: {
          orderNumber: 1002,
          orderType: "dine-in",
          tableNumber: "7",
          status: "active",
          note: "Medium spice level",
          subtotalInPaise: subtotal,
          discountPercent: 0,
          discountInPaise: 0,
          taxPercent: 5,
          taxInPaise: tax,
          servicePercent: 0,
          serviceInPaise: 0,
          totalInPaise: total,
          items: {
            create: [
              { menuItemId: paneerTikkaMasala.id, itemName: paneerTikkaMasala.name, unitPriceInPaise: paneerTikkaMasala.priceInPaise, quantity: 1, lineTotalInPaise: paneerTikkaMasala.priceInPaise * 1 },
              { menuItemId: tandooriRoti.id, itemName: tandooriRoti.name, unitPriceInPaise: tandooriRoti.priceInPaise, quantity: 4, lineTotalInPaise: tandooriRoti.priceInPaise * 4 },
              { menuItemId: limeSoda.id, itemName: limeSoda.name, unitPriceInPaise: limeSoda.priceInPaise, quantity: 2, lineTotalInPaise: limeSoda.priceInPaise * 2 },
            ],
          },
        },
      });
    }

    // 3. Completed Order on Table 2 with Payment
    if (chickenBiryani && gulabJamun) {
      const subtotal = chickenBiryani.priceInPaise * 2 + gulabJamun.priceInPaise * 2;
      const discount = Math.round(subtotal * 0.1); // 10% discount
      const taxable = subtotal - discount;
      const tax = Math.round(taxable * 0.05);
      const total = taxable + tax;

      const order3 = await prisma.order.create({
        data: {
          orderNumber: 1003,
          orderType: "dine-in",
          tableNumber: "2",
          status: "completed",
          completedAt: new Date(),
          subtotalInPaise: subtotal,
          discountPercent: 10,
          discountInPaise: discount,
          taxPercent: 5,
          taxInPaise: tax,
          servicePercent: 0,
          serviceInPaise: 0,
          totalInPaise: total,
          items: {
            create: [
              { menuItemId: chickenBiryani.id, itemName: chickenBiryani.name, unitPriceInPaise: chickenBiryani.priceInPaise, quantity: 2, lineTotalInPaise: chickenBiryani.priceInPaise * 2 },
              { menuItemId: gulabJamun.id, itemName: gulabJamun.name, unitPriceInPaise: gulabJamun.priceInPaise, quantity: 2, lineTotalInPaise: gulabJamun.priceInPaise * 2 },
            ],
          },
          payments: {
            create: [
              { amountInPaise: total, method: "cash", reference: "Cash Drawer #1", status: "completed" },
            ],
          },
        },
      });
    }

    // 4. Completed Takeaway Order with UPI payment
    if (butterChicken && garlicNaan) {
      const subtotal = butterChicken.priceInPaise * 2 + garlicNaan.priceInPaise * 4;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      await prisma.order.create({
        data: {
          orderNumber: 1004,
          orderType: "takeaway",
          tableNumber: "",
          status: "completed",
          completedAt: new Date(),
          note: "Pack containers tightly, include cutlery",
          subtotalInPaise: subtotal,
          discountPercent: 0,
          discountInPaise: 0,
          taxPercent: 5,
          taxInPaise: tax,
          servicePercent: 0,
          serviceInPaise: 0,
          totalInPaise: total,
          items: {
            create: [
              { menuItemId: butterChicken.id, itemName: butterChicken.name, unitPriceInPaise: butterChicken.priceInPaise, quantity: 2, lineTotalInPaise: butterChicken.priceInPaise * 2 },
              { menuItemId: garlicNaan.id, itemName: garlicNaan.name, unitPriceInPaise: garlicNaan.priceInPaise, quantity: 4, lineTotalInPaise: garlicNaan.priceInPaise * 4 },
            ],
          },
          payments: {
            create: [
              { amountInPaise: total, method: "upi", reference: "UPI/GooglePay/Ref: 981240184", status: "completed" },
            ],
          },
        },
      });
    }
  }

  console.log("Database seeded successfully with menu items, settings, and sample orders!");
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
