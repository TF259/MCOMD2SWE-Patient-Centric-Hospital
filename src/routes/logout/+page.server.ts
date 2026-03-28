import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/session';

export const actions: Actions = {
  default: async ({ cookies }) => {
    const token = cookies.get('session');
    if (token) {
      deleteSession(token);
      cookies.delete('session', { path: '/' });
    }
    redirect(303, '/');
  }
};
