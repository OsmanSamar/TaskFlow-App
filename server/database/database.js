import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "database.sqlite"));

// const db = new Database("./server/database/database.sqlite"); Current Working Directory


// Enable SQLite foreign-key enforcement for relations such as ON DELETE CASCADE.
db.pragma("foreign_keys = ON");

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
    role TEXT NOT NULL DEFAULT 'user',
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
    due_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON notifications (user_id, created_at DESC);
`);

// Add due_date to existing databases without deleting current tasks.
// try {
//   db.prepare(`
//     ALTER TABLE tasks
//     ADD COLUMN due_date TEXT
//   `).run();
// } catch (error) {
//   // Ignore the error when the column was already added previously.
//   if (!error.message.includes("duplicate column name")) {
//     throw error;
//   }
// }

//  console.log(db.prepare("PRAGMA table_info(users)").all());

// Add task_id to existing notification tables without deleting saved data.
// try {
//   db.exec(`
//     ALTER TABLE notifications
//     ADD COLUMN task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE
//   `);
// } catch (error) {
//   // Ignore the error if task_id already exists.
//   if (!error.message.includes("duplicate column name")) {
//     throw error;
//   }
// }


// Assign admin role to a specific user
const adminEmail = "osmansamar367@gmail.com".toLowerCase();

const result = db.prepare(`
  UPDATE users
  SET role = 'admin'
  WHERE lower(email) = ?
`).run(adminEmail);

console.log(`Admin role assigned to ${result.changes} account(s).`);

export default db;
