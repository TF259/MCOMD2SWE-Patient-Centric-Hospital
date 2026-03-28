import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(Number(params.id));

  if (!doctor) {
    error(404, 'Doctor not found');
  }

  const availability = db.prepare('SELECT * FROM availability WHERE doctor_id = ?').all(Number(params.id));

  return { doctor, availability };
};
