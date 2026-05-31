import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "greenhouse.db");
export const db = new Database(dbPath);

// Sensori registrati (dati persistenti)
db.exec(`
CREATE TABLE IF NOT EXISTS sensors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mac TEXT UNIQUE NOT NULL,
  name TEXT,
  thresholdMin INTEGER,
  thresholdMax INTEGER,
  pinHumidity INTEGER,
  updateInterval INTEGER
);
`);

// Pompe collegate a ogni sensore
db.exec(`
CREATE TABLE IF NOT EXISTS sensor_pumps (
  id INTEGER NOT NULL,
  pin INTEGER NOT NULL,
  PRIMARY KEY (id, pin),
  FOREIGN KEY (id) REFERENCES sensors(id) ON DELETE CASCADE
);
`);
