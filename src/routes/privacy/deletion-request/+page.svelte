<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();
    let confirmationChecked = $state(false);
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-4 border-red-600 px-6 py-6">
        <div class="max-w-2xl mx-auto">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-red-600">DELETE ACCOUNT</h1>
                    <p class="text-sm text-gray-600 mt-1">GDPR Article 17 - Right to Be Forgotten</p>
                </div>
                <a href="/dashboard" class="border-2 border-gray-900 px-4 py-2 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors">
                    ← BACK
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-2xl mx-auto p-6">
        <div class="bg-red-50 border-4 border-red-600 p-8">
            <div class="mb-6">
                <div class="inline-block bg-red-600 text-white px-4 py-2 font-bold mb-4">
                    ⚠️ CRITICAL ACTION
                </div>
                <p class="text-base text-gray-900 font-bold">This action cannot be undone.</p>
            </div>

            <div class="bg-white border-l-4 border-red-600 p-4 mb-6">
                <p class="font-bold text-red-900 mb-3">If you proceed, the following will happen:</p>
                <ul class="space-y-2 text-sm text-gray-900">
                    <li>🗑️ Your entire patient account will be permanently deleted</li>
                    <li>📋 All your medical records will be removed</li>
                    <li>📅 All your appointments will be cancelled</li>
                    <li>🔐 Your login credentials will be deactivated</li>
                    <li>⏱️ The deletion process takes up to 30 days to complete</li>
                </ul>
            </div>

            <form method="POST" action="?/requestDeletion" use:enhance class="space-y-6">
                <!-- Reason (Optional) -->
                <div>
                    <label for="reason" class="block text-sm font-bold text-gray-900 mb-2">
                        Reason for Deletion (Optional)
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows="3"
                        placeholder="Help us improve by telling us why you're leaving..."
                        class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    ></textarea>
                </div>

                <!-- Confirmation Checkbox (CRITICAL) -->
                <div class="bg-yellow-50 border-2 border-yellow-600 p-4">
                    <label class="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="confirmation"
                            bind:checked={confirmationChecked}
                            class="w-6 h-6 border-2 border-red-600 mt-1 cursor-pointer"
                            required
                        />
                        <span class="text-sm font-bold text-gray-900">
                            I understand that deleting my account will permanently remove all my data, including medical records and appointment history. This action cannot be undone.
                        </span>
                    </label>
                </div>

                <!-- Error Message -->
                {#if form?.error}
                    <div class="bg-red-100 border-l-4 border-red-600 p-4">
                        <p class="text-sm font-bold text-red-900">{form.error}</p>
                    </div>
                {/if}

                <!-- Buttons -->
                <div class="flex gap-3">
                    <a href="/dashboard" class="flex-1 bg-gray-600 text-white px-4 py-4 text-lg font-bold text-center hover:bg-gray-700 transition-colors">
                        ← CANCEL
                    </a>
                    <button
                        type="submit"
                        disabled={!confirmationChecked}
                        class="flex-1 bg-red-600 text-white px-4 py-4 text-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        DELETE MY ACCOUNT
                    </button>
                </div>
            </form>

            <!-- GDPR Info -->
            <div class="mt-8 pt-8 border-t-2 border-gray-300">
                <p class="text-xs font-bold text-gray-600 uppercase mb-2">GDPR Article 17</p>
                <p class="text-sm text-gray-700">
                    You have the right to request erasure of your personal data under the General Data Protection Regulation. NHS CarePoint will process your request in accordance with legal retention requirements and GDPR compliance obligations.
                </p>
            </div>
        </div>
    </main>
</div>
