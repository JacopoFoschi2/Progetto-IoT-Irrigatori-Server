import { Request, Response } from "express";
import { getAllSensors, upsertSensor } from "../../services/sensorService";

export function getSensors(req: Request, res: Response) {
  const sensors = getAllSensors();
  res.json(sensors);
}

export function testInsert(req: Request, res: Response) {
  upsertSensor("sensor1", Math.random() * 100);
  res.json({ message: "Sensor updated" });
}
