import { Request, Response } from "express";
import { db } from "../../db/database";

export function addPumpToSensor(req: Request, res: Response) {
    try {
        db.prepare("INSERT INTO sensor_pumps (id, pin) VALUES (?, ?)").run(req.params.id, req.params.pin);
        res.json({ message: "Pump added to sensor" });
    } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export function getPumpsOfSensor(req: Request, res: Response) {
    try {
        const pins = db.prepare("SELECT pin FROM sensor_pumps WHERE id = ?").all(req.params.id);
        res.json(pins);
    } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}