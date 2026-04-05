// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { findPatientByNHS, createAuditLog } from '$lib/server/db-helpers';
import { validateNHSNumber } from '$lib/server/validation';
import bcrypt from 'bcryptjs'; // CRITICAL: Required for NFR1
import type { Actions } from './$types';
import { createSession } from '../hooks.server';
import '$lib/server/db-seed'; // Ensure database is initialized

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const nhs_number = data.get('nhs_number') as string;
        const password = data.get('password') as string;

        // Input validation (NFR1: Security)
        const nhsValidation = validateNHSNumber(nhs_number);
        if (!nhsValidation.valid) {
            return fail(400, { 
                error: nhsValidation.error, 
                nhs_number 
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
                nhs_number 
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
    }
} satisfies Actions;