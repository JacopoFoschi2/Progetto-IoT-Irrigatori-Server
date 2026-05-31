import dotenv from "dotenv";
dotenv.config();

import express, { Router } from "express";
import cors from "cors";
import path from "path";

import sensorRoutes from "./api/routes/sensor-routes";
import pumpRoutes from "./api/routes/pump-routes";
import { controlValve } from "./api/controllers/valve-controller";

// Avvia connessione MQTT (side effect)
import "./mqtt/mqtt-client";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", sensorRoutes);
app.use("/api", pumpRoutes);
app.post("/api/sensors/:id/valve", controlValve);

// Frontend statico
app.use(express.static(path.join(process.cwd(), "public")));

app.listen(PORT, () => {
  console.log(`🌿 Greenhouse server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("Server error:", err);
});
