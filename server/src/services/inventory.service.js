import { Op } from "sequelize";
import ExpressError from "../utils/ExpressError.util.js";
import { Inventory } from "../models/Inventory.model.js";
import { Supplier } from "../models/Supplier.model.js";

const normalizeText = (value) => value?.trim() || "";

const parseNumber = (value, fieldName) => {
  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) {
    throw new ExpressError(`${fieldName} must be a valid number`, 400);
  }
  return parsedValue;
};

export const createInventory = async (payload) => {
  const supplierId = normalizeText(payload.supplierId);
  const product_name = normalizeText(payload.product_name);
  const quantity = parseNumber(payload.quantity, "quantity");
  const price = parseNumber(payload.price, "price");

  if (!supplierId) {
    throw new ExpressError("supplierId is required", 400);
  }

  if (!product_name) {
    throw new ExpressError("product_name is required", 400);
  }

  if (quantity < 0) {
    throw new ExpressError("Quantity must be greater than or equal to 0", 400);
  }

  if (price <= 0) {
    throw new ExpressError("Price must be greater than 0", 400);
  }

  const supplier = await Supplier.findByPk(supplierId);

  if (!supplier) {
    throw new ExpressError("Inventory must belong to a valid supplier", 400);
  }

  const inventoryItem = await Inventory.create({
    supplierId,
    product_name,
    quantity,
    price,
  });

  return inventoryItem;
};

export const getInventoryBySupplier = async () => {
  const suppliers = await Supplier.findAll({
    include: [
      {
        model: Inventory,
        as: "inventories",
        attributes: ["id", "product_name", "quantity", "price", "supplierId"],
      },
    ],
  });

  const grouped = suppliers
    .map((supplier) => {
      const inventory = supplier.inventories.map((item) => ({
        id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: Number(item.price),
        supplier_id: item.supplierId,
      }));

      const totalValue = inventory.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
      );

      return {
        supplier: {
          id: supplier.id,
          name: supplier.name,
          city: supplier.city,
        },
        inventory,
        totalValue,
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  return grouped;
};

export const searchInventory = async (query = {}) => {
  const q = normalizeText(query.q);
  const location = normalizeText(query.location || query.category);
  const minPrice = query.minPrice ? Number(query.minPrice) : null;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : null;

  const where = {};
  const supplierWhere = {};

  if (q) {
    where.product_name = {
      [Op.like]: `%${q}%`,
    };
  }

  if (minPrice !== null) {
    if (Number.isNaN(minPrice)) {
      throw new ExpressError("minPrice must be a valid number", 400);
    }

    where.price = {
      ...where.price,
      [Op.gte]: minPrice,
    };
  }

  if (maxPrice !== null) {
    if (Number.isNaN(maxPrice)) {
      throw new ExpressError("maxPrice must be a valid number", 400);
    }

    where.price = {
      ...where.price,
      [Op.lte]: maxPrice,
    };
  }

  if (location && location.toLowerCase() !== "all") {
    supplierWhere.city = location;
  }

  const results = await Inventory.findAll({
    where,
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "name", "city"],
        where: Object.keys(supplierWhere).length ? supplierWhere : undefined,
      },
    ],
  });

  const items = results.map((item) => ({
    id: item.id,
    name: item.product_name,
    category: item.supplier?.city || "Unknown",
    supplier: item.supplier?.name || "Unknown",
    price: Number(item.price),
    stock: item.quantity,
  }));

  const success = items.length > 0;
  const message = success
    ? "Inventory fetched successfully"
    : "No results found";

  return {
    success,
    data: items,
    message,
  };
};

export const getCategories = async () => {
  const suppliers = await Supplier.findAll({
    attributes: ["city"],
    raw: true,
  });

  const cities = Array.from(new Set(suppliers.map((row) => row.city))).sort();

  return {
    success: cities.length > 0,
    data: cities,
    message:
      cities.length > 0 ? "Cities fetched successfully" : "No cities found",
  };
};
