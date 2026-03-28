import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  const doctors = db.prepare('SELECT * FROM doctors').all();
  return {
    patient: locals.patient,
    doctors
  };
};
