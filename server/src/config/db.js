import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  dialect: "mysql",
  logging: false,
});

export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log("Connected to Database Successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const syncDB = async () => {
  try {
    await db.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
};
