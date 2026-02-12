import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import sensorsRoutes from "./api/routes/sensor-routes";
import "./mqtt/mqtt-client";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorsRoutes);

// frontend statico
app.use(express.static(path.join(process.cwd(), "public")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on("error", (err) => {
  console.error("Server error:", err);
});