import { describe, it, expect } from 'vitest';
import { validatePatient } from './auth';

describe('Clinical Auth Logic (UT01 & UT02)', () => {
    it('should validate Arthur with correct credentials (UT01)', async () => {
        const result = await validatePatient("1234567890", "arthur123");
        expect(result).not.toBeNull();
        expect(result?.full_name).toBe("Arthur Retiree");
    });

    it('should fail for non-existent NHS numbers (UT02)', async () => {
        const result = await validatePatient("0000000000", "any_password");
        expect(result).toBeNull();
    });

    it('should fail for incorrect password with valid NHS number (UT03)', async () => {
        const result = await validatePatient("1234567890", "wrong_password");
        expect(result).toBeNull();
    });

    it('should validate Sarah with correct credentials (UT04)', async () => {
        const result = await validatePatient("0987654321", "sarah123");
        expect(result).not.toBeNull();
        expect(result?.full_name).toBe("Sarah Professional");
    });

    it('should fail for empty NHS number (UT05)', async () => {
        const result = await validatePatient("", "arthur123");
        expect(result).toBeNull();
    });

    it('should fail for empty password (UT06)', async () => {
        const result = await validatePatient("1234567890", "");
        expect(result).toBeNull();
    });

    it('should fail for SQL injection attempt in NHS number (UT07)', async () => {
        const result = await validatePatient("1234567890' OR '1'='1", "arthur123");
        expect(result).toBeNull();
    });

    it('should fail for SQL injection attempt in password (UT08)', async () => {
        const result = await validatePatient("1234567890", "' OR '1'='1");
        expect(result).toBeNull();
    });

    it('should be case-sensitive for passwords (UT09)', async () => {
        const result = await validatePatient("1234567890", "ARTHUR123");
        expect(result).toBeNull();
    });

    it('should fail for whitespace-padded NHS number (UT10)', async () => {
        const result = await validatePatient(" 1234567890 ", "arthur123");
        expect(result).toBeNull();
    });
});