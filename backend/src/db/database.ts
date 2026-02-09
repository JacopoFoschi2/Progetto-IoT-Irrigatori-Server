import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(__dirname, "../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "greenhouse.db");

export const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS sensors (
    id TEXT PRIMARY KEY,
    name TEXT,
    thresholdMin REAL,
    thresholdMax REAL,
    valves INTEGER,
    lastHumidity REAL,
    lastSeen INTEGER
);
`);
