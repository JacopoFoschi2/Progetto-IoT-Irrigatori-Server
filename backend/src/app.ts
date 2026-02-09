import express from "express";
import cors from "cors";
import sensorsRoutes from "api/router/sensor-routes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
