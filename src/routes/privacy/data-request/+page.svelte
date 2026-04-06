<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-4 border-gray-900 px-6 py-6">
        <div class="max-w-2xl mx-auto">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">DATA REQUEST</h1>
                    <p class="text-sm text-gray-600 mt-1">GDPR Article 15 - Subject Access Request</p>
                </div>
                <a href="/dashboard" class="border-2 border-gray-900 px-4 py-2 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors">
                    ← BACK
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-2xl mx-auto p-6">
        <div class="bg-white border-2 border-gray-900 p-8">
            <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p class="font-bold text-blue-900">📋 Request All Your Data</p>
                <p class="text-sm text-blue-800 mt-2">
                    Under GDPR Article 15, you have the right to request a copy of all personal data we hold about you. Your request will be processed within 30 days.
                </p>
            </div>

            <form method="POST" action="?/requestDataExport" use:enhance class="space-y-6">
                <!-- Format Selection -->
                <div>
                    <label for="format" class="block text-sm font-bold text-gray-900 mb-2">
                        Export Format
                    </label>
                    <select
                        id="format"
                        name="format"
                        required
                        class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">-- Select Format --</option>
                        <option value="PDF">PDF (Formatted Document)</option>
                        <option value="CSV">CSV (Spreadsheet Compatible)</option>
                        <option value="JSON">JSON (Machine Readable)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Choose your preferred format for the data export</p>
                </div>

                <!-- Include Audit Logs -->
                <div>
                    <label class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="include_audit_logs"
                            checked
                            class="w-5 h-5 border-2 border-gray-900"
                        />
                        <span class="text-sm font-bold text-gray-900">Include access audit logs</span>
                    </label>
                    <p class="text-xs text-gray-500 mt-2">Your complete history of data access events</p>
                </div>

                <!-- Error Message -->
                {#if form?.error}
                    <div class="bg-red-50 border-l-4 border-red-600 p-4">
                        <p class="text-sm font-bold text-red-900">{form.error}</p>
                    </div>
                {/if}

                <!-- Confirmation -->
                <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                    <p class="text-xs font-bold text-yellow-900 uppercase">Compliance</p>
                    <p class="text-sm text-yellow-800 mt-1">By submitting this request, you confirm that you are the data subject and this information will be processed in accordance with GDPR Article 15.</p>
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white px-6 py-4 text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                >
                    REQUEST DATA EXPORT
                </button>
            </form>

            <!-- Other GDPR Options -->
            <div class="mt-8 pt-8 border-t-2 border-gray-300 space-y-3">
                <p class="text-sm font-bold text-gray-900">Other GDPR Rights:</p>
                <a href="/audit-log" class="block text-blue-600 hover:text-blue-700 font-bold text-sm">
                    → View Access Audit Log
                </a>
                <a href="/privacy/deletion-request" class="block text-red-600 hover:text-red-700 font-bold text-sm">
                    → Request Account Deletion
                </a>
            </div>
        </div>
    </main>
</div>
