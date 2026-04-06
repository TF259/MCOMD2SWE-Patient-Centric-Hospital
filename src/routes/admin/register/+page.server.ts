// src/routes/admin/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registerPatient, createAuditLog } from '$lib/server/db-helpers';
import { validatePassword } from '$lib/server/validation';
import bcrypt from 'bcryptjs';
import '$lib/server/db-seed'; // Ensure database is initialized

export const actions = {
    register: async ({ request }) => {
        const data = await request.formData();
        const fullName = data.get('full_name') as string;
        const dob = data.get('dob') as string;
        const address = data.get('address') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirm_password') as string;

        // Validate all fields are provided
        if (!fullName || !dob || !address || !password || !confirmPassword) {
            return fail(400, {
                error: 'All fields are required',
                fullName
            });
        }

        // Validate date of birth format (must be a valid date)
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            return fail(400, {
                error: 'Invalid date of birth format',
                fullName
            });
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            return fail(400, {
                error: 'Passwords do not match',
                fullName
            });
        }

        // Validate password strength (NFR1: Security)
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return fail(400, {
                error: passwordValidation.error,
                fullName
            });
        }

        // Hash password (NFR1: Security)
        const passwordHash = bcrypt.hashSync(password, 10);

        // Register patient (Story 07)
        const result = registerPatient(fullName, dob, address, passwordHash);

        if (!result.success) {
            return fail(400, {
                error: result.error,
                fullName
            });
        }

        // Create audit log for successful registration
        createAuditLog(
            result.nhs_number!,
            'ADMIN_REGISTRATION',
            `Patient registered by admin: ${fullName}`
        );

        // Redirect to success page with NHS number
        throw redirect(303, `/admin/register/success?nhs_number=${result.nhs_number}`);
    }
} satisfies Actions;
