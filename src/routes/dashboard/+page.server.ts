// src/routes/dashboard/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { doctors, medicalRecords, appointments } from '$lib/server/mockData';
import { destroySession } from '../../hooks.server';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    // Simulate load time for NFR2 demonstration (500ms for better UX during development)
    // In production, remove this delay - real data fetching will be measured
    await new Promise(resolve => setTimeout(resolve, 500));

    const session = locals.session;
    
    if (!session?.nhs_number) {
        return {
            patient_name: 'Guest',
            nhs_number: null,
            doctors: [],
            medicalRecords: [],
            appointments: []
        };
    }

    // Get patient's medical records
    const patientRecords = medicalRecords.filter(
        record => record.nhs_number === session.nhs_number
    );

    // Get patient's appointments
    const patientAppointments = appointments.filter(
        apt => apt.nhs_number === session.nhs_number
    );

    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        doctors,
        medicalRecords: patientRecords,
        appointments: patientAppointments
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
