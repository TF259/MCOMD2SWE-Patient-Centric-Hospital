import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.patient) {
    redirect(303, '/login');
  }
  return { patient: locals.patient };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.patient) {
      redirect(303, '/login');
    }

    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const dob = data.get('dob') as string;
    const phone = data.get('phone') as string;
    const address = data.get('address') as string;

    if (!name || !email) {
      return fail(400, { error: 'Name and email are required', name, email, dob, phone, address });
    }

    const existing = db.prepare('SELECT id FROM patients WHERE email = ? AND id != ?').get(email, locals.patient.id);
    if (existing) {
      return fail(409, { error: 'This email is already in use', name, email, dob, phone, address });
    }

    db.prepare(`
      UPDATE patients SET name = ?, email = ?, dob = ?, phone = ?, address = ? WHERE id = ?
    `).run(name, email, dob || null, phone || null, address || null, locals.patient.id);

    return { success: true, name, email, dob, phone, address };
  }
};
