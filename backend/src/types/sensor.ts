export interface Sensor {
  mac: string;
  name: string | null;
  thresholdMin: number | null;
  thresholdMax: number | null;
  pinHumidity: number | null;
  pinPumps: number[] | null;
  updateInterval: number | null;
}
