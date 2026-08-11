import Database from "better-sqlite3";

const db = new Database("./server/database/database.sqlite");

// SQL code

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
     );
     `);

//  console.log(db.prepare("PRAGMA table_info(users)").all());

export default db;
