// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import crypto from 'crypto';

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

interface SessionData {
    session: Session;
    createdAt: number;
    lastAccessed: number;
}

// Simple in-memory session store (in production, use a database or Redis)
// WARNING: Sessions are lost on server restart
const sessions = new Map<string, SessionData>();

// Rate limiting for login attempts (in-memory, reset on restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

// Session expiration (24 hours - matches patient cookie maxAge)
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Check if an IP/identifier is rate limited
 */
export function isRateLimited(identifier: string): boolean {
    const attempts = loginAttempts.get(identifier);
    if (!attempts) return false;
    
    const now = Date.now();
    // Reset if window has passed
    if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.delete(identifier);
        return false;
    }
    
    return attempts.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(identifier: string): void {
    const now = Date.now();
    const attempts = loginAttempts.get(identifier);
    
    if (!attempts || now - attempts.lastAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
        loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: now });
    }
}

/**
 * Clear login attempts after successful login
 */
export function clearLoginAttempts(identifier: string): void {
    loginAttempts.delete(identifier);
}

export const handle: Handle = async ({ event, resolve }) => {
    // Get session ID from cookie
    const sessionId = event.cookies.get('session_id');
    
    if (sessionId) {
        // Restore session from store
        const sessionData = sessions.get(sessionId);
        if (sessionData) {
            const now = Date.now();
            // Check if session has expired
            if (now - sessionData.createdAt > SESSION_TTL_MS) {
                sessions.delete(sessionId);
                event.cookies.delete('session_id', { path: '/' });
            } else {
                // Update last accessed time
                sessionData.lastAccessed = now;
                event.locals.session = sessionData.session;
            }
        }
    }
    
    return await resolve(event);
};

// Helper function to create a patient session (called from login action)
export function createSession(nhs_number: string, full_name: string): string {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    sessions.set(sessionId, { 
        session: { type: 'patient', nhs_number, full_name },
        createdAt: now,
        lastAccessed: now
    });
    return sessionId;
}

// Helper function to create a doctor session
export function createDoctorSession(doctor_id: string, name: string, specialty: string): string {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    sessions.set(sessionId, { 
        session: { type: 'doctor', doctor_id, name, specialty },
        createdAt: now,
        lastAccessed: now
    });
    return sessionId;
}

// Helper function to destroy a session
export function destroySession(sessionId: string) {
    sessions.delete(sessionId);
}

// Cleanup expired sessions periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [id, data] of sessions.entries()) {
        if (now - data.createdAt > SESSION_TTL_MS) {
            sessions.delete(id);
        }
    }
    // Also cleanup old login attempts
    for (const [id, data] of loginAttempts.entries()) {
        if (now - data.lastAttempt > RATE_LIMIT_WINDOW_MS) {
            loginAttempts.delete(id);
        }
    }
}, 5 * 60 * 1000);
