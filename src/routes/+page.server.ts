import { fail, redirect } from '@sveltejs/kit';
import { patients } from '$lib/server/mockData';
import type { Actions } from './$types';

export const actions = {
    login: async ({ request }) => {
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

        // Fulfills FR1: Redirect to dashboard upon success [cite: 140, 222]
        throw redirect(303, '/dashboard');
    }
} satisfies Actions;