// src/lib/types.ts

export interface Patient {
    nhs_number: string; // Primary Key
    full_name: string;
    dob: string;
    address: string;
    password_hash: string; // Securely hashed
    created_at: string; // ISO date string for audit tracking
}

export interface Doctor {
    doctor_id: string; // Primary Key
    name: string;
    specialty: string;
    availability_json: string; // Reactive map for real-time scheduling [cite: 160]
}

export interface Appointment {
    app_id: number; // Primary Key (Auto-inc)
    nhs_number: string; // Foreign Key to Patient
    doctor_id: string; // Foreign Key to Doctor
    slot_time: string; // Must be FUTURE_DATE_ONLY
    status: string; // e.g., 'Active' or 'Cancelled'
}

export interface MedicalRecord {
    record_id: number; // Primary Key
    nhs_number: string; // Foreign Key
    doctor_id: string; // Foreign Key
    notes: string; // Clinical observations
    entry_date: string;
}

export interface AuditLog {
    log_id: number; // Primary Key
    nhs_number: string; // Foreign Key to Patient
    action: string; // e.g., 'VIEW_RECORDS', 'CREATE_APPOINTMENT', 'LOGIN'
    timestamp: string; // ISO timestamp
    details?: string; // Optional additional context
}