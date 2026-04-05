// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { findPatientByNHS, findDoctorById, createAuditLog } from '$lib/server/db-helpers';
import { validateNHSNumber } from '$lib/server/validation';
import bcrypt from 'bcryptjs'; // CRITICAL: Required for NFR1
import type { Actions } from './$types';
import { createSession, createDoctorSession } from '../hooks.server';
import '$lib/server/db-seed'; // Ensure database is initialized

export const actions = {
    // Patient login action
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const nhs_number = data.get('nhs_number') as string;
        const password = data.get('password') as string;

        // Input validation (NFR1: Security)
        const nhsValidation = validateNHSNumber(nhs_number);
        if (!nhsValidation.valid) {
            return fail(400, { 
                error: nhsValidation.error, 
                nhs_number,
                loginType: 'patient'
            });
        }

        const user = findPatientByNHS(nhs_number);

        // Technical Logic: Use bcrypt.compare for secure auth (NFR1)
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            // T14: Log the security event (Failed Login) for clinical audit trail (NFR1)
            createAuditLog(
                nhs_number || 'UNKNOWN',
                'FAILED_LOGIN_ATTEMPT',
                `Failed login attempt for NHS Number: ${nhs_number}`
            );

            return fail(400, { 
                error: 'Invalid NHS Number or Password', 
                nhs_number,
                loginType: 'patient'
            });
        }

        // T14: Log successful login for GDPR compliance (NFR1)
        createAuditLog(
            user.nhs_number,
            'SUCCESSFUL_LOGIN',
            `Patient ${user.full_name} logged in successfully`
        );

        const sessionId = createSession(user.nhs_number, user.full_name);
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // Set to true in production
            maxAge: 60 * 60 * 24 * 7 
        });

        throw redirect(303, '/dashboard');
    },

    // Doctor login action (Story 05: As a Doctor, I want to view my daily bookings)
    doctorLogin: async ({ request, cookies }) => {
        const data = await request.formData();
        const doctor_id = data.get('doctor_id') as string;
        const password = data.get('password') as string;

        if (!doctor_id || doctor_id.trim() === '') {
            return fail(400, { 
                error: 'Doctor ID is required',
                loginType: 'doctor'
            });
        }

        if (!password || password.trim() === '') {
            return fail(400, { 
                error: 'Password is required',
                loginType: 'doctor'
            });
        }

        const doctor = findDoctorById(doctor_id.trim());

        // NFR1: Secure authentication - verify password with bcrypt
        if (!doctor || !doctor.password_hash || !(await bcrypt.compare(password, doctor.password_hash))) {
            createAuditLog(
                doctor_id || 'UNKNOWN',
                'FAILED_DOCTOR_LOGIN',
                `Failed doctor login attempt for ID: ${doctor_id}`
            );

            return fail(400, { 
                error: 'Invalid Doctor ID or Password',
                loginType: 'doctor'
            });
        }

        // Create doctor session
        const sessionId = createDoctorSession(doctor.doctor_id, doctor.name, doctor.specialty);
        
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 60 * 60 * 24
        });

        // Audit log for doctor login
        createAuditLog(
            doctor.doctor_id,
            'DOCTOR_LOGIN',
            `Doctor ${doctor.name} logged in successfully`
        );

        throw redirect(303, '/doctor');
    }
} satisfies Actions;