import bcrypt from 'bcryptjs';
import { patients } from './mockData';

export async function validatePatient(nhsNumber: string, passwordAttempt: string) {
    const patient = patients.find(p => p.nhs_number === nhsNumber);
    if (!patient) return null;
    const isValid = await bcrypt.compare(passwordAttempt, patient.password_hash);
    return isValid ? patient : null;
}