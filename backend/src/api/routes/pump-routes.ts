import { Router } from "express";
import { addPumpToSensor, getPumpsOfSensor, removePumpFromSensor } from "../controllers/pump-controller";

const router = Router();

router.post("/pumps/:id/:pin", addPumpToSensor);
router.get("/pumps/:id", getPumpsOfSensor);
router.delete("/pumps/:id/:pin", removePumpFromSensor);