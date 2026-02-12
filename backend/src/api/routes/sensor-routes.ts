import { Router } from "express";
import { getSensors, testInsert, updateConfig } from "../controllers/sensor-controller";

const router = Router();

router.get("/", getSensors);
router.post("/test", testInsert);
router.post("/:id/config", updateConfig);

export default router;
