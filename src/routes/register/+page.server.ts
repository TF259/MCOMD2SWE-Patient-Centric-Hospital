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
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    const dob = data.get('dob') as string;
    const phone = data.get('phone') as string;

    if (!name || !email || !password) {
      return fail(400, { error: 'Name, email, and password are required', name, email, dob, phone });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match', name, email, dob, phone });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters', name, email, dob, phone });
    }

    const existing = db.prepare('SELECT id FROM patients WHERE email = ?').get(email);
    if (existing) {
      return fail(409, { error: 'An account with this email already exists', name, email, dob, phone });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
      INSERT INTO patients (name, email, password, dob, phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, hashedPassword, dob || null, phone || null);

    const token = createSession(result.lastInsertRowid as number);
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
