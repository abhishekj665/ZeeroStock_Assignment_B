import express from "express";
import * as inventoryController from "../controllers/inventory.controller.js";

const Router = express.Router();

Router.post("/", inventoryController.createInventoryItem);
Router.get("/", inventoryController.getInventoryBySupplier);
Router.get("/search", inventoryController.getSearchResults);
Router.get("/categories", inventoryController.getCategories);

export const InventoryRouter = Router;
