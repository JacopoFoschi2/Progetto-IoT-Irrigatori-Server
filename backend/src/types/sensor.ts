export interface Sensor {
  id: number;
  mac: string;
  name: string | null;
  thresholdMin: number | null;
  thresholdMax: number | null;
  pinHumidity: number | null;
  updateInterval: number | null;
}

export interface SensorWithState extends Sensor {
  humidity: number | null;
  valves: boolean[];
  lastSeen: number | null;
}
