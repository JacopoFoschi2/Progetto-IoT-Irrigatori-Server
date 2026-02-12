import mqtt from "mqtt";
import {
  registerSensor,
  upsertSensorStatus,
  getSensorById
} from "../services/sensor-service";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";

const client = mqtt.connect(MQTT_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 5000
});

client.on("connect", () => {
  console.log("MQTT connected");

  client.subscribe("greenhouse/sensor/+/hello");
  client.subscribe("greenhouse/sensor/+/status");
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});

client.on("message", (topic, payload) => {
  try {
    const message = JSON.parse(payload.toString());

    const topicParts = topic.split("/");
    const sensorId = topicParts[2];
    const messageType = topicParts[3];

    if (messageType === "hello") {
      handleHello(sensorId, message);
    }

    if (messageType === "status") {
      handleStatus(sensorId, message);
    }

  } catch (error) {
    console.error("Invalid MQTT message:", error);
  }
});

function handleHello(sensorId: string, message: any) {
  const valves = message.valves ?? 0;

  registerSensor(sensorId, valves);

  const sensor = getSensorById(sensorId);
  if (sensor) {
    publishConfig(sensorId, sensor);
  }
}

function handleStatus(sensorId: string, message: any) {
  const humidity = message.humidity;

  if (typeof humidity !== "number") return;

  upsertSensorStatus(sensorId, humidity);
}

export function publishConfig(sensorId: string, sensor: any) {
  const topic = `greenhouse/sensor/${sensorId}/config`;

  const configPayload = {
    name: sensor.name,
    thresholdMin: sensor.thresholdMin,
    thresholdMax: sensor.thresholdMax,
    valves: sensor.valves
  };

  client.publish(topic, JSON.stringify(configPayload));
}
