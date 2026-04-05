// src/routes/dashboard/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { 
    getAllDoctors, 
    getMedicalRecordsByNHS, 
    getAppointmentsByNHS,
    cancelAppointment as dbCancelAppointment,
    createAuditLog
} from '$lib/server/db-helpers';
import { destroySession } from '../../hooks.server';
import { redirect } from '@sveltejs/kit';
import '$lib/server/db-seed'; // Ensure database is initialized

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

    // T14: Audit logging for GDPR/NFR1 compliance
    // Log every access to medical records
    const patientRecords = getMedicalRecordsByNHS(session.nhs_number);
    
    createAuditLog(
        session.nhs_number,
        'VIEW_RECORDS',
        `Dashboard accessed - ${patientRecords.length} records viewed`
    );

    // Get patient's appointments
    const patientAppointments = getAppointmentsByNHS(session.nhs_number);

    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        doctors: getAllDoctors(),
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
    },
    
    // T16: Admin functionality - Cancel appointment (Story 10)
    cancelAppointment: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session?.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const app_id = parseInt(data.get('app_id') as string);

        // Cancel appointment using database helper
        const result = dbCancelAppointment(app_id);
        
        if (!result.success) {
            return { error: result.error };
        }

        // T14: Audit log for cancellation
        createAuditLog(
            session.nhs_number,
            'CANCEL_APPOINTMENT',
            `Patient cancelled appointment #${app_id}`
        );

        throw redirect(303, '/dashboard?cancelled=true');
    }
} satisfies Actions;
