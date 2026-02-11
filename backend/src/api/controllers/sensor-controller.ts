import { Request, Response } from "express";
import {
  getAllSensors,
  upsertSensorStatus
} from "../../services/sensor-service";

export function getSensors(req: Request, res: Response) {
  res.json(getAllSensors());
}

export function testInsert(req: Request, res: Response) {
  upsertSensorStatus("sensor1", Math.random() * 100);
  res.json({ message: "Sensor updated" });
}
