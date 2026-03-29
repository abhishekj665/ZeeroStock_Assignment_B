import express from "express";
import * as supplierController from "../controllers/supplier.controller.js";

const Router = express.Router();

Router.post("/", supplierController.createSupplier);
Router.get("/", supplierController.getSuppliers);

export const SupplierRouter = Router;
