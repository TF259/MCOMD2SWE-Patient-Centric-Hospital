// src/routes/booking/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { doctors, appointments, medicalRecords } from '$lib/server/mockData';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session;
    
    // Redirect to login if no session (same pattern as dashboard)
    if (!session?.nhs_number) {
        throw redirect(303, '/');
    }

    // Fetch all doctors from mockData
    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        doctors
    };
};

export const actions = {
    createAppointment: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session?.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const doctor_id = data.get('doctor_id') as string;
        const slot_time = data.get('slot_time') as string;
        const reason = data.get('reason') as string;

        // Validation (UT03): Ensure the slot_time is a future date
        const selectedDate = new Date(slot_time);
        const now = new Date();
        
        if (selectedDate <= now) {
            return fail(400, { 
                error: 'Future date required',
                doctor_id,
                slot_time,
                reason
            });
        }

        // Validate required fields
        if (!doctor_id || !slot_time) {
            return fail(400, { 
                error: 'Doctor and slot time are required',
                doctor_id,
                slot_time,
                reason
            });
        }

        // Generate new appointment ID
        const newAppId = appointments.length > 0 
            ? Math.max(...appointments.map(a => a.app_id)) + 1 
            : 1;

        // Logic: Simulate a database write by pushing a new appointment object
        // Maps to the Appointment interface in types.ts
        appointments.push({
            app_id: newAppId,
            nhs_number: session.nhs_number,
            doctor_id,
            slot_time,
            status: 'Active'
        });

        // Elite-level enhancement: Create preliminary medical record with patient's stated reason
        // This aligns with clinical workflow where initial notes are captured at booking
        if (reason && reason.trim()) {
            const newRecordId = medicalRecords.length > 0 
                ? Math.max(...medicalRecords.map(r => r.record_id)) + 1 
                : 1;

            medicalRecords.push({
                record_id: newRecordId,
                nhs_number: session.nhs_number,
                doctor_id,
                notes: `[Preliminary] Patient's stated reason for visit: ${reason}`,
                entry_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD
            });
        }

        // Redirect to /dashboard?success=true on completion
        throw redirect(303, '/dashboard?success=true');
    }
} satisfies Actions;