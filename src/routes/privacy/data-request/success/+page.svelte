<script lang="ts">
    import { page } from '$app/stores';

    const requestId = $derived($page.url.searchParams.get('request_id'));
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Success Header -->
        <div class="text-center mb-8">
            <div class="inline-block bg-green-600 text-white px-6 py-3 mb-4">
                <h1 class="text-2xl font-bold">✓ REQUEST SUBMITTED</h1>
            </div>
            <p class="text-gray-600">Your data export request has been received</p>
        </div>

        <!-- Success Container -->
        <div class="bg-white border-4 border-green-600 p-8">
            <div class="text-center">
                <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>

                <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Export Request Confirmed</h2>

                <div class="bg-blue-50 border-2 border-blue-600 p-6 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Request ID:</p>
                    <p class="text-2xl font-bold font-mono text-gray-900">{requestId || 'PENDING'}</p>
                </div>

                <div class="bg-green-50 border-l-4 border-green-600 p-4 mb-6 text-left">
                    <p class="font-bold text-green-900 mb-2">✓ What Happens Next:</p>
                    <ul class="space-y-2 text-sm text-green-800">
                        <li>📋 Your data export request is being processed</li>
                        <li>⏱️ You will receive your data within 30 days (GDPR compliance)</li>
                        <li>📧 Check your email for download instructions</li>
                        <li>🔒 Your data will be encrypted for security</li>
                    </ul>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6 text-sm text-gray-700">
                    <p class="font-bold mb-1">📝 Your Request Includes:</p>
                    <ul class="space-y-1">
                        <li>✓ Patient profile information</li>
                        <li>✓ Medical records</li>
                        <li>✓ Appointment history</li>
                        <li>✓ Audit logs (if requested)</li>
                    </ul>
                </div>

                <div class="flex flex-col gap-3">
                    <a href="/dashboard" class="bg-blue-600 text-white px-6 py-4 font-bold hover:bg-blue-700 transition-colors">
                        ← Back to Dashboard
                    </a>
                    <a href="/audit-log" class="bg-gray-600 text-white px-6 py-4 font-bold hover:bg-gray-700 transition-colors">
                        View Audit Log
                    </a>
                </div>
            </div>
        </div>

        <!-- GDPR Info -->
        <div class="mt-6 bg-white border border-gray-300 p-4 text-sm text-gray-600">
            <p class="font-bold mb-2">Under GDPR Article 15:</p>
            <p>You have the right to request all personal data we hold about you. Your request will be processed free of charge and within the statutory timeframe.</p>
        </div>
    </div>
</div>
