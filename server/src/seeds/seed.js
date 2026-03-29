import { db } from "../config/db.js";
import "../models/Association.model.js";
import { Inventory } from "../models/Inventory.model.js";
import { Supplier } from "../models/Supplier.model.js";
import { inventories, suppliers } from "./seedData.js";

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    await db.sync({ force: true });

    const createdSuppliers = await Supplier.bulkCreate(suppliers, {
      returning: true,
    });
    const supplierMap = createdSuppliers.reduce((acc, supplier) => {
      acc[supplier.name] = supplier.id;
      return acc;
    }, {});

    const inventoryRows = inventories.map((item) => ({
      supplierId: supplierMap[item.supplierName],
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    await Inventory.bulkCreate(inventoryRows);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error.message || error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
};

seedDatabase();
