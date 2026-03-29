import "./models/Association.model.js";
import app from "./app.js";
import { env } from "./config/env.js";
import http from "http";
import { syncDB, connectDB } from "./config/db.js";

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
//   await syncDB();
  server.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
};

startServer();
