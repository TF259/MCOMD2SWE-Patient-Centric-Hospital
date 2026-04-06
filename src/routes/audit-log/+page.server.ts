// src/routes/audit-log/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAuditLogsByNHS } from '$lib/server/db-helpers';
import { redirect } from '@sveltejs/kit';
import '$lib/server/db-seed';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session;

    // Redirect if not logged in or not a patient
    if (!session || session.type !== 'patient' || !session.nhs_number) {
        throw redirect(303, '/');
    }

    // Fetch audit logs for this patient (GDPR transparency)
    const auditLogs = getAuditLogsByNHS(session.nhs_number);

    return {
        patient_name: session.full_name,
        nhs_number: session.nhs_number,
        auditLogs
    };
};
