// src/lib/server/database.ts
// Elite-Level Persistence Layer (NFR2: Availability)
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file location
const dbPath = join(__dirname, 'hospital.db');

// Initialize database connection
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema on first run
export function initializeDatabase() {
    // Patients table
    db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
            nhs_number TEXT PRIMARY KEY CHECK(length(nhs_number) = 10),
            full_name TEXT NOT NULL,
            dob TEXT NOT NULL,
            address TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);

    // Doctors table (with password_hash for secure auth - NFR1)
    db.exec(`
        CREATE TABLE IF NOT EXISTS doctors (
            doctor_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            availability_json TEXT NOT NULL,
            password_hash TEXT
        );
    `);

    // Appointments table
    db.exec(`
        CREATE TABLE IF NOT EXISTS appointments (
            app_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nhs_number TEXT NOT NULL,
            doctor_id TEXT NOT NULL,
            slot_time TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Active', 'Completed', 'Cancelled')),
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (nhs_number) REFERENCES patients(nhs_number),
            FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
            UNIQUE(doctor_id, slot_time, status)
        );
    `);

    // Medical records table
    db.exec(`
        CREATE TABLE IF NOT EXISTS medical_records (
            record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nhs_number TEXT NOT NULL,
            doctor_id TEXT NOT NULL,
            notes TEXT NOT NULL,
            entry_date TEXT NOT NULL,
            FOREIGN KEY (nhs_number) REFERENCES patients(nhs_number),
            FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
        );
    `);

    // Audit logs table (T14: NFR1 GDPR Compliance)
    db.exec(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nhs_number TEXT NOT NULL,
            action TEXT NOT NULL,
            timestamp TEXT NOT NULL DEFAULT (datetime('now')),
            details TEXT NOT NULL
        );
    `);

    // Add password_hash column to doctors if it doesn't exist (migration)
    try {
        db.exec(`ALTER TABLE doctors ADD COLUMN password_hash TEXT`);
    } catch (e) {
        // Column already exists
    }

    console.log('✅ Database schema initialized');
}

// Initialize on module load
initializeDatabase();

export default db;
