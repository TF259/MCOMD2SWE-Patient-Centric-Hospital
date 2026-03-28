import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.patient) {
    redirect(303, '/login');
  }

  const appointments = db.prepare(`
    SELECT a.*, d.name as doctor_name, d.specialty, d.avatar as doctor_avatar
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    WHERE a.patient_id = ?
    ORDER BY a.date DESC, a.time DESC
  `).all(locals.patient.id);

  return {
    patient: locals.patient,
    appointments
  };
};
