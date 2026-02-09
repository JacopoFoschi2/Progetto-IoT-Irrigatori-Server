export interface Sensor {
  id: string;
  name: string | null;
  thresholdMin: number | null;
  thresholdMax: number | null;
  valves: number | null;
  lastHumidity: number | null;
  lastSeen: number | null;
}
