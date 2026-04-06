// src/routes/doctor/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { 
    findDoctorById,
    getDoctorTodayAppointments,
    getDoctorUpcomingAppointments,
    getDoctorAppointmentHistory,
    completeAppointment as dbCompleteAppointment,
    cancelAppointment as dbCancelAppointment,
    createAuditLog
} from '$lib/server/db-helpers';
import { destroySession } from '../../hooks.server';
import { redirect, fail } from '@sveltejs/kit';
import '$lib/server/db-seed';

export const load: PageServerLoad = async ({ locals }) => {
    const startTime = performance.now();
    
    // Simulate realistic load time for NFR2 demonstration
    await new Promise(resolve => setTimeout(resolve, 300));

    const session = locals.session;
    
    // Check if user is logged in as a doctor
    if (!session || session.type !== 'doctor') {
        return {
            authenticated: false,
            doctor: null,
            todayAppointments: [],
            upcomingAppointments: [],
            appointmentHistory: [],
            loadTime: 0
        };
    }

    const doctorId = session.doctor_id;
    const doctor = findDoctorById(doctorId);
    
    if (!doctor) {
        return {
            authenticated: false,
            doctor: null,
            todayAppointments: [],
            upcomingAppointments: [],
            appointmentHistory: [],
            loadTime: 0
        };
    }

    // Fetch appointments
    const todayAppointments = getDoctorTodayAppointments(doctorId);
    const upcomingAppointments = getDoctorUpcomingAppointments(doctorId);
    const appointmentHistory = getDoctorAppointmentHistory(doctorId);

    const loadTime = Math.round(performance.now() - startTime);

    return {
        authenticated: true,
        doctor: {
            doctor_id: doctor.doctor_id,
            name: doctor.name,
            specialty: doctor.specialty
        },
        todayAppointments,
        upcomingAppointments,
        appointmentHistory,
        loadTime
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

    completeAppointment: async ({ request, locals }) => {
        const session = locals.session;

        if (!session || session.type !== 'doctor') {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const appId = parseInt(data.get('app_id') as string);
        const notes = data.get('notes') as string | null;

        const result = dbCompleteAppointment(appId, notes || undefined);

        if (!result.success) {
            return fail(400, { error: result.error });
        }

        // Audit log for completion
        createAuditLog(
            session.nhs_number || session.doctor_id,
            'COMPLETE_APPOINTMENT',
            `Doctor ${session.name} marked appointment #${appId} as completed${notes ? `. Notes: ${notes}` : ''}`
        );

        throw redirect(303, '/doctor?completed=true');
    },

    cancelAppointment: async ({ request, locals }) => {
        const session = locals.session;

        if (!session || session.type !== 'doctor') {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const appId = parseInt(data.get('app_id') as string);
        const notes = data.get('notes') as string | null;

        const result = dbCancelAppointment(appId, notes || undefined);

        if (!result.success) {
            return fail(400, { error: result.error });
        }

        // Audit log for cancellation
        createAuditLog(
            session.nhs_number || session.doctor_id,
            'CANCEL_APPOINTMENT',
            `Doctor ${session.name} cancelled appointment #${appId}${notes ? `. Reason: ${notes}` : ''}`
        );

        throw redirect(303, '/doctor?cancelled=true');
    }
} satisfies Actions;