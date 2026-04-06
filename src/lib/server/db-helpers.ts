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

export function getAppointmentsWithDoctorDetails(nhsNumber: string): (Appointment & { doctor_name: string; doctor_specialty: string })[] {
    try {
        const stmt = db.prepare(`
            SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.nhs_number = ? AND a.status = 'Active'
            ORDER BY a.slot_time ASC
        `);
        return stmt.all(nhsNumber) as (Appointment & { doctor_name: string; doctor_specialty: string })[];
    } catch (error) {
        console.error('Error fetching appointments with doctor details:', error);
        return [];
    }
}

export function createAppointment(
    nhsNumber: string,
    doctorId: string,
    slotTime: string,
    reasonForVisit?: string
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

        // Create appointment with reason for visit (Story 03)
        const insertStmt = db.prepare(`
            INSERT INTO appointments (nhs_number, doctor_id, slot_time, reason_for_visit, status)
            VALUES (?, ?, ?, ?, 'Active')
        `);
        const result = insertStmt.run(nhsNumber, doctorId, slotTime, reasonForVisit || null);

        return { success: true, appointmentId: Number(result.lastInsertRowid) };
    } catch (error) {
        console.error('Error creating appointment:', error);
        return { success: false, error: 'Failed to create appointment' };
    }
}

export function cancelAppointment(appId: number, notes?: string): { success: boolean; error?: string } {
    try {
        const stmt = db.prepare(`
            UPDATE appointments
            SET status = 'Cancelled', completion_notes = ?
            WHERE app_id = ? AND status = 'Active'
        `);
        const result = stmt.run(notes || null, appId);

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

// Search medical records with filters (Story 04 - Medical Records Search)
export function searchMedicalRecords(
    nhsNumber: string,
    searchTerm?: string,
    doctorFilter?: string,
    dateFrom?: string,
    dateTo?: string
): MedicalRecord[] {
    try {
        let query = `
            SELECT * FROM medical_records
            WHERE nhs_number = ?
        `;
        const params: any[] = [nhsNumber];

        if (searchTerm && searchTerm.trim()) {
            query += ` AND notes LIKE ? `;
            params.push(`%${searchTerm}%`);
        }

        if (doctorFilter && doctorFilter.trim()) {
            query += ` AND doctor_id = ? `;
            params.push(doctorFilter);
        }

        if (dateFrom) {
            query += ` AND entry_date >= ? `;
            params.push(dateFrom);
        }

        if (dateTo) {
            query += ` AND entry_date <= ? `;
            params.push(dateTo);
        }

        query += ` ORDER BY entry_date DESC`;

        const stmt = db.prepare(query);
        return stmt.all(...params) as MedicalRecord[];
    } catch (error) {
        console.error('Error searching medical records:', error);
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
export function completeAppointment(appId: number, notes?: string): { success: boolean; error?: string } {
    try {
        const stmt = db.prepare(`
            UPDATE appointments
            SET status = 'Completed', completion_notes = ?
            WHERE app_id = ? AND status = 'Active'
        `);
        const result = stmt.run(notes || null, appId);

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

// ============= BOOKING SLOT OPERATIONS =============

// Get all booked slots for a doctor on a specific date
export function getBookedSlotsForDoctor(doctorId: string, date: string): string[] {
    try {
        const stmt = db.prepare(`
            SELECT slot_time FROM appointments 
            WHERE doctor_id = ? 
            AND date(slot_time) = date(?)
            AND status = 'Active'
        `);
        const slots = stmt.all(doctorId, date) as { slot_time: string }[];
        return slots.map(s => s.slot_time);
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return [];
    }
}

// Get all unique specialties from doctors
export function getAllSpecialties(): string[] {
    try {
        const stmt = db.prepare('SELECT DISTINCT specialty FROM doctors ORDER BY specialty');
        const results = stmt.all() as { specialty: string }[];
        return results.map(r => r.specialty);
    } catch (error) {
        console.error('Error fetching specialties:', error);
        return [];
    }
}

// Get doctors by specialty
export function getDoctorsBySpecialty(specialty: string): Doctor[] {
    try {
        const stmt = db.prepare('SELECT * FROM doctors WHERE specialty = ?');
        return stmt.all(specialty) as Doctor[];
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        return [];
    }
}

// Check if a specific slot is available for a doctor
export function isSlotAvailable(doctorId: string, slotTime: string): boolean {
    try {
        const stmt = db.prepare(`
            SELECT COUNT(*) as count FROM appointments
            WHERE doctor_id = ? AND slot_time = ? AND status = 'Active'
        `);
        const result = stmt.get(doctorId, slotTime) as { count: number };
        return result.count === 0;
    } catch (error) {
        console.error('Error checking slot availability:', error);
        return false;
    }
}

// Get count of available vs booked slots for a doctor (next 7 days)
export function getSlotStats(doctorId: string): { available: number; booked: number } {
    try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Get booked slots
        const bookedStmt = db.prepare(`
            SELECT COUNT(*) as count FROM appointments
            WHERE doctor_id = ? AND status = 'Active'
            AND slot_time >= ? AND slot_time <= ?
        `);
        const bookedResult = bookedStmt.get(doctorId, `${today} 00:00`, `${nextWeek} 23:59`) as { count: number };

        // Calculate available (11 slots per day × 7 days = 77 slots, minus lunch breaks)
        // Assumption: 09:00-12:00 (7 slots) + 14:00-17:30 (8 slots) = 15 slots per day
        const totalSlots = 15 * 7; // 105 slots in 7 days
        const bookedCount = bookedResult.count || 0;
        const availableCount = Math.max(0, totalSlots - bookedCount);

        return { available: availableCount, booked: bookedCount };
    } catch (error) {
        console.error('Error getting slot stats:', error);
        return { available: 0, booked: 0 };
    }
}

// ============= REACTIVE AVAILABILITY (FR2) =============

export interface SlotAvailability {
    time: string;
    status: 'READY' | 'BOOKED';
    datetime?: string; // Full datetime for booking
}

// Get reactive availability for a doctor on a specific date
// Derives status from actual appointments table, not static JSON
export function getDoctorAvailabilityForDate(doctorId: string, date: string): SlotAvailability[] {
    try {
        const doctor = findDoctorById(doctorId);
        if (!doctor) return [];

        // Get the doctor's available time slots from their config
        let timeSlots: string[] = [];
        try {
            timeSlots = JSON.parse(doctor.availability_json);
        } catch {
            // Default slots if JSON is invalid
            timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
        }

        // Get all booked slots for this doctor on this date
        const bookedSlots = getBookedSlotsForDoctor(doctorId, date);
        const bookedTimes = new Set(bookedSlots.map(s => {
            // Extract time portion from datetime
            const parts = s.split(' ');
            return parts.length > 1 ? parts[1] : s;
        }));

        // Build reactive availability
        return timeSlots.map(time => ({
            time,
            status: bookedTimes.has(time) ? 'BOOKED' as const : 'READY' as const,
            datetime: `${date} ${time}`
        }));
    } catch (error) {
        console.error('Error getting doctor availability:', error);
        return [];
    }
}

// Get the next available slot for a doctor (from today onwards)
export function getNextAvailableSlot(doctorId: string): { date: string; time: string; datetime: string } | null {
    try {
        const doctor = findDoctorById(doctorId);
        if (!doctor) return null;

        // Get time slots
        let timeSlots: string[] = [];
        try {
            timeSlots = JSON.parse(doctor.availability_json);
        } catch {
            timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];
        }

        // Check next 14 days
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() + i);
            
            // Skip weekends
            const dayOfWeek = checkDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            const dateStr = checkDate.toISOString().split('T')[0];
            const availability = getDoctorAvailabilityForDate(doctorId, dateStr);
            
            // Find first READY slot
            for (const slot of availability) {
                if (slot.status === 'READY') {
                    // If today, check if time hasn't passed
                    if (i === 0) {
                        const now = new Date();
                        const [hours, mins] = slot.time.split(':').map(Number);
                        const slotTime = new Date(today);
                        slotTime.setHours(hours, mins, 0, 0);
                        if (slotTime <= now) continue;
                    }
                    return {
                        date: dateStr,
                        time: slot.time,
                        datetime: `${dateStr} ${slot.time}`
                    };
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error finding next available slot:', error);
        return null;
    }
}

// ============= AUDIT LOGGING ENHANCEMENTS (NFR1/GDPR) =============

// Log individual medical record view (T14 compliance)
export function logRecordView(nhsNumber: string, recordId: number): void {
    createAuditLog(
        nhsNumber,
        'VIEW_RECORD_DETAIL',
        `Patient viewed medical record #${recordId}`
    );
}

// ============= GDPR COMPLIANCE (NFR1 - Data Subject Access & Right to Be Forgotten) =============

/**
 * Create a data export request (GDPR Subject Access Request)
 */
export function createDataExportRequest(
    nhsNumber: string,
    format: string,
    includeAuditLogs: boolean
): { success: boolean; requestId?: number; error?: string } {
    try {
        const stmt = db.prepare(`
            INSERT INTO data_export_requests (nhs_number, format, include_audit_logs, status)
            VALUES (?, ?, ?, 'PENDING')
        `);
        const result = stmt.run(nhsNumber, format, includeAuditLogs ? 1 : 0);

        createAuditLog(
            nhsNumber,
            'DATA_EXPORT_REQUEST',
            `Patient requested data export in ${format} format (audit logs: ${includeAuditLogs})`
        );

        return { success: true, requestId: Number(result.lastInsertRowid) };
    } catch (error) {
        console.error('Error creating data export request:', error);
        return { success: false, error: 'Failed to create export request' };
    }
}

/**
 * Delete a patient account and all associated data (GDPR Article 17)
 */
export function deletePatientAccount(nhsNumber: string): { success: boolean; error?: string } {
    try {
        // Start transaction for data integrity
        const transaction = db.transaction(() => {
            // Delete appointments
            const deleteAppts = db.prepare('DELETE FROM appointments WHERE nhs_number = ?');
            deleteAppts.run(nhsNumber);

            // Delete medical records
            const deleteRecords = db.prepare('DELETE FROM medical_records WHERE nhs_number = ?');
            deleteRecords.run(nhsNumber);

            // Delete audit logs
            const deleteAudit = db.prepare('DELETE FROM audit_logs WHERE nhs_number = ?');
            deleteAudit.run(nhsNumber);

            // Delete data export requests
            const deleteExports = db.prepare('DELETE FROM data_export_requests WHERE nhs_number = ?');
            deleteExports.run(nhsNumber);

            // Delete deletion requests
            const deleteDeletion = db.prepare('DELETE FROM deletion_requests WHERE nhs_number = ?');
            deleteDeletion.run(nhsNumber);

            // Delete patient account
            const deletePatient = db.prepare('DELETE FROM patients WHERE nhs_number = ?');
            const result = deletePatient.run(nhsNumber);

            if (result.changes === 0) {
                throw new Error('Patient not found');
            }
        });

        // Execute transaction
        transaction();

        return { success: true };
    } catch (error) {
        console.error('Error deleting patient account:', error);
        return { success: false, error: 'Failed to delete patient account' };
    }
}

/**
 * Create a deletion request (GDPR Right to Be Forgotten - Article 17)
 */
export function createDeletionRequest(
    nhsNumber: string,
    reason?: string
): { success: boolean; requestId?: number; error?: string } {
    try {
        const stmt = db.prepare(`
            INSERT INTO deletion_requests (nhs_number, reason, status)
            VALUES (?, ?, 'COMPLETED')
        `);
        const result = stmt.run(nhsNumber, reason || null);

        // Immediately delete the account (no waiting period for demo)
        const deleteResult = deletePatientAccount(nhsNumber);

        if (!deleteResult.success) {
            return { success: false, error: deleteResult.error };
        }

        createAuditLog(
            nhsNumber,
            'DELETION_REQUEST',
            `Account deletion request processed. Reason: ${reason || 'Not provided'}. Account has been permanently deleted.`
        );

        return { success: true, requestId: Number(result.lastInsertRowid) };
    } catch (error) {
        console.error('Error creating deletion request:', error);
        return { success: false, error: 'Failed to process deletion request' };
    }
}

/**
 * Get data export requests for a patient
 */
export function getDataExportRequests(nhsNumber: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM data_export_requests
            WHERE nhs_number = ?
            ORDER BY created_at DESC
        `);
        return stmt.all(nhsNumber) as any[];
    } catch (error) {
        console.error('Error fetching export requests:', error);
        return [];
    }
}

/**
 * Get deletion requests for a patient
 */
export function getDeletionRequests(nhsNumber: string) {
    try {
        const stmt = db.prepare(`
            SELECT * FROM deletion_requests
            WHERE nhs_number = ?
            ORDER BY created_at DESC
        `);
        return stmt.all(nhsNumber) as any[];
    } catch (error) {
        console.error('Error fetching deletion requests:', error);
        return [];
    }
}

// ============= PATIENT REGISTRATION (Story 07) =============

/**
 * Generate unique NHS number
 * AC 7.1: System must generate a unique nhs_number PK upon successful registration
 */
export function generateUniqueNHSNumber(): string {
    let nhsNumber = '';
    let isUnique = false;

    while (!isUnique) {
        // Generate random 10-digit number
        nhsNumber = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');

        // Check if it already exists
        const stmt = db.prepare('SELECT COUNT(*) as count FROM patients WHERE nhs_number = ?');
        const result = stmt.get(nhsNumber) as { count: number };

        if (result.count === 0) {
            isUnique = true;
        }
    }

    return nhsNumber;
}

/**
 * Register new patient (Story 07)
 * AC 7.2: Verification must fail if the DOB field is empty or in the future
 */
export function registerPatient(
    fullName: string,
    dob: string,
    address: string,
    passwordHash: string
): { success: boolean; nhs_number?: string; error?: string } {
    try {
        // Validate inputs
        if (!fullName || !dob || !address) {
            return { success: false, error: 'All fields are required' };
        }

        // Validate DOB is not in the future
        const dobDate = new Date(dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dobDate > today) {
            return { success: false, error: 'Date of birth cannot be in the future' };
        }

        // Validate minimum age (e.g., must be at least 0 days old, realistically older)
        const ageMs = today.getTime() - dobDate.getTime();
        const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);

        if (ageYears < 0) {
            return { success: false, error: 'Invalid date of birth' };
        }

        // Generate unique NHS number
        const nhsNumber = generateUniqueNHSNumber();

        // Insert new patient
        const insertStmt = db.prepare(`
            INSERT INTO patients (nhs_number, full_name, dob, address, password_hash, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        insertStmt.run(
            nhsNumber,
            fullName,
            dob,
            address,
            passwordHash,
            new Date().toISOString()
        );

        // Audit log for new patient registration
        createAuditLog(
            nhsNumber,
            'PATIENT_REGISTRATION',
            `New patient registered: ${fullName} (DOB: ${dob})`
        );

        return { success: true, nhs_number: nhsNumber };
    } catch (error) {
        console.error('Error registering patient:', error);
        return { success: false, error: 'Failed to register patient' };
    }
}
