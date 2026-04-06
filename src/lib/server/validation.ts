// src/lib/server/validation.ts
// Input Validation (NFR1: Security Hardening)

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates NHS Number (T8: UT03)
 * Requirements: Exactly 10 digits, no letters or special characters
 */
export function validateNHSNumber(nhsNumber: string): ValidationResult {
    if (!nhsNumber) {
        return { valid: false, error: 'NHS Number is required' };
    }

    // Remove whitespace
    const cleaned = nhsNumber.trim();

    // Check exactly 10 digits
    const nhsRegex = /^\d{10}$/;
    if (!nhsRegex.test(cleaned)) {
        return { valid: false, error: 'NHS Number must be exactly 10 digits' };
    }

    return { valid: true };
}

/**
 * Validates appointment date/time (T8: UT04)
 * Requirements: Cannot book in the past, must be during working hours
 */
export function validateAppointmentDate(slotTime: string): ValidationResult {
    if (!slotTime) {
        return { valid: false, error: 'Appointment time is required' };
    }

    try {
        const appointmentDate = new Date(slotTime);
        const now = new Date();

        // Check if date is in the past
        if (appointmentDate <= now) {
            return { valid: false, error: 'Cannot book appointments in the past' };
        }

        // Check if it's within a reasonable timeframe (e.g., next 6 months)
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

        if (appointmentDate > sixMonthsFromNow) {
            return { valid: false, error: 'Appointments cannot be booked more than 6 months in advance' };
        }

        // Check working hours (9 AM - 5 PM)
        const hours = appointmentDate.getHours();
        if (hours < 9 || hours >= 17) {
            return { valid: false, error: 'Appointments must be between 9:00 AM and 5:00 PM' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Invalid date format' };
    }
}

/**
 * Validates password strength (NFR1: Security)
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    const minLength = parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10);
    
    if (password.length < minLength) {
        return { valid: false, error: `Password must be at least ${minLength} characters` };
    }

    // Require at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }

    // Require at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }

    // Require at least one number
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }

    return { valid: true };
}

/**
 * Validates Date of Birth (Story 07 - AC 7.2: DOB cannot be empty or in the future)
 */
export function validateDOB(dob: string): ValidationResult {
    if (!dob || !dob.trim()) {
        return { valid: false, error: 'Date of birth is required' };
    }

    try {
        const dobDate = new Date(dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dobDate > today) {
            return { valid: false, error: 'Date of birth cannot be in the future' };
        }

        // Optionally check for unreasonable ages (e.g., > 150 years)
        const age = (today.getTime() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age > 150) {
            return { valid: false, error: 'Date of birth appears to be invalid' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Invalid date format' };
    }
}

/**
 * Validates Doctor ID format (for login and identification)
 */
export function validateDoctor(doctorId: string): ValidationResult {
    if (!doctorId || !doctorId.trim()) {
        return { valid: false, error: 'Doctor ID is required' };
    }

    const trimmed = doctorId.trim();

    // Check for reasonable length and format (e.g., DR_NAME_NNN)
    if (trimmed.length < 5 || trimmed.length > 50) {
        return { valid: false, error: 'Doctor ID format is invalid' };
    }

    return { valid: true };
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
}
