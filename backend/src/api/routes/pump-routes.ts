import { Router } from "express";
import { addPumpToSensor, getPumpsOfSensor, removePumpFromSensor } from "../controllers/pump-controller";

const router = Router();

router.get("/pumps/:id", getPumpsOfSensor);
router.post("/pumps/:id/:pin", addPumpToSensor);
router.delete("/pumps/:id/:pin", removePumpFromSensor);

export default router;
