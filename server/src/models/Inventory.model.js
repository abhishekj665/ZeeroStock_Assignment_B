import { db } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Inventory = db.define(
  "Inventory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Inventory",
  },
);
