import bcrypt from 'bcryptjs';
import { findPatientByNHS } from './db-helpers';
import './db-seed'; // Ensure database is seeded

export async function validatePatient(nhsNumber: string, passwordAttempt: string) {
    const patient = findPatientByNHS(nhsNumber);
    if (!patient) return null;
    const isValid = await bcrypt.compare(passwordAttempt, patient.password_hash);
    return isValid ? patient : null;
}