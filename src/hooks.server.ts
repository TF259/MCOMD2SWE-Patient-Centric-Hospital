import type { Handle } from '@sveltejs/kit';
import { getSession, getPatient } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');
  const session = getSession(token);

  if (session) {
    event.locals.patient = getPatient(session.patientId) as App.Patient;
    event.locals.sessionToken = token as string;
  } else {
    event.locals.patient = null;
    event.locals.sessionToken = null;
  }

  return resolve(event);
};
