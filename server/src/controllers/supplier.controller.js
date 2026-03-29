import { successResponse } from "../utils/resonse.util.js";
import {
  createSupplier as createSupplierService,
  getSuppliers as getSuppliersService,
} from "../services/supplier.service.js";

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await createSupplierService(req.body);
    return successResponse(
      res,
      supplier,
      201,
      "Supplier created successfully",
      true,
    );
  } catch (error) {
    next(error);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await getSuppliersService();
    return successResponse(
      res,
      suppliers,
      200,
      "Suppliers fetched successfully",
      true,
    );
  } catch (error) {
    next(error);
  }
};
