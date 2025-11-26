import process from "node:process";
import consola from "consola";
import cors from "cors";
import express from "express";
import { errorHandler, handle404Error } from "@/utils/errors";
import routes from "@/routes/index";
import "./utils/env";

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/api", routes);

app.all("*", handle404Error);

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
