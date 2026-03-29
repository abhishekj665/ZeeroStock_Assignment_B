import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { InventoryRouter } from "./routes/inventory.route.js";
import { SupplierRouter } from "./routes/supplier.route.js";
import { env } from "./config/env.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_URL?.trim(),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/supplier", SupplierRouter);
app.use("/inventory", InventoryRouter);

app.get("/", (req, res) => {
  res.json({ message: "Inventory Search API" });
});

app.use(globalErrorHandler);

export default app;
