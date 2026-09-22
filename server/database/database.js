import Database from "better-sqlite3";

const db = new Database("./server/database/database.sqlite");

// SQL code

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_login TEXT,
    account_status TEXT NOT NULL DEFAULT 'active',
    email_verified INTEGER NOT NULL DEFAULT 0,
    email_verification_token TEXT,
    email_verification_expires TEXT,
    profile_image_url TEXT,
    profile_image_public_id TEXT,
    password_reset_token TEXT,
    password_reset_expires TEXT
     );
     `);

//  console.log(db.prepare("PRAGMA table_info(users)").all());

export default db;
