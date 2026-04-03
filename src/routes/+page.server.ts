// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { patients } from '$lib/server/mockData';
import bcrypt from 'bcryptjs'; // CRITICAL: Required for NFR1
import type { Actions } from './$types';
import { createSession } from '../hooks.server';

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const nhs_number = data.get('nhs_number') as string;
        const password = data.get('password') as string;

        const user = patients.find(p => p.nhs_number === nhs_number);

        // Technical Logic: Use bcrypt.compare for secure auth (NFR1)
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return fail(400, { 
                error: 'Invalid NHS Number or Password', 
                nhs_number 
            });
        }

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