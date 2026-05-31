import { Request, Response } from "express";
import { db } from "../../db/database";
import { publishValveCommand } from "../../services/sensor-service";
import { Sensor } from "../../types/sensor";

// POST /api/sensors/:id/valve
// body: { valve: number, state: boolean }
export function controlValve(req: Request, res: Response) {
  try {
    const sensor = db.prepare("SELECT * FROM sensors WHERE id = ?").get(req.params.id) as Sensor | undefined;
    if (!sensor) return res.status(404).json({ error: "Sensor not found" });

    const { valve, state } = req.body;
    if (typeof valve !== "number" || typeof state !== "boolean") {
      return res.status(400).json({ error: "valve (number) and state (boolean) required" });
    }

    publishValveCommand(sensor.mac, valve, state);
    res.json({ message: `Valve ${valve} set to ${state}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
