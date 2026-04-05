// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

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

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: PatientSession | DoctorSession;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
