import { Inventory } from "./Inventory.model.js";
import { Supplier } from "./Supplier.model.js";

// Supplier --> Inventory (One-to-Many)
Supplier.hasMany(Inventory, { foreignKey: "supplierId", as: "inventories" });
Inventory.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

const dbAssociations = {
  Supplier,
  Inventory,
};

export default dbAssociations;
