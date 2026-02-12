import express from "express";
import cors from "cors";
import sensorsRoutes from "./api/routes/sensor-routes";
import "./mqtt/mqttClient";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorsRoutes);

// frontend statico
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});