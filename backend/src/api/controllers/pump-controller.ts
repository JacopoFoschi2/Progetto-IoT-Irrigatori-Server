import { Request, Response } from "express";
import { db } from "../../db/database";
import { publishSensorConfig } from "../../services/sensor-service";

// POST /api/pumps/:id/:pin
export function addPumpToSensor(req: Request, res: Response) {
  try {
    const { id, pin } = req.params;
    db.prepare("INSERT OR IGNORE INTO sensor_pumps (id, pin) VALUES (?, ?)").run(Number(id), Number(pin));
    publishSensorConfig(Number(id));
    res.json({ message: "Pump added and config sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/pumps/:id
export function getPumpsOfSensor(req: Request, res: Response) {
  try {
    const pumps = db.prepare("SELECT pin FROM sensor_pumps WHERE id = ?").all(req.params.id);
    res.json(pumps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/pumps/:id/:pin
export function removePumpFromSensor(req: Request, res: Response) {
  try {
    const { id, pin } = req.params;
    db.prepare("DELETE FROM sensor_pumps WHERE id = ? AND pin = ?").run(Number(id), Number(pin));
    publishSensorConfig(Number(id));
    res.json({ message: "Pump removed and config sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
