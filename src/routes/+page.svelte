<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
    
    let activeTab = $state<'patient' | 'doctor'>(form?.loginType === 'doctor' ? 'doctor' : 'patient');
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- NHS-style Header -->
        <div class="text-center mb-8">
            <div class="inline-block bg-blue-600 text-white px-6 py-3 mb-4">
                <h1 class="text-2xl font-bold">CarePoint HMS</h1>
            </div>
            <p class="text-gray-600">Secure NHS Portal Access</p>
        </div>

        <!-- Login Container -->
        <div class="bg-white border-2 border-gray-900">
            <!-- Tabs -->
            <div class="flex border-b-2 border-gray-900">
                <button
                    type="button"
                    onclick={() => activeTab = 'patient'}
                    class="flex-1 py-4 text-base font-bold transition-colors {activeTab === 'patient' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
                >
                    PATIENT LOGIN
                </button>
                <button
                    type="button"
                    onclick={() => activeTab = 'doctor'}
                    class="flex-1 py-4 text-base font-bold transition-colors border-l-2 border-gray-900 {activeTab === 'doctor' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
                >
                    CLINICIAN LOGIN
                </button>
            </div>

            <!-- Login Forms -->
            <div class="p-8">
                {#if activeTab === 'patient'}
                    <!-- Patient Login -->
                    <form method="POST" action="?/login" use:enhance class="space-y-6">
                        <div>
                            <label for="nhs_number" class="block text-sm font-bold text-gray-900 mb-2">
                                NHS Number
                            </label>
                            <input 
                                type="text" 
                                id="nhs_number"
                                name="nhs_number" 
                                required
                                placeholder="1234567890"
                                class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <p class="text-xs text-gray-500 mt-1">Test: 1234567890</p>
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-bold text-gray-900 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                required 
                                class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <p class="text-xs text-gray-500 mt-1">Test password: SecurePass123!</p>
                        </div>

                        {#if form?.error && form?.loginType === 'patient'}
                            <div class="bg-red-50 border-l-4 border-red-600 p-4">
                                <p class="text-sm font-bold text-red-900">{form.error}</p>
                            </div>
                        {/if}

                        <button 
                            type="submit" 
                            class="w-full bg-blue-600 text-white px-6 py-4 text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        >
                            ACCESS PATIENT PORTAL
                        </button>
                    </form>
                {:else}
                    <!-- Doctor Login -->
                    <form method="POST" action="?/doctorLogin" use:enhance class="space-y-6">
                        <div>
                            <label for="doctor_id" class="block text-sm font-bold text-gray-900 mb-2">
                                Clinician ID
                            </label>
                            <input 
                                type="text" 
                                id="doctor_id"
                                name="doctor_id" 
                                required
                                placeholder="DR_SMITH_001"
                                class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <p class="text-xs text-gray-500 mt-1">Test IDs: DR_SMITH_001, DR_MEHTA_003, DR_PATEL_005</p>
                        </div>

                        <div>
                            <label for="doctor_password" class="block text-sm font-bold text-gray-900 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="doctor_password"
                                name="password" 
                                required 
                                class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <p class="text-xs text-gray-500 mt-1">Test password: DoctorPass123!</p>
                        </div>

                        {#if form?.error && form?.loginType === 'doctor'}
                            <div class="bg-red-50 border-l-4 border-red-600 p-4">
                                <p class="text-sm font-bold text-red-900">{form.error}</p>
                            </div>
                        {/if}

                        <button 
                            type="submit" 
                            class="w-full bg-blue-600 text-white px-6 py-4 text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        >
                            ACCESS CLINICIAN PORTAL
                        </button>
                    </form>
                {/if}
            </div>
        </div>

        <!-- Info Panel -->
        <div class="mt-6 bg-white border border-gray-300 p-4 text-sm text-gray-600">
            <p class="font-bold mb-2">Security Information</p>
            <ul class="space-y-1">
                <li>✓ All connections are encrypted</li>
                <li>✓ Sessions expire after 24 hours</li>
                <li>✓ Access is logged for GDPR compliance</li>
            </ul>
        </div>

        <!-- Admin Registration Link -->
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600 mb-2">Is this a new patient? (Admin use only)</p>
            <a href="/admin/register" class="inline-block bg-gray-900 text-white px-6 py-2 text-sm font-bold hover:bg-gray-800 transition-colors">
                → Register New Patient (Story 07)
            </a>
        </div>
    </div>
</div>