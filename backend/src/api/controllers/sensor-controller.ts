import { Request, Response } from "express";
import { db } from "../../db/database";

// GET /sensors
export function getAllSensors(req: Request, res: Response) {
  try {
    const sensors = db.prepare("SELECT * FROM sensors").all();
    res.json(sensors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET /sensors/:id
export function getSensor(req: Request, res: Response) {
  try {
    const sensor = db.prepare("SELECT * FROM sensors WHERE id = ?").get(req.params.id);
    if (!sensor) return res.status(404).json({ error: "Sensor not found" });
    res.json(sensor);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /sensors/:id
export function updateSensor(req: Request, res: Response) {
  try {
    const { name, thresholdMin, thresholdMax, updateInterval } = req.body;
    const stmt = db.prepare(`
      UPDATE sensors
      SET name = ?, thresholdMin = ?, thresholdMax = ?, updateInterval = ?
      WHERE id = ?
    `);
    stmt.run(name, thresholdMin, thresholdMax, updateInterval, req.params.id);
    res.json({ message: "Sensor updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}