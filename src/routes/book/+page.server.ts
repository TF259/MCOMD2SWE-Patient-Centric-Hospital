import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  const doctors = db.prepare('SELECT * FROM doctors ORDER BY name').all();
  const availability = db.prepare('SELECT * FROM availability').all();

  return {
    patient: locals.patient,
    doctors,
    availability
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.patient) {
      return fail(401, { error: 'You must be logged in to book an appointment' });
    }

    const data = await request.formData();
    const doctorId = data.get('doctorId') as string;
    const date = data.get('date') as string;
    const time = data.get('time') as string;
    const reason = data.get('reason') as string;

    if (!doctorId || !date || !time) {
      return fail(400, { error: 'Please fill in all required fields', reason });
    }

    const appointmentDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return fail(400, { error: 'Appointment date must be today or in the future', reason });
    }

    const conflict = db.prepare(`
      SELECT id FROM appointments
      WHERE doctor_id = ? AND date = ? AND time = ? AND status = 'scheduled'
    `).get(Number(doctorId), date, time);

    if (conflict) {
      return fail(409, { error: 'This time slot is already booked. Please select a different time.', reason });
    }

    db.prepare(`
      INSERT INTO appointments (patient_id, doctor_id, date, time, reason, status)
      VALUES (?, ?, ?, ?, ?, 'scheduled')
    `).run(locals.patient.id, Number(doctorId), date, time, reason || null);

    const doctor = db.prepare('SELECT name FROM doctors WHERE id = ?').get(Number(doctorId)) as any;

    return {
      success: true,
      doctorName: doctor?.name,
      date,
      time,
      reason
    };
  }
};
