import { Router } from "express";
import {
  getAllSensors,
  getSensor,
  addSensor,
  updateSensor,
  deleteSensor
} from "../controllers/sensor-controller";

const router = Router();

router.get("/sensors", getAllSensors);
router.get("/sensors/:id", getSensor);
router.post("/sensors", addSensor);
router.put("/sensors/:id", updateSensor);
router.delete("/sensors/:id", deleteSensor);

export default router;
