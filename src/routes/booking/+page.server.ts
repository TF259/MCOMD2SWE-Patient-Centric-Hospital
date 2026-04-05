// src/routes/booking/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { 
    getAllDoctors, 
    getAllSpecialties,
    getDoctorsBySpecialty,
    getDoctorAvailabilityForDate,
    getNextAvailableSlot,
    findDoctorById,
    createAppointment, 
    createAuditLog 
} from '$lib/server/db-helpers';
import { validateAppointmentDate } from '$lib/server/validation';
import '$lib/server/db-seed'; // Ensure database is initialized

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = locals.session;
    
    // Redirect to login if no session or not a patient
    if (!session || session.type !== 'patient' || !session.nhs_number) {
        throw redirect(303, '/');
    }

    // Get URL parameters for auto-selection
    const selectedDoctorId = url.searchParams.get('doctor') || '';
    const selectedSpecialty = url.searchParams.get('specialty') || '';
    
    // Get doctor details and next available slot if pre-selected
    let selectedDoctor = null;
    let nextAvailable = null;
    let selectedDate = url.searchParams.get('date') || '';
    let availability: { time: string; status: 'READY' | 'BOOKED'; datetime?: string }[] = [];
    
    if (selectedDoctorId) {
        selectedDoctor = findDoctorById(selectedDoctorId);
        nextAvailable = getNextAvailableSlot(selectedDoctorId);
        
        // If no date specified, use the next available date
        if (!selectedDate && nextAvailable) {
            selectedDate = nextAvailable.date;
        }
        
        // Get reactive availability for selected date
        if (selectedDate) {
            availability = getDoctorAvailabilityForDate(selectedDoctorId, selectedDate);
        }
    }

    // Filter doctors by specialty if selected
    const doctors = selectedSpecialty 
        ? getDoctorsBySpecialty(selectedSpecialty)
        : getAllDoctors();

    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        doctors,
        specialties: getAllSpecialties(),
        selectedDoctorId,
        selectedDoctor,
        selectedDate,
        selectedSpecialty,
        availability,
        nextAvailable
    };
};

export const actions = {
    createAppointment: async ({ request, locals }) => {
        const session = locals.session;
        
        if (!session || session.type !== 'patient' || !session.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const doctor_id = data.get('doctor_id') as string;
        const slot_datetime = data.get('slot_datetime') as string;

        // Validate required fields
        if (!doctor_id || !slot_datetime) {
            return fail(400, { 
                error: 'Please select a doctor and time slot'
            });
        }

        // Validation (UT03): Ensure the slot is a future date
        const dateValidation = validateAppointmentDate(slot_datetime);
        if (!dateValidation.valid) {
            return fail(400, { 
                error: dateValidation.error
            });
        }

        // UT04: Double-booking prevention via database
        const result = createAppointment(session.nhs_number, doctor_id, slot_datetime);

        if (!result.success) {
            return fail(400, { 
                error: result.error || 'This slot is no longer available'
            });
        }

        // T14: Audit log for booking
        createAuditLog(
            session.nhs_number,
            'CREATE_APPOINTMENT',
            `Patient booked appointment #${result.appointmentId} with ${doctor_id} at ${slot_datetime}`
        );

        // Redirect to dashboard with success message
        throw redirect(303, '/dashboard?success=true');
    }
} satisfies Actions;