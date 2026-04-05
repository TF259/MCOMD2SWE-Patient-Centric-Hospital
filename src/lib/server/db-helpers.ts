// src/lib/server/db-helpers.ts
// Database wrapper functions for CRUD operations
import db from './database';
import type { Patient, Doctor, Appointment, MedicalRecord, AuditLog } from '$lib/types';

// ============= PATIENT OPERATIONS =============
export function findPatientByNHS(nhsNumber: string): Patient | null {
    try {
        const stmt = db.prepare('SELECT * FROM patients WHERE nhs_number = ?');
        const patient = stmt.get(nhsNumber) as Patient | undefined;
        return patient || null;
    } catch (error) {
        console.error('Error finding patient:', error);
        return null;
    }
}

// ============= DOCTOR OPERATIONS =============
export function getAllDoctors(): Doctor[] {
    try {
        const stmt = db.prepare('SELECT * FROM doctors');
        return stmt.all() as Doctor[];
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
}

export function findDoctorById(doctorId: string): Doctor | null {
    try {
        const stmt = db.prepare('SELECT * FROM doctors WHERE doctor_id = ?');
        const doctor = stmt.get(doctorId) as Doctor | undefined;
        return doctor || null;
    } catch (error) {
        console.error('Error finding doctor:', error);
        return null;
    }
}

// ============= APPOINTMENT OPERATIONS =============
export function getAppointmentsByNHS(nhsNumber: string): Appointment[] {
    try {
        const stmt = db.prepare(`
            SELECT * FROM appointments 
            WHERE nhs_number = ? AND status = 'Active'
            ORDER BY slot_time ASC
        `);
        return stmt.all(nhsNumber) as Appointment[];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

export function createAppointment(
    nhsNumber: string,
    doctorId: string,
    slotTime: string
): { success: boolean; error?: string; appointmentId?: number } {
    try {
        // Check for double booking
        const existingStmt = db.prepare(`
            SELECT COUNT(*) as count FROM appointments 
            WHERE doctor_id = ? AND slot_time = ? AND status = 'Active'
        `);
        const existing = existingStmt.get(doctorId, slotTime) as { count: number };
        
        if (existing.count > 0) {
            return { success: false, error: 'This time slot is already booked' };
        }

        // Create appointment
        const insertStmt = db.prepare(`
            INSERT INTO appointments (nhs_number, doctor_id, slot_time, status)
            VALUES (?, ?, ?, 'Active')
        `);
        const result = insertStmt.run(nhsNumber, doctorId, slotTime);
        
        return { success: true, appointmentId: Number(result.lastInsertRowid) };
    } catch (error) {
        console.error('Error creating appointment:', error);
        return { success: false, error: 'Failed to create appointment' };
    }
}

export function cancelAppointment(appId: number): { success: boolean; error?: string } {
    try {
        const stmt = db.prepare(`
            UPDATE appointments 
            SET status = 'Cancelled' 
            WHERE app_id = ? AND status = 'Active'
        `);
        const result = stmt.run(appId);
        
        if (result.changes === 0) {
            return { success: false, error: 'Appointment not found or already cancelled' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return { success: false, error: 'Failed to cancel appointment' };
    }
}

// ============= MEDICAL RECORDS OPERATIONS =============
export function getMedicalRecordsByNHS(nhsNumber: string): MedicalRecord[] {
    try {
        const stmt = db.prepare(`
            SELECT * FROM medical_records 
            WHERE nhs_number = ?
            ORDER BY entry_date DESC
        `);
        return stmt.all(nhsNumber) as MedicalRecord[];
    } catch (error) {
        console.error('Error fetching medical records:', error);
        return [];
    }
}

// ============= AUDIT LOG OPERATIONS =============
export function createAuditLog(
    nhsNumber: string,
    action: string,
    details: string
): void {
    try {
        const stmt = db.prepare(`
            INSERT INTO audit_logs (nhs_number, action, details)
            VALUES (?, ?, ?)
        `);
        stmt.run(nhsNumber, action, details);
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
}

export function getAuditLogsByNHS(nhsNumber: string): AuditLog[] {
    try {
        const stmt = db.prepare(`
            SELECT * FROM audit_logs 
            WHERE nhs_number = ?
            ORDER BY timestamp DESC
        `);
        return stmt.all(nhsNumber) as AuditLog[];
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}

// ============= DOCTOR DASHBOARD OPERATIONS =============

// Get today's appointments for a doctor
export function getDoctorTodayAppointments(doctorId: string): (Appointment & { patient_name?: string })[] {
    try {
        const today = new Date().toISOString().split('T')[0];
        const stmt = db.prepare(`
            SELECT a.*, p.full_name as patient_name
            FROM appointments a
            LEFT JOIN patients p ON a.nhs_number = p.nhs_number
            WHERE a.doctor_id = ? 
            AND date(a.slot_time) = date(?)
            AND a.status = 'Active'
            ORDER BY a.slot_time ASC
        `);
        return stmt.all(doctorId, today) as (Appointment & { patient_name?: string })[];
    } catch (error) {
        console.error('Error fetching today appointments:', error);
        return [];
    }
}

// Get upcoming appointments for a doctor (next 7 days, excluding today)
export function getDoctorUpcomingAppointments(doctorId: string): (Appointment & { patient_name?: string })[] {
    try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const stmt = db.prepare(`
            SELECT a.*, p.full_name as patient_name
            FROM appointments a
            LEFT JOIN patients p ON a.nhs_number = p.nhs_number
            WHERE a.doctor_id = ? 
            AND date(a.slot_time) > date(?)
            AND date(a.slot_time) <= date(?)
            AND a.status = 'Active'
            ORDER BY a.slot_time ASC
        `);
        return stmt.all(doctorId, today, nextWeek) as (Appointment & { patient_name?: string })[];
    } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
        return [];
    }
}

// Get appointment history for a doctor (past appointments)
export function getDoctorAppointmentHistory(doctorId: string, limit: number = 20): (Appointment & { patient_name?: string })[] {
    try {
        const today = new Date().toISOString().split('T')[0];
        const stmt = db.prepare(`
            SELECT a.*, p.full_name as patient_name
            FROM appointments a
            LEFT JOIN patients p ON a.nhs_number = p.nhs_number
            WHERE a.doctor_id = ? 
            AND (date(a.slot_time) < date(?) OR a.status IN ('Completed', 'Cancelled'))
            ORDER BY a.slot_time DESC
            LIMIT ?
        `);
        return stmt.all(doctorId, today, limit) as (Appointment & { patient_name?: string })[];
    } catch (error) {
        console.error('Error fetching appointment history:', error);
        return [];
    }
}

// Mark an appointment as completed
export function completeAppointment(appId: number): { success: boolean; error?: string } {
    try {
        const stmt = db.prepare(`
            UPDATE appointments 
            SET status = 'Completed' 
            WHERE app_id = ? AND status = 'Active'
        `);
        const result = stmt.run(appId);
        
        if (result.changes === 0) {
            return { success: false, error: 'Appointment not found or already completed' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error completing appointment:', error);
        return { success: false, error: 'Failed to complete appointment' };
    }
}

// Get patient details by NHS number (for doctor view)
export function getPatientDetails(nhsNumber: string): { nhs_number: string; full_name: string; dob: string } | null {
    try {
        const stmt = db.prepare(`
            SELECT nhs_number, full_name, dob
            FROM patients
            WHERE nhs_number = ?
        `);
        return stmt.get(nhsNumber) as { nhs_number: string; full_name: string; dob: string } | null;
    } catch (error) {
        console.error('Error fetching patient details:', error);
        return null;
    }
}
