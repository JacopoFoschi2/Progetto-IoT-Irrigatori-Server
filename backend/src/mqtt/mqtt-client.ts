import mqtt from "mqtt";
import { registerSensor, updateSensorState } from "../services/sensor-service";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const client = mqtt.connect(MQTT_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  reconnectPeriod: 5000,
});

client.on("connect", () => {
  console.log("✅ MQTT connected to broker");
  client.subscribe("greenhouse/sensor/hello");
  client.subscribe("greenhouse/sensor/status/+");
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

client.on("message", (topic, message) => {
  const payload = message.toString().trim();

  // Nuovo sensore si annuncia
  if (topic === "greenhouse/sensor/hello") {
    console.log(`🌱 New sensor detected: ${payload}`);
    try {
      registerSensor(payload);
    } catch (err: any) {
      console.error("Failed to register sensor:", err.message);
    }
    return;
  }

  // Aggiornamento stato sensore: greenhouse/sensor/status/{mac}
  const statusMatch = topic.match(/^greenhouse\/sensor\/status\/(.+)$/);
  if (statusMatch) {
    const mac = statusMatch[1];
    try {
      const data = JSON.parse(payload);
      // data atteso: { humidity: number, valves: boolean[] }
      updateSensorState(mac, data.humidity, data.valves ?? []);
    } catch (err: any) {
      console.error(`Failed to parse status from ${mac}:`, err.message);
    }
    return;
  }
});

export default client;
