// src/routes/privacy/data-request/+page.server.ts
import type { Actions } from './$types';
import { createDataExportRequest } from '$lib/server/db-helpers';
import { redirect, fail } from '@sveltejs/kit';
import '$lib/server/db-seed';

export const actions = {
    requestDataExport: async ({ request, locals }) => {
        const session = locals.session;

        if (!session || session.type !== 'patient' || !session.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const format = data.get('format') as string;
        const includeAuditLogs = data.has('include_audit_logs');

        // Validate format
        if (!['PDF', 'CSV', 'JSON'].includes(format)) {
            return fail(400, { error: 'Invalid format selected' });
        }

        // Create the data export request
        const result = createDataExportRequest(session.nhs_number, format, includeAuditLogs);

        if (!result.success) {
            return fail(400, { error: result.error });
        }

        // Redirect to success page
        throw redirect(303, '/privacy/data-request/success?request_id=' + result.requestId);
    }
} satisfies Actions;
