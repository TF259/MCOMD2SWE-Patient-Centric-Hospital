# Test Credentials & Access Guide

## Patient Login Credentials

All patient passwords are hashed with bcrypt (salt rounds 10) for security (NFR1).

### Test Patients (Pre-seeded)

| NHS Number | Name | Password | DOB | Use Case |
|------------|------|----------|-----|----------|
| `1234567890` | Arthur Retiree | `SecurePass123!` | 1954-05-12 | Elderly patient, limited tech experience |
| `0987654321` | Sarah Professional | `SarahSecure456!` | 1997-08-22 | Mobile-first professional, busy schedule |

**Login Steps:**
1. Navigate to the application homepage
2. Click the **"PATIENT LOGIN"** tab
3. Enter NHS Number and Password
4. Click **"ACCESS PATIENT PORTAL"**

---

## Doctor/Clinician Login Credentials

All doctors share the same test password (for MVP simplicity).

### Test Doctors (Pre-seeded)

**All Doctors Use:** `DoctorPass123!`

| Doctor ID | Full Name | Specialty | Use Case |
|-----------|-----------|-----------|----------|
| `DR_SMITH_001` | Dr. Emily Smith | Cardiology | Cardiology specialization demo |
| `DR_CHEN_002` | Dr. Michael Chen | Cardiology | Multiple doctors per specialty |
| `DR_MEHTA_003` | Dr. Priya Mehta | General Practice | High-volume GP (Story 05) |
| `DR_WILSON_004` | Dr. James Wilson | General Practice | General Practice backup |
| `DR_PATEL_005` | Dr. Arun Patel | Neurology | Neurology specialization |
| `DR_JONES_006` | Dr. Sarah Jones | Neurology | Multiple specialties support |
| `DR_KUMAR_007` | Dr. Raj Kumar | Dermatology | Dermatology specialization |
| `DR_TAYLOR_008` | Dr. Lisa Taylor | Paediatrics | Paediatric specialization |

**Login Steps:**
1. Navigate to the application homepage
2. Click the **"CLINICIAN LOGIN"** tab
3. Enter any Doctor ID from above
4. Enter password: `DoctorPass123!`
5. Click **"ACCESS CLINICIAN PORTAL"**

---

## Admin Registration (Story 07)

### Feature Overview
Admins can register new patients with auto-generated unique NHS numbers.

**AC 7.1:** System must generate a unique `nhs_number` PK upon successful registration
**AC 7.2:** Verification must fail if DOB field is empty or in the future

### How to Register a New Patient

1. From the login page, click **"Register New Patient (Story 07)"**
2. Fill in the following fields:
   - **Full Name:** Patient's legal name
   - **Date of Birth:** Select from date picker (cannot be today or future)
   - **Address:** Full residential address
   - **Initial Password:** Minimum 6 characters
   - **Confirm Password:** Must match above

3. Click **"CREATE NEW PATIENT RECORD"**
4. Success page displays the newly generated **NHS Number**
5. New patient can now log in with their NHS Number and password

### Validation Rules
- ✓ All fields required
- ✓ DOB cannot be in the future (AC 7.2)
- ✓ Password minimum 6 characters (NFR1 security requirement)
- ✓ Password and confirmation must match
- ✓ NHS Number auto-generated (AC 7.1)

---

## API Test Endpoints (For Manual Testing)

### Test Appointment Booking
1. Log in as a patient
2. Click "VIEW ALL DOCTORS" or "BOOK →"
3. Select a specialty (optional)
4. Select a doctor (e.g., Dr. Mehta)
5. Select a future date
6. Select an available time slot (green)
7. Click "TRIGGER: CREATE_APPOINTMENT_ENTRY"
8. Redirects to dashboard with success message

### Test Appointment Cancellation
1. After booking, on the Patient Dashboard
2. Find the appointment under "Your Appointments"
3. Click "CANCEL"
4. Confirm the cancellation
5. Dashboard shows "Appointment cancelled" banner

### Test Doctor Dashboard
1. Log in as a doctor (e.g., `DR_MEHTA_003`)
2. View "TODAY'S SCHEDULE" tab for today's appointments
3. View "UPCOMING" tab for next 7 days
4. View "HISTORY" tab for past/completed appointments
5. Click "COMPLETE" or "CANCEL" to manage appointments

---

## Security Notes

### Password Hashing (NFR1)
- All passwords are hashed using **bcryptjs** with **salt rounds 10**
- Passwords are never stored in plain text
- Each password hash is unique even for identical passwords

### Session Management
- Sessions stored in-memory with UUID identifiers
- Sessions expire after 24 hours (7 days for testing)
- Sessions tied to browser cookies (httpOnly, sameSite)

### Audit Logging (GDPR Compliance - T14)
All actions logged to database:
- Login attempts (success and failures)
- Patient registrations
- Appointment creations/cancellations
- Medical record views

View audit logs in database: `SELECT * FROM audit_logs WHERE nhs_number = ?`

---

## Database Information

**Database Type:** SQLite with better-sqlite3
**Location:** `src/lib/server/hospital.db`
**Schema Initialized:** Automatic on first run

### Key Tables
- `patients` - Patient records (NHS Number PK)
- `doctors` - Clinician records (Doctor ID PK)
- `appointments` - Booking records (unique constraint on doctor_id + slot_time)
- `medical_records` - Patient health records
- `audit_logs` - GDPR audit trail

---

## Troubleshooting

### "Invalid NHS Number or Password"
- Ensure NHS Number is exactly 10 digits
- Check password capitalization (passwords are case-sensitive)
- Verify you're using credentials from the table above

### "This time slot is already booked"
- The slot was booked between your page load and submission
- Select a different time slot
- Refresh the availability by navigating back to doctor selection

### Cannot register new patient
- All fields must be completed
- DOB cannot be today or in the future (AC 7.2)
- Password must be 6+ characters and match confirmation

---

## Test Data Refresh

To reset the database with fresh test data:

```bash
# Delete the database
rm src/lib/server/hospital.db

# Restart the development server
npm run dev

# Database automatically re-seeds with test credentials above
```

---

Last Updated: 2026-04-06
Sprint 2 Testing Phase
