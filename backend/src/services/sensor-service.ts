import { db } from "../db/database";
import { Sensor } from "../types/sensor";

//
// Creazione o aggiornamento sensore quando invia status
//
export function upsertSensorStatus(
  id: string,
  humidity: number
): void {
  const stmt = db.prepare(`
    INSERT INTO sensors (id, lastHumidity, lastSeen)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        lastHumidity = excluded.lastHumidity,
        lastSeen = excluded.lastSeen
  `);

  stmt.run(id, humidity, Date.now());
}

//
// Creazione sensore alla prima connessione
//
export function registerSensor(
  id: string,
  valves: number
): void {
  const stmt = db.prepare(`
    INSERT INTO sensors (id, valves, thresholdMin, thresholdMax, lastSeen)
    VALUES (?, ?, 70, 90, ?)
    ON CONFLICT(id) DO NOTHING
  `);

  stmt.run(id, valves, Date.now());
}

//
// Lettura sensori
//
export function getAllSensors(): Sensor[] {
  const stmt = db.prepare("SELECT * FROM sensors");
  return stmt.all() as Sensor[];
}

export function getSensorById(id: string): Sensor | undefined {
  const stmt = db.prepare("SELECT * FROM sensors WHERE id = ?");
  return stmt.get(id) as Sensor | undefined;
}

//
// Aggiornamento configurazione
//
export function updateSensorConfig(
  id: string,
  config: {
    name?: string;
    thresholdMin?: number;
    thresholdMax?: number;
    valves?: number;
  }
): void {
  const sensor = getSensorById(id);
  if (!sensor) {
    throw new Error("Sensor not found");
  }

  const stmt = db.prepare(`
    UPDATE sensors
    SET
      name = COALESCE(?, name),
      thresholdMin = COALESCE(?, thresholdMin),
      thresholdMax = COALESCE(?, thresholdMax),
      valves = COALESCE(?, valves)
    WHERE id = ?
  `);

  stmt.run(
    config.name ?? null,
    config.thresholdMin ?? null,
    config.thresholdMax ?? null,
    config.valves ?? null,
    id
  );
}

//
// Stato online/offline
//
export function isSensorOnline(sensor: Sensor): boolean {
  if (!sensor.lastSeen) return false;

  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minuti

  return now - sensor.lastSeen < timeout;
}
