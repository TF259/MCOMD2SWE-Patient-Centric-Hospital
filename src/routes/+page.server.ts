import { fail, redirect } from '@sveltejs/kit';
import { patients } from '$lib/server/mockData';
import type { Actions } from './$types';
import { createSession } from '../hooks.server';

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const nhs_number = data.get('nhs_number') as string;
        const password = data.get('password') as string;

        // Traceability: Matches PATIENT.nhs_number (PK) [cite: 163]
        const user = patients.find(p => p.nhs_number === nhs_number);

        if (!user || user.password_hash !== password) {
            return fail(400, { 
                error: 'Invalid NHS Number or Password', 
                nhs_number 
            });
        }

        // Create session and set cookie
        const sessionId = createSession(user.nhs_number, user.full_name);
        cookies.set('session_id', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // Set to true in production with HTTPS
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        // Fulfills FR1: Redirect to dashboard upon success [cite: 140, 222]
        throw redirect(303, '/dashboard');
    }
} satisfies Actions;