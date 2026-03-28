import type { Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const actions: Actions = {
  default: async ({ params, locals }) => {
    if (!locals.patient) {
      redirect(303, '/login');
    }

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(Number(params.id)) as any;

    if (!appointment) {
      error(404, 'Appointment not found');
    }

    if (appointment.patient_id !== locals.patient.id) {
      error(403, 'You cannot cancel this appointment');
    }

    db.prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?").run(Number(params.id));

    redirect(303, '/appointments');
  }
};
