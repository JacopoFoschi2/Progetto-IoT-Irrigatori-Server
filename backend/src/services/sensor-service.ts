import { db } from "../db/database";
import { Sensor } from "../types/sensor";

// --- Registrazione sensore
export function registerSensor(mac: string) {
    let sensor = db.prepare("SELECT * FROM sensors WHERE mac = ?").get(mac);

  // Se non esiste, lo creo
  if (!sensor) {
    const result = db.prepare(`
      INSERT INTO sensors (mac, name, thresholdMin, thresholdMax, pinHumidity, updateInterval)
      VALUES (?, NULL, NULL, NULL, NULL, NULL)
    `).run(mac);
  }
}