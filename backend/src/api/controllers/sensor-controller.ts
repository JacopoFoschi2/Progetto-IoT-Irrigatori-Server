import { Request, Response } from "express";
import {
  getAllSensors,
  upsertSensorStatus,
  getSensorById,
  updateSensorConfig
} from "../../services/sensor-service";
import { publishConfig } from "../../mqtt/mqtt-client";

export function getSensors(req: Request, res: Response) {
  res.json(getAllSensors());
}

export function testInsert(req: Request, res: Response) {
  upsertSensorStatus("sensor1", Math.random() * 100);
  res.json({ message: "Sensor updated" });
}

// Nuovo endpoint: aggiornamento configurazione
export function updateConfig(req: Request, res: Response) {
  const id = req.params.id;
  const config = req.body;

  try {
    updateSensorConfig(id, config);

    const sensor = getSensorById(id);
    if (sensor) {
      publishConfig(id, sensor); // invia config via MQTT
    }

    res.json({ message: "Config updated" });
  } catch (err) {
    res.status(404).json({ error: "Sensor not found" });
  }
}
