// src/lib/server/db-seed.ts
// Data Migration Script: Move mockData to persistent storage
import db from './database';
import bcrypt from 'bcryptjs';

// Only seed in development - skip in production
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Helper function to generate random addresses
function generateRandomAddress(): string {
    const streetNumbers = Array.from({ length: 150 }, (_, i) => i + 1);
    const streetNames = ['Oak', 'Elm', 'Maple', 'Pine', 'Cedar', 'Birch', 'Ash', 'Willow', 'Hazel', 'Sycamore', 'Poplar', 'Linden', 'Chestnut', 'Thorn', 'Rose', 'Lily', 'Daisy', 'Ivy', 'Grove', 'Park', 'Lane', 'Road', 'Street', 'Avenue', 'Court', 'Drive'];
    const cities = ['London', 'Kent', 'Surrey', 'Sussex', 'Essex', 'Berkshire', 'Hampshire', 'Oxfordshire', 'Buckinghamshire', 'Cambridgeshire'];
    const postcodes = ['SW1A 1AA', 'E1 6AN', 'N1C 4BF', 'K1 2AA', 'CR2 6XH', 'SM1 1AH', 'RH1 1AA', 'BR1 1AA', 'CH43 5ER', 'LE1 1AA'];

    const streetNum = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const postcode = postcodes[Math.floor(Math.random() * postcodes.length)];

    return `${streetNum} ${street} Street, ${city}, ${postcode}`;
}

export function seedDatabase() {
    // Skip seeding in production unless explicitly allowed
    if (IS_PRODUCTION && !process.env.ALLOW_SEED_IN_PRODUCTION) {
        return;
    }

    // Check if already seeded
    const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number };

    if (patientCount.count > 0) {
        // Migration: Fill in blank or null addresses with random ones
        try {
            const blankAddressesSql = "SELECT COUNT(*) as count FROM patients WHERE address IS NULL OR address = '' OR address LIKE '%null%'";
            const blankAddressCount = db.prepare(blankAddressesSql).get() as { count: number };

            if (blankAddressCount.count > 0) {
                const patients = db.prepare("SELECT nhs_number FROM patients WHERE address IS NULL OR address = '' OR address LIKE '%null%'").all() as { nhs_number: string }[];
                const updateStmt = db.prepare('UPDATE patients SET address = ? WHERE nhs_number = ?');

                patients.forEach(patient => {
                    const newAddress = generateRandomAddress();
                    updateStmt.run(newAddress, patient.nhs_number);
                });
            }
        } catch {
            // Migration check completed
        }
        return;
    }

    // Generate password hashes (NFR1: Secure auth with bcrypt)
    // NOTE: In production, use environment variables for default credentials
    const ARTHUR_HASH = bcrypt.hashSync(process.env.SEED_PATIENT_PASSWORD || 'SecurePass123!', 10);
    const SARAH_HASH = bcrypt.hashSync(process.env.SEED_PATIENT_PASSWORD_2 || 'SarahSecure456!', 10);
    const DOCTOR_HASH = bcrypt.hashSync(process.env.SEED_DOCTOR_PASSWORD || 'DoctorPass123!', 10);

    // Seed patients
    const insertPatient = db.prepare(`
        INSERT INTO patients (nhs_number, full_name, dob, address, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPatient.run('1234567890', 'Arthur Retiree', '1954-05-12', generateRandomAddress(), ARTHUR_HASH, '2025-10-01T10:00:00Z');
    insertPatient.run('0987654321', 'Sarah Professional', '1997-08-22', generateRandomAddress(), SARAH_HASH, '2025-10-01T10:00:00Z');

    // Seed doctors - Multiple per specialty for filtering demonstration
    const insertDoctor = db.prepare(`
        INSERT INTO doctors (doctor_id, name, specialty, availability_json, password_hash)
        VALUES (?, ?, ?, ?, ?)
    `);

    // Standard time slots for most doctors
    const standardSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
    
    // CARDIOLOGY (2 doctors)
    insertDoctor.run('DR_SMITH_001', 'Dr. Emily Smith', 'Cardiology', JSON.stringify(standardSlots), DOCTOR_HASH);
    insertDoctor.run('DR_CHEN_002', 'Dr. Michael Chen', 'Cardiology', JSON.stringify(standardSlots), DOCTOR_HASH);
    
    // GENERAL PRACTICE (2 doctors)
    insertDoctor.run('DR_MEHTA_003', 'Dr. Priya Mehta', 'General Practice', JSON.stringify(standardSlots), DOCTOR_HASH);
    insertDoctor.run('DR_WILSON_004', 'Dr. James Wilson', 'General Practice', JSON.stringify(standardSlots), DOCTOR_HASH);
    
    // NEUROLOGY (2 doctors)
    insertDoctor.run('DR_PATEL_005', 'Dr. Arun Patel', 'Neurology', JSON.stringify(standardSlots), DOCTOR_HASH);
    insertDoctor.run('DR_JONES_006', 'Dr. Sarah Jones', 'Neurology', JSON.stringify(standardSlots), DOCTOR_HASH);
    
    // DERMATOLOGY (1 doctor)
    insertDoctor.run('DR_KUMAR_007', 'Dr. Raj Kumar', 'Dermatology', JSON.stringify(standardSlots), DOCTOR_HASH);
    
    // PAEDIATRICS (1 doctor)
    insertDoctor.run('DR_TAYLOR_008', 'Dr. Lisa Taylor', 'Paediatrics', JSON.stringify(standardSlots), DOCTOR_HASH);

    // Seed existing appointments (for double-booking prevention demo)
    const insertAppointment = db.prepare(`
        INSERT INTO appointments (nhs_number, doctor_id, slot_time, status, created_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    // Get tomorrow and next few days for realistic appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Existing booked appointments
    insertAppointment.run('0987654321', 'DR_SMITH_001', `${formatDate(tomorrow)} 09:00`, 'Active', new Date().toISOString());
    insertAppointment.run('0987654321', 'DR_SMITH_001', `${formatDate(tomorrow)} 10:00`, 'Active', new Date().toISOString());
    insertAppointment.run('1234567890', 'DR_MEHTA_003', `${formatDate(dayAfter)} 09:30`, 'Active', new Date().toISOString());
    insertAppointment.run('0987654321', 'DR_PATEL_005', `${formatDate(tomorrow)} 14:00`, 'Active', new Date().toISOString());

    // Seed medical records
    const insertRecord = db.prepare(`
        INSERT INTO medical_records (nhs_number, doctor_id, notes, entry_date)
        VALUES (?, ?, ?, ?)
    `);

    insertRecord.run(
        '1234567890',
        'DR_SMITH_001',
        'Routine cardiovascular check-up. Blood pressure normal at 120/80. Heart rhythm regular. ECG shows normal sinus rhythm.',
        '2026-01-15'
    );

    insertRecord.run(
        '1234567890',
        'DR_MEHTA_003',
        'Annual health assessment. All vitals within normal range. Recommended continued exercise routine.',
        '2025-11-10'
    );

    insertRecord.run(
        '1234567890',
        'DR_PATEL_005',
        'Neurological consultation. No concerns identified. Patient reports no headaches or dizziness.',
        '2025-12-01'
    );

    // Seed initial audit log
    const insertAudit = db.prepare(`
        INSERT INTO audit_logs (nhs_number, action, timestamp, details)
        VALUES (?, ?, ?, ?)
    `);

    insertAudit.run('1234567890', 'VIEW_RECORDS', '2025-11-10T14:30:00Z', 'Initial record access');
}

// Auto-seed on import (run once)
seedDatabase();
