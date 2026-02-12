import mqtt from "mqtt";
import { registerSensor } from "../services/sensor-service";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

// Connessione al broker
const client = mqtt.connect(MQTT_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  reconnectPeriod: 5000
});

// Evento di connessione
client.on("connect", () => {
  console.log("MQTT connected");

  // Sottoscrivi i topic principali
  client.subscribe("greenhouse/sensor/hello");
  client.subscribe("greenhouse/sensor/status/+");
  client.subscribe("greenhouse/sensor/check/+");
});

// Gestione errori
client.on("error", (err) => {
  console.error("MQTT error:", err);
});

// --- Detection del hello
client.on("message", (topic, message) => {
  if (topic === "greenhouse/sensor/hello") {
    const mac = message.toString().trim();
    console.log(`New sensor detected! MAC: ${mac}`);

    try {
      registerSensor(mac); // registra nel DB se non esiste
    } catch (err: any) {
      console.error("Failed to register sensor:", err.message);
    }
  }
});

// Gestione messaggi
client.on("message", (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
});

// Esportiamo il client se vogliamo usarlo altrove
export default client;
