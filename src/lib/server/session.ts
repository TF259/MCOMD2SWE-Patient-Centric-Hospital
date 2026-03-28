import { db } from './db';
import crypto from 'crypto';

const sessions = new Map<string, { patientId: number; expires: Date }>();

export function createSession(patientId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  sessions.set(token, { patientId, expires });
  return token;
}

export function getSession(token: string | undefined): { patientId: number } | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expires < new Date()) {
    sessions.delete(token);
    return null;
  }
  return { patientId: session.patientId };
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function getPatient(patientId: number) {
  return db.prepare('SELECT id, name, email, dob, phone, address, created_at FROM patients WHERE id = ?').get(patientId);
}
