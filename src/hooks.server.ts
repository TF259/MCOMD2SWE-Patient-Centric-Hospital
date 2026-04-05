// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { patients } from '$lib/server/mockData';

// Session types for different user roles
interface PatientSession {
    type: 'patient';
    nhs_number: string;
    full_name: string;
}

interface DoctorSession {
    type: 'doctor';
    doctor_id: string;
    name: string;
    specialty: string;
}

type Session = PatientSession | DoctorSession;

// Simple in-memory session store (in production, use a database or Redis)
const sessions = new Map<string, Session>();

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

// Helper function to create a patient session (called from login action)
export function createSession(nhs_number: string, full_name: string): string {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { type: 'patient', nhs_number, full_name });
    return sessionId;
}

// Helper function to create a doctor session
export function createDoctorSession(doctor_id: string, name: string, specialty: string): string {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { type: 'doctor', doctor_id, name, specialty });
    return sessionId;
}

// Helper function to destroy a session
export function destroySession(sessionId: string) {
    sessions.delete(sessionId);
}
