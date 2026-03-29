import { successResponse } from "../utils/resonse.util.js";
import {
  createInventory,
  getInventoryBySupplier as getInventoryBySupplierService,
  searchInventory,
  getCategories as loadCategories,
} from "../services/inventory.service.js";

export const createInventoryItem = async (req, res, next) => {
  try {
    const inventory = await createInventory(req.body);
    return successResponse(
      res,
      inventory,
      201,
      "Inventory item created successfully",
      true,
    );
  } catch (error) {
    next(error);
  }
};

export const getInventoryBySupplier = async (req, res, next) => {
  try {
    const groupedInventory = await getInventoryBySupplierService();
    return successResponse(
      res,
      groupedInventory,
      200,
      "Inventory grouped by supplier",
      true,
    );
  } catch (error) {
    next(error);
  }
};

export const getSearchResults = async (req, res, next) => {
  try {
    const result = await searchInventory(req.query);
    return successResponse(
      res,
      result.data,
      200,
      result.message,
      result.success,
    );
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const result = await loadCategories();
    return successResponse(
      res,
      result.data,
      200,
      result.message,
      result.success,
    );
  } catch (error) {
    next(error);
  }
};
