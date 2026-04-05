// src/lib/server/db-seed.ts
// Data Migration Script: Move mockData to persistent storage
import db from './database';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
    // Check if already seeded
    const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number };
    
    if (patientCount.count > 0) {
        console.log('⚠️  Database already seeded, skipping...');
        return;
    }

    console.log('🌱 Seeding database with initial data...');

    // Generate password hashes
    const ARTHUR_HASH = bcrypt.hashSync('arthur123', 10);
    const SARAH_HASH = bcrypt.hashSync('sarah123', 10);

    // Seed patients
    const insertPatient = db.prepare(`
        INSERT INTO patients (nhs_number, full_name, dob, address, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPatient.run('1234567890', 'Arthur Retiree', '1954-05-12', '123 Care Lane, Kent', ARTHUR_HASH, '2025-10-01T10:00:00Z');
    insertPatient.run('0987654321', 'Sarah Professional', '1997-08-22', '45 Business St, London', SARAH_HASH, '2025-10-01T10:00:00Z');

    // Seed doctors
    const insertDoctor = db.prepare(`
        INSERT INTO doctors (doctor_id, name, specialty, availability_json)
        VALUES (?, ?, ?, ?)
    `);

    const availability = JSON.stringify([
        { time: "09:00", status: "READY" },
        { time: "09:30", status: "READY" },
        { time: "10:00", status: "READY" },
        { time: "10:30", status: "READY" },
        { time: "14:00", status: "READY" },
        { time: "14:30", status: "READY" }
    ]);

    insertDoctor.run('DR_MEHTA_005', 'Dr. Mehta', 'Cardiology', availability);
    insertDoctor.run('DR_SMITH_010', 'Dr. Smith', 'General Practice', availability);

    // Seed appointments
    const insertAppointment = db.prepare(`
        INSERT INTO appointments (nhs_number, doctor_id, slot_time, status, created_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    insertAppointment.run('1234567890', 'DR_MEHTA_005', '2026-04-10 09:30', 'Active', new Date().toISOString());

    // Seed medical records
    const insertRecord = db.prepare(`
        INSERT INTO medical_records (nhs_number, doctor_id, notes, entry_date)
        VALUES (?, ?, ?, ?)
    `);

    insertRecord.run(
        '1234567890',
        'DR_MEHTA_005',
        'ADHD/Autism assessment confirmed. Clinical observations align with DSM-5.',
        '2025-11-10'
    );

    insertRecord.run(
        '1234567890',
        'DR_MEHTA_005',
        'Follow-up consultation. Patient reports improved quality of life with current treatment plan.',
        '2025-12-01'
    );

    // Seed initial audit log
    const insertAudit = db.prepare(`
        INSERT INTO audit_logs (nhs_number, action, timestamp, details)
        VALUES (?, ?, ?, ?)
    `);

    insertAudit.run('1234567890', 'VIEW_RECORDS', '2025-11-10T14:30:00Z', 'Initial record access');

    console.log('✅ Database seeded successfully');
}

// Auto-seed on import (run once)
seedDatabase();
