import mqtt from "mqtt";
import {
  registerSensor,
  upsertSensorStatus,
  getSensorById
} from "../services/sensor-service";
import { Sensor } from "../types/sensor";

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

client.subscribe("greenhouse/sensor/+/hello", (err: any) => {
  if (err) console.error("Subscribe error:", err);
});

client.on("error", (err: any) => {
  console.error("MQTT error:", err);
});

client.on("message", (topic: string, payload: Buffer) => {
  try {
    const message = JSON.parse(payload.toString());

    const topicParts = topic.split("/");
    if (topicParts.length !== 4) return;
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

export function publishConfig(sensorId: string, sensor: Sensor) {
  const topic = `greenhouse/sensor/${sensorId}/config`;

  const configPayload = {
    name: sensor.name,
    thresholdMin: sensor.thresholdMin,
    thresholdMax: sensor.thresholdMax,
    valves: sensor.valves
  };

  client.publish(topic, JSON.stringify(configPayload));
}
