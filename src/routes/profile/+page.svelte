<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    function formatDOB(dobStr: string) {
        if (!dobStr) return 'N/A';
        const date = new Date(dobStr + 'T00:00:00');
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function getAge(dobStr: string): number {
        const dob = new Date(dobStr + 'T00:00:00');
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
</script>

<div class="bg-gray-50 min-h-screen">
    <main class="max-w-2xl mx-auto p-6">
        <div class="bg-white border-2 border-gray-900 p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {#if data.patient}
                <!-- Personal Information -->
                <section class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-3">
                        Personal Information
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p class="text-xs font-bold text-gray-600 uppercase mb-1">Full Name</p>
                            <p class="text-lg font-bold text-gray-900">{data.patient.full_name}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-600 uppercase mb-1">Age</p>
                            <p class="text-lg font-bold text-gray-900">{getAge(data.patient.dob)} years old</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p class="text-xs font-bold text-gray-600 uppercase mb-1">Date of Birth</p>
                            <p class="text-lg font-bold text-gray-900">{formatDOB(data.patient.dob)}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-600 uppercase mb-1">NHS Number</p>
                            <p class="text-lg font-mono font-bold text-blue-700">{data.nhs_number}</p>
                        </div>
                    </div>

                    <div>
                        <p class="text-xs font-bold text-gray-600 uppercase mb-1">Address</p>
                        <p class="text-lg text-gray-900">{data.patient.address || '—'}</p>
                    </div>
                </section>

                <!-- Account Information -->
                <section class="mb-8">
                    <h2 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-3">
                        Account Information
                    </h2>

                    <div class="bg-blue-50 border-4 border-blue-600 p-4 mb-6">
                        <p class="text-sm font-bold text-gray-700 mb-2">Account Type</p>
                        <p class="text-lg font-bold text-blue-700">Patient Portal</p>
                    </div>

                    <div>
                        <p class="text-xs font-bold text-gray-600 uppercase mb-3">Quick Links</p>
                        <div class="space-y-2">
                            <a href="/audit-log" class="block px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold text-gray-900 transition-colors">
                                📋 View Audit Log
                            </a>
                            <a href="/privacy/data-request" class="block px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold text-gray-900 transition-colors">
                                📥 Request My Data (GDPR)
                            </a>
                            <a href="/privacy/deletion-request" class="block px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold text-gray-900 transition-colors">
                                🗑️ Request Account Deletion
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Help -->
                <section class="bg-blue-50 border-4 border-blue-600 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
                    <ul class="space-y-2 text-sm text-gray-700">
                        <li>• Need to update address? <strong>Contact reception at ext. 1234</strong></li>
                        <li>• Password reset? <strong>Use the login page</strong></li>
                        <li>• GDPR requests? <strong>Use the links above</strong></li>
                    </ul>
                </section>
            {/if}

            <div class="mt-8">
                <a href="/dashboard" class="inline-block bg-gray-900 text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors">
                    ← Back to Dashboard
                </a>
            </div>
        </div>
    </main>
</div>
