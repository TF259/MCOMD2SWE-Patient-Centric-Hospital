// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { patients } from '$lib/server/mockData';

// Simple in-memory session store (in production, use a database or Redis)
const sessions = new Map<string, { nhs_number: string; full_name: string }>();

export const handle: Handle = async ({ event, resolve }) => {
    // Get session ID from cookie
    const sessionId = event.cookies.get('session_id');
    
    if (sessionId) {
        // Restore session from store
        const session = sessions.get(sessionId);
        if (session) {
            event.locals.session = session;
        }
    }
    
    return await resolve(event);
};

// Helper function to create a session (called from login action)
export function createSession(nhs_number: string, full_name: string): string {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { nhs_number, full_name });
    return sessionId;
}

// Helper function to destroy a session
export function destroySession(sessionId: string) {
    sessions.delete(sessionId);
}
