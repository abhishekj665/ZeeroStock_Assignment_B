import ExpressError from "../utils/ExpressError.util.js";
import { Supplier } from "../models/Supplier.model.js";

export const createSupplier = async (payload) => {
  const name = payload.name?.trim();
  const city = payload.city?.trim();

  if (!name) {
    throw new ExpressError("Supplier name is required", 400);
  }

  if (!city) {
    throw new ExpressError("Supplier city is required", 400);
  }

  const supplier = await Supplier.create({ name, city });
  return supplier;
};

export const getSuppliers = async () => {
  return Supplier.findAll({ order: [["name", "ASC"]] });
};
