// src/lib/server/mockData.ts
import type { Patient, Doctor, Appointment, MedicalRecord } from '$lib/types';

// Update these in your patients array
export const patients: Patient[] = [
    {
        nhs_number: "1234567890",
        full_name: "Arthur Retiree",
        dob: "1954-05-12",
        address: "123 Care Lane, Kent",
        // Hash for "arthur123"
        password_hash: "$2a$10$Z7b1.E8R7XyQ9S8X7Y6Z5O1p2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6", 
        created_at: "2025-10-01T10:00:00Z"
    },
    {
        nhs_number: "0987654321",
        full_name: "Sarah Professional",
        dob: "1997-08-22",
        address: "45 Business St, London",
        // Hash for "sarah123"
        password_hash: "$2a$10$Y6Z5O1p2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3L4",
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