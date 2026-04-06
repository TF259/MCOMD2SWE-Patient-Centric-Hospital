import type { PageServerLoad, Actions } from './$types';
import { getPatientDetails } from '$lib/server/db-helpers';
import { redirect } from '@sveltejs/kit';
import { destroySession } from '../../hooks.server';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session;

    if (!session || session.type !== 'patient' || !session.nhs_number) {
        throw redirect(303, '/');
    }

    const patient = getPatientDetails(session.nhs_number);

    return {
        patient,
        nhs_number: session.nhs_number
    };
};

export const actions = {
    logout: async ({ cookies }) => {
        const sessionId = cookies.get('session_id');

        if (sessionId) {
            destroySession(sessionId);
            cookies.delete('session_id', { path: '/' });
        }

        throw redirect(303, '/');
    }
} satisfies Actions;
