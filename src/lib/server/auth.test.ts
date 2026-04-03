// src/lib/server/auth.test.ts
import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Authentication Security (T11 & T8)', () => {
    it('should successfully validate a hashed password (UT01)', async () => {
        // --- ARRANGE ---
        const plainPassword = 'arthur123';
        const storedHash = await bcrypt.hash(plainPassword, 10);

        // --- ACT ---
        const isValid = await bcrypt.compare(plainPassword, storedHash);

        // --- ASSERT ---
        expect(isValid).toBe(true);
    });

    it('should fail when passwords do not match (UT02)', async () => {
        // --- ARRANGE ---
        const correctPassword = 'arthur123';
        const wrongPassword = 'wrongpassword';
        const storedHash = await bcrypt.hash(correctPassword, 10);

        // --- ACT ---
        const isValid = await bcrypt.compare(wrongPassword, storedHash);

        // --- ASSERT ---
        expect(isValid).toBe(false);
    });
});