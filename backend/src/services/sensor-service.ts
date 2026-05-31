import { db } from "../db/database";
import client from "../mqtt/mqtt-client";
import { Sensor } from "../types/sensor";

// --- Stato in memoria (non persiste, si aggiorna via MQTT) ---
interface SensorState {
  humidity: number | null;
  valves: boolean[];
  lastSeen: number | null;
}

const sensorStates: Map<string, SensorState> = new Map();

export function getSensorState(mac: string): SensorState {
  return sensorStates.get(mac) ?? { humidity: null, valves: [], lastSeen: null };
}

export function updateSensorState(mac: string, humidity: number, valves: boolean[]) {
  sensorStates.set(mac, {
    humidity,
    valves,
    lastSeen: Date.now(),
  });
  console.log(`📊 State updated for ${mac}: humidity=${humidity}%, valves=${valves}`);
}

// --- Registrazione sensore ---
export function registerSensor(mac: string) {
  const existing = db.prepare("SELECT * FROM sensors WHERE mac = ?").get(mac);
  if (!existing) {
    db.prepare(`
      INSERT INTO sensors (mac, name, thresholdMin, thresholdMax, pinHumidity, updateInterval)
      VALUES (?, NULL, NULL, NULL, NULL, NULL)
    `).run(mac);
    console.log(`✅ Sensor registered: ${mac}`);
  }
}

// --- Invio configurazione al sensore via MQTT ---
export function publishSensorConfig(sensorId: number) {
  const sensor = db.prepare("SELECT * FROM sensors WHERE id = ?").get(sensorId) as Sensor | undefined;
  if (!sensor) return;

  const pumpRows = db.prepare("SELECT pin FROM sensor_pumps WHERE id = ?").all(sensorId) as { pin: number }[];
  const pinPumps = pumpRows.map((p) => p.pin);

  const topic = `greenhouse/sensor/config/${sensor.mac}`;
  const payload = JSON.stringify({
    name: sensor.name,
    thresholdMin: sensor.thresholdMin,
    thresholdMax: sensor.thresholdMax,
    updateInterval: sensor.updateInterval,
    pinHumidity: sensor.pinHumidity,
    pinPumps,
  });

  client.publish(topic, payload);
  console.log(`📤 Config sent to ${sensor.mac}:`, payload);
}

// --- Comando manuale valvola ---
export function publishValveCommand(mac: string, valveIndex: number, state: boolean) {
  const topic = `greenhouse/sensor/valve/${mac}`;
  const payload = JSON.stringify({ valve: valveIndex, state });
  client.publish(topic, payload);
  console.log(`🚿 Valve command sent to ${mac}: valve=${valveIndex}, state=${state}`);
}
