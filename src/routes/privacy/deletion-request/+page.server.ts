// src/routes/privacy/deletion-request/+page.server.ts
import type { Actions } from './$types';
import { createDeletionRequest } from '$lib/server/db-helpers';
import { redirect, fail } from '@sveltejs/kit';
import '$lib/server/db-seed';

export const actions = {
    requestDeletion: async ({ request, locals }) => {
        const session = locals.session;

        if (!session || session.type !== 'patient' || !session.nhs_number) {
            throw redirect(303, '/');
        }

        const data = await request.formData();
        const reason = data.get('reason') as string | null;
        const confirmed = data.get('confirmation');

        //Validate confirmation checkbox
        if (!confirmed) {
            return fail(400, { error: 'Please confirm that you understand this action is permanent' });
        }

        // Create the deletion request
        const result = createDeletionRequest(session.nhs_number, reason || undefined);

        if (!result.success) {
            return fail(400, { error: result.error });
        }

        // Redirect to success page
        throw redirect(303, '/privacy/deletion-request/success?request_id=' + result.requestId);
    }
} satisfies Actions;
