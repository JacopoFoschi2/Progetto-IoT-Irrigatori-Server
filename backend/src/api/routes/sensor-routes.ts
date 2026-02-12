import { Router } from "express";
import { getSensors, testInsert } from "../controllers/sensor-controller";

const router = Router();

router.get("/", getSensors);
router.post("/test", testInsert);

export default router;
