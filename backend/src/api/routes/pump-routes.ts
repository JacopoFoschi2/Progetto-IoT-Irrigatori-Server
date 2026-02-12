import { Router } from "express";
import { addPumpToSensor, getPumpsOfSensor } from "../controllers/pump-controller";

const router = Router();

router.post("/pumps/:id/:pin", addPumpToSensor);
router.get("/pumps/:id", getPumpsOfSensor);