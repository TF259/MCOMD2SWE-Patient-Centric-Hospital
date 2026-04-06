// src/routes/dashboard/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import {
    getAllDoctors,
    getMedicalRecordsByNHS,
    searchMedicalRecords,
    getAppointmentsByNHS,
    cancelAppointment as dbCancelAppointment,
    createAuditLog,
    logRecordView,
    getPatientDetails
} from '$lib/server/db-helpers';
import { destroySession } from '../../hooks.server';
import { redirect } from '@sveltejs/kit';
import '$lib/server/db-seed'; // Ensure database is initialized

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = locals.session;

    // Check if user is a patient (not a doctor)
    if (!session || session.type !== 'patient' || !session.nhs_number) {
        return {
            patient_name: 'Guest',
            patient: null,
            nhs_number: null,
            doctors: [],
            medicalRecords: [],
            appointments: [],
            recordCount: 0
        };
    }

    // Fetch patient profile details (NEW - Patient Info Display)
    const patientDetails = getPatientDetails(session.nhs_number);

    // T14: Audit logging for GDPR/NFR1 compliance
    const patientRecords = getMedicalRecordsByNHS(session.nhs_number);

    createAuditLog(
        session.nhs_number,
        'VIEW_DASHBOARD',
        `Dashboard accessed - ${patientRecords.length} records available`
    );

    // Get search/filter parameters (NEW - Medical Records Search)
    const searchTerm = url.searchParams.get('search') || '';
    const doctorFilter = url.searchParams.get('doctor') || '';
    const dateFrom = url.searchParams.get('date_from') || '';
    const dateTo = url.searchParams.get('date_to') || '';

    // Search medical records with filters
    let medicalRecords = patientRecords;
    if (searchTerm || doctorFilter || dateFrom || dateTo) {
        medicalRecords = searchMedicalRecords(
            session.nhs_number,
            searchTerm,
            doctorFilter,
            dateFrom,
            dateTo
        );
    }

    // Get patient's appointments
    const patientAppointments = getAppointmentsByNHS(session.nhs_number);

    return {
        patient_name: session.full_name,
        patient: patientDetails,
        nhs_number: session.nhs_number,
        doctors: getAllDoctors(),
        medicalRecords,
        appointments: patientAppointments,
        recordCount: medicalRecords.length,
        searchTerm,
        doctorFilter
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
    
    // T16: Cancel appointment (Story 10)
    cancelAppointment: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session || session.type !== 'patient' || !session.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const app_id = parseInt(data.get('app_id') as string);

        const result = dbCancelAppointment(app_id);
        
        if (!result.success) {
            return { error: result.error };
        }

        createAuditLog(
            session.nhs_number,
            'CANCEL_APPOINTMENT',
            `Patient cancelled appointment #${app_id}`
        );

        throw redirect(303, '/dashboard?cancelled=true');
    },

    // T14: Log individual record view for GDPR compliance
    viewRecord: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session || session.type !== 'patient' || !session.nhs_number) {
            return { error: 'Unauthorized' };
        }

        const data = await request.formData();
        const record_id = parseInt(data.get('record_id') as string);

        // Log the specific record access
        logRecordView(session.nhs_number, record_id);

        return { success: true };
    }
} satisfies Actions;
