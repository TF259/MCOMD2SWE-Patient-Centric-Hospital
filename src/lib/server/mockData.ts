// src/lib/server/mockData.ts

export interface Patient {
    nhs_number: string; // PK
    full_name: string;
    dob: string;
    address: string;
    password_hash: string;
}

export const patients: Patient[] = [
    {
        nhs_number: "1234567890", // Arthur's Test ID
        full_name: "Arthur Retiree",
        dob: "1954-05-12",
        address: "123 Care Lane, Kent",
        password_hash: "password123" // In a real app, use Bcrypt
    }
];

export const doctors = [
    {
        doctor_id: "DR_MEHTA_005",
        name: "Dr. Mehta",
        specialty: "Cardiology",
        availability_json: JSON.stringify([
            { time: "09:00", status: "READY" },
            { time: "09:30", status: "BOOKED" }
        ])
    }
];