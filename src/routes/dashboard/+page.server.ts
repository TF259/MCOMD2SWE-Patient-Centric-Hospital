// src/routes/dashboard/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { doctors, medicalRecords, appointments, auditLogs } from '$lib/server/mockData';
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

    // T14: Audit logging for GDPR/NFR1 compliance
    // Log every access to medical records
    const newLogId = auditLogs.length > 0 
        ? Math.max(...auditLogs.map(l => l.log_id)) + 1 
        : 1;
    
    auditLogs.push({
        log_id: newLogId,
        nhs_number: session.nhs_number,
        action: 'VIEW_RECORDS',
        timestamp: new Date().toISOString(),
        details: `Dashboard accessed - ${medicalRecords.filter(r => r.nhs_number === session.nhs_number).length} records viewed`
    });

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
    },
    
    // T16: Admin functionality - Cancel appointment (Story 10)
    cancelAppointment: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session?.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const app_id = parseInt(data.get('app_id') as string);

        // Find appointment
        const appointment = appointments.find(apt => apt.app_id === app_id);
        
        if (!appointment) {
            return { error: 'Appointment not found' };
        }

        // Security: Verify patient owns this appointment
        if (appointment.nhs_number !== session.nhs_number) {
            return { error: 'Unauthorized to cancel this appointment' };
        }

        // Update status to Cancelled
        appointment.status = 'Cancelled';

        // T14: Audit log for cancellation
        const newLogId = auditLogs.length > 0 
            ? Math.max(...auditLogs.map(l => l.log_id)) + 1 
            : 1;
        
        auditLogs.push({
            log_id: newLogId,
            nhs_number: session.nhs_number,
            action: 'CANCEL_APPOINTMENT',
            timestamp: new Date().toISOString(),
            details: `Patient cancelled appointment #${app_id}`
        });

        throw redirect(303, '/dashboard?cancelled=true');
    }
} satisfies Actions;
