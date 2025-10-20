import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      photo TEXT,
      address TEXT,
      bank_name TEXT,
      ifsc_code TEXT,
      account_number TEXT,
      phone TEXT,
      emergency_contact TEXT,
      blood_group TEXT,
      date_of_joining DATE,
      designation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER,
      date DATE NOT NULL,
      shift_start TIME DEFAULT '09:00',
      shift_end TIME DEFAULT '18:00',
      actual_start TIME,
      actual_end TIME,
      overtime_hours REAL DEFAULT 0,
      status TEXT DEFAULT 'present',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (worker_id) REFERENCES workers (id),
      UNIQUE(worker_id, date)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS supervisor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO supervisor (username, password_hash) VALUES (?, ?)`, 
      ['admin', defaultPassword], function(err) {
        if (err) {
          console.log('Error creating default admin:', err);
        } else {
          if (this.changes > 0) {
            console.log('✅ Default admin created: username=admin, password=admin123');
          }
        }
      });
  });

  console.log('✅ Database initialized successfully');
};

export { db };
