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
    password_reset_expires TEXT,
    dark_mode INTEGER NOT NULL DEFAULT 0,
    language TEXT NOT NULL DEFAULT 'en',
    email_notifications INTEGER NOT NULL DEFAULT 1,
    task_reminders INTEGER NOT NULL DEFAULT 1,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0
     );

      CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
     `);

//  console.log(db.prepare("PRAGMA table_info(users)").all());


export default db;
