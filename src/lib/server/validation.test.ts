// src/lib/server/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateNHSNumber, validateAppointmentDate, validatePassword, validateDOB, validateDoctor } from './validation';

describe('Input Validation (NFR1: Security)', () => {
    describe('NHS Number Validation (UT03)', () => {
        it('should accept valid 10-digit NHS number', () => {
            const result = validateNHSNumber('1234567890');
            expect(result.valid).toBe(true);
        });

        it('should reject NHS number with less than 10 digits', () => {
            const result = validateNHSNumber('123456789');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('10 digits');
        });

        it('should reject NHS number with more than 10 digits', () => {
            const result = validateNHSNumber('12345678901');
            expect(result.valid).toBe(false);
        });

        it('should reject NHS number with letters', () => {
            const result = validateNHSNumber('123456789A');
            expect(result.valid).toBe(false);
        });

        it('should reject empty NHS number', () => {
            const result = validateNHSNumber('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });

        it('should handle whitespace by trimming', () => {
            const result = validateNHSNumber(' 1234567890 ');
            expect(result.valid).toBe(true);
        });
    });

    describe('Appointment Date Validation (UT04)', () => {
        it('should reject past dates', () => {
            const pastDate = '2020-01-01 10:00';
            const result = validateAppointmentDate(pastDate);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('past');
        });

        it('should accept future dates', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 7);
            futureDate.setHours(10, 0, 0, 0); // Set to 10:00 AM (working hours)
            const futureStr = futureDate.toISOString().slice(0, 16).replace('T', ' ');
            const result = validateAppointmentDate(futureStr);
            expect(result.valid).toBe(true);
        });

        it('should reject dates more than 6 months ahead', () => {
            const farFuture = new Date();
            farFuture.setMonth(farFuture.getMonth() + 7);
            const farFutureStr = farFuture.toISOString().slice(0, 16).replace('T', ' ');
            const result = validateAppointmentDate(farFutureStr);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('6 months');
        });

        it('should reject appointments before 9 AM', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(8, 0, 0, 0);
            const tomorrowStr = tomorrow.toISOString().slice(0, 16).replace('T', ' ');
            const result = validateAppointmentDate(tomorrowStr);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('9:00 AM');
        });

        it('should reject appointments after 5 PM', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(18, 0, 0, 0);
            const tomorrowStr = tomorrow.toISOString().slice(0, 16).replace('T', ' ');
            const result = validateAppointmentDate(tomorrowStr);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('5:00 PM');
        });

        it('should reject empty date', () => {
            const result = validateAppointmentDate('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });
    });

    describe('Password Validation', () => {
        it('should accept valid password', () => {
            const result = validatePassword('secure123');
            expect(result.valid).toBe(true);
        });

        it('should reject password shorter than 6 characters', () => {
            const result = validatePassword('short');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('6 characters');
        });

        it('should reject empty password', () => {
            const result = validatePassword('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });
    });

    describe('DOB Validation (Story 07 - AC 7.2)', () => {
        it('should accept valid past date', () => {
            const result = validateDOB('1990-03-15');
            expect(result.valid).toBe(true);
        });

        it('should reject future date (AC 7.2)', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const dateStr = futureDate.toISOString().split('T')[0];
            const result = validateDOB(dateStr);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('future');
        });

        it('should reject empty DOB', () => {
            const result = validateDOB('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });

        it('should reject unreasonably old date (>150 years)', () => {
            const result = validateDOB('1800-01-01');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('invalid');
        });
    });

    describe('Doctor ID Validation', () => {
        it('should accept valid doctor ID', () => {
            const result = validateDoctor('DR_SMITH_001');
            expect(result.valid).toBe(true);
        });

        it('should reject empty doctor ID', () => {
            const result = validateDoctor('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });

        it('should reject whitespace-only doctor ID', () => {
            const result = validateDoctor('   ');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });

        it('should reject very short doctor ID', () => {
            const result = validateDoctor('DR');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('invalid');
        });
    });
});
