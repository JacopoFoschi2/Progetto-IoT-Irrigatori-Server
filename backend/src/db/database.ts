import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../data/greenhouse.db");

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
