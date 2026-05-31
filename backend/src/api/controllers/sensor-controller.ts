import { Request, Response } from "express";
import { db } from "../../db/database";
import { publishSensorConfig, getSensorState } from "../../services/sensor-service";
import { Sensor } from "../../types/sensor";

// GET /api/sensors
export function getAllSensors(req: Request, res: Response) {
  try {
    const sensors = db.prepare("SELECT * FROM sensors").all() as Sensor[];

    // Arricchisce ogni sensore con lo stato in memoria
    const enriched = sensors.map((s) => {
      const state = getSensorState(s.mac);
      return {
        ...s,
        humidity: state.humidity,
        valves: state.valves,
        lastSeen: state.lastSeen,
      };
    });

    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/sensors/:id
export function getSensor(req: Request, res: Response) {
  try {
    const sensor = db.prepare("SELECT * FROM sensors WHERE id = ?").get(req.params.id) as Sensor | undefined;
    if (!sensor) return res.status(404).json({ error: "Sensor not found" });

    const state = getSensorState(sensor.mac);
    res.json({ ...sensor, humidity: state.humidity, valves: state.valves, lastSeen: state.lastSeen });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/sensors/:id
export function updateSensor(req: Request, res: Response) {
  try {
    const { name, thresholdMin, thresholdMax, updateInterval, pinHumidity } = req.body;
    db.prepare(`
      UPDATE sensors
      SET name = ?, thresholdMin = ?, thresholdMax = ?, updateInterval = ?, pinHumidity = ?
      WHERE id = ?
    `).run(name, thresholdMin, thresholdMax, updateInterval, pinHumidity, req.params.id);

    // Invia la nuova config all'Arduino via MQTT
    publishSensorConfig(Number(req.params.id));

    res.json({ message: "Sensor updated and config sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
