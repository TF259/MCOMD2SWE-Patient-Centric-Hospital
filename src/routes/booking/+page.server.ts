// src/routes/booking/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { 
    getAllDoctors, 
    createAppointment, 
    createAuditLog 
} from '$lib/server/db-helpers';
import { validateAppointmentDate } from '$lib/server/validation';
import '$lib/server/db-seed'; // Ensure database is initialized

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session;
    
    // Redirect to login if no session or not a patient
    if (!session || session.type !== 'patient' || !session.nhs_number) {
        throw redirect(303, '/');
    }

    // Fetch all doctors from database
    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        doctors: getAllDoctors()
    };
};

export const actions = {
    default: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session || session.type !== 'patient' || !session.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const doctor_id = data.get('doctor_id') as string;
        const slot_time = data.get('slot_time') as string;

        // Validate required fields
        if (!doctor_id || !slot_time) {
            return fail(400, { 
                error: 'Doctor and slot time are required'
            });
        }

        // Validation (UT03): Ensure the slot_time is a future date
        const dateValidation = validateAppointmentDate(slot_time);
        if (!dateValidation.valid) {
            return fail(400, { 
                error: dateValidation.error
            });
        }

        // UT04: Double-booking prevention via database
        const result = createAppointment(session.nhs_number, doctor_id, slot_time);

        if (!result.success) {
            return fail(400, { 
                error: result.error
            });
        }

        // T14: Audit log for booking
        createAuditLog(
            session.nhs_number,
            'CREATE_APPOINTMENT',
            `Patient booked appointment #${result.appointmentId} with ${doctor_id} at ${slot_time}`
        );

        // Redirect to /dashboard?success=true on completion
        return { success: true };
    }
} satisfies Actions;