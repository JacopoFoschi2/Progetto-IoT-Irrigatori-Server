import { Router } from "express";
import {
  getAllSensors,
  getSensor,
  updateSensor
} from "../controllers/sensor-controller";

const router = Router();

router.get("/sensors", getAllSensors);
router.get("/sensors/:id", getSensor);
router.put("/sensors/:id", updateSensor);

export default router;
