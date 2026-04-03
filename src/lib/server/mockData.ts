// src/lib/server/mockData.ts
import type { Patient, Doctor, Appointment, MedicalRecord, AuditLog } from '$lib/types';
import bcrypt from 'bcryptjs';

// Pre-generated bcrypt hashes (bcrypt.hashSync with salt rounds 10)
// Arthur: "arthur123" -> this hash
// Sarah: "sarah123" -> this hash
const ARTHUR_HASH = bcrypt.hashSync('arthur123', 10);
const SARAH_HASH = bcrypt.hashSync('sarah123', 10);

export const patients: Patient[] = [
    {
        nhs_number: "1234567890",
        full_name: "Arthur Retiree",
        dob: "1954-05-12",
        address: "123 Care Lane, Kent",
        password_hash: ARTHUR_HASH,
        created_at: "2025-10-01T10:00:00Z"
    },
    {
        nhs_number: "0987654321",
        full_name: "Sarah Professional",
        dob: "1997-08-22",
        address: "45 Business St, London",
        password_hash: SARAH_HASH,
        created_at: "2025-10-01T10:00:00Z"
    }
];
export const doctors: Doctor[] = [
    {
        doctor_id: "DR_MEHTA_005",
        name: "Dr. Mehta",
        specialty: "Cardiology",
        availability_json: JSON.stringify([
            { time: "09:00", status: "READY" },
            { time: "09:30", status: "BOOKED" }
        ])
    }
];

// CRITICAL: Added for Story 03 & 04 Traceability
export const appointments: Appointment[] = [
    {
        app_id: 101,
        nhs_number: "1234567890",
        doctor_id: "DR_MEHTA_005",
        slot_time: "2026-04-10 09:30",
        status: "Active"
    }
];

export const medicalRecords: MedicalRecord[] = [
    {
        record_id: 5001,
        nhs_number: "1234567890",
        doctor_id: "DR_MEHTA_005",
        notes: "ADHD/Autism assessment confirmed. Clinical observations align with DSM-5.",
        entry_date: "2025-11-10"
    }
];

// T14: Audit Logging for NFR1 (GDPR/Clinical Compliance)
export const auditLogs: AuditLog[] = [
    {
        log_id: 1,
        nhs_number: "1234567890",
        action: "VIEW_RECORDS",
        timestamp: "2025-11-10T14:30:00Z",
        details: "Initial record access"
    }
];