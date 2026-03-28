// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Patient {
			id: number;
			name: string;
			email: string;
			dob: string | null;
			phone: string | null;
			address: string | null;
			created_at: string;
		}
		interface Locals {
			patient: Patient | null;
			sessionToken: string | null;
		}
	}
}

export {};
