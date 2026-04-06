<script lang="ts">
    import { page } from '$app/stores';

    const requestId = $derived($page.url.searchParams.get('request_id'));
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Success Header -->
        <div class="text-center mb-8">
            <div class="inline-block bg-orange-600 text-white px-6 py-3 mb-4">
                <h1 class="text-2xl font-bold">✓ REQUEST RECEIVED</h1>
            </div>
            <p class="text-gray-600">Your account deletion request has been submitted</p>
        </div>

        <!-- Success Container -->
        <div class="bg-white border-4 border-orange-600 p-8">
            <div class="text-center">
                <svg class="w-16 h-16 text-orange-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>

                <h2 class="text-2xl font-bold text-gray-900 mb-4">Deletion Request Confirmed</h2>

                <div class="bg-blue-50 border-2 border-blue-600 p-6 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Request ID:</p>
                    <p class="text-2xl font-bold font-mono text-gray-900">{requestId || 'PENDING'}</p>
                </div>

                <div class="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6 text-left">
                    <p class="font-bold text-orange-900 mb-2">⏱️ Timeline:</p>
                    <ul class="space-y-2 text-sm text-orange-800">
                        <li>📬 Request submitted and logged</li>
                        <li>🔍 Manual review by data protection team (3-5 business days)</li>
                        <li>✓ Approval or clarification (if needed)</li>
                        <li>🗑️ Data erasure (typically within 30 days of approval)</li>
                        <li>✉️ Confirmation email when complete</li>
                    </ul>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6 text-sm text-gray-700">
                    <p class="font-bold mb-1">📋 Important Notes:</p>
                    <ul class="space-y-1">
                        <li>• You will receive a confirmation email shortly</li>
                        <li>• Some records may be retained for legal/clinical audit purposes</li>
                        <li>• Your request cannot be cancelled once processed</li>
                    </ul>
                </div>

                <a href="/" class="block w-full bg-gray-600 text-white px-6 py-4 font-bold hover:bg-gray-700 transition-colors text-center">
                    Return to Login
                </a>
            </div>
        </div>

        <!-- GDPR Info -->
        <div class="mt-6 bg-white border border-gray-300 p-4 text-sm text-gray-600">
            <p class="font-bold mb-2">🔒 GDPR Article 17 Compliance:</p>
            <p>Your deletion request will be processed in accordance with data protection regulations. If you have any questions, contact our Data Protection Officer at privacy@carepoint.nhs.uk</p>
        </div>
    </div>
</div>
