import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import { createSession } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.patient) {
    redirect(303, '/dashboard');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required', email });
    }

    const patient = db.prepare('SELECT * FROM patients WHERE email = ?').get(email) as any;

    if (!patient || !bcrypt.compareSync(password, patient.password)) {
      return fail(401, { error: 'Invalid email or password', email });
    }

    const token = createSession(patient.id);
    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });

    redirect(303, '/dashboard');
  }
};
