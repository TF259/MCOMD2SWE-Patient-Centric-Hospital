import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  const doctors = db.prepare('SELECT * FROM doctors ORDER BY name').all();
  return { doctors };
};
