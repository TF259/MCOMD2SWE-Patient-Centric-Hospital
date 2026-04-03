// src/lib/server/mockData.ts
import type { Patient, Doctor, Appointment, MedicalRecord } from '$lib/types';

export const patients: Patient[] = [
    {
        nhs_number: "1234567890", // Arthur (P1)
        full_name: "Arthur Retiree",
        dob: "1954-05-12",
        address: "123 Care Lane, Kent",
        password_hash: "arthur123" 
    },
    {
        nhs_number: "0987654321", // Sarah (P2)
        full_name: "Sarah Professional",
        dob: "1997-08-22",
        address: "45 Business St, London",
        password_hash: "sarah123"
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