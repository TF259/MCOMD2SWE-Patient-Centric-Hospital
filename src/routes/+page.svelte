<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props(); // Svelte 5 Rune
    
    // Track which login tab is active
    let activeTab = $state<'patient' | 'doctor'>(form?.loginType === 'doctor' ? 'doctor' : 'patient');
</script>

<div class="min-h-screen bg-white flex flex-col justify-center py-8 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-block bg-green-700 text-white px-4 py-2 text-sm font-bold mb-4">
                CAREPOINT HMS
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Secure Login</h1>
            <p class="text-base text-gray-600">[ AUTH_GATEWAY_V1 ]</p>
        </div>

        <!-- Role Selection Tabs -->
        <div class="flex border-4 border-gray-900 mb-0">
            <button
                type="button"
                onclick={() => activeTab = 'patient'}
                class="flex-1 py-4 text-lg font-bold transition-colors {activeTab === 'patient' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
            >
                PATIENT LOGIN
            </button>
            <button
                type="button"
                onclick={() => activeTab = 'doctor'}
                class="flex-1 py-4 text-lg font-bold transition-colors border-l-4 border-gray-900 {activeTab === 'doctor' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
            >
                DOCTOR LOGIN
            </button>
        </div>

        <!-- Login Forms Container -->
        <div class="border-4 border-t-0 border-gray-900 p-8 bg-white">
            {#if activeTab === 'patient'}
                <!-- Patient Login Form -->
                <form method="POST" action="?/login" use:enhance class="space-y-6">
                    <div class="space-y-2">
                        <label for="nhs_number" class="block text-lg font-bold text-gray-900">
                            NHS Number (10-digit)
                        </label>
                        <input 
                            type="text" 
                            id="nhs_number"
                            name="nhs_number" 
                            required
                            placeholder="e.g., 1234567890"
                            class="block w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                        />
                        <p class="text-sm text-gray-500">Test: 1234567890 (Password: SecurePass123!)</p>
                    </div>
                    
                    <div class="space-y-2">
                        <label for="password" class="block text-lg font-bold text-gray-900">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password"
                            name="password" 
                            required 
                            class="block w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                        />
                    </div>

                    {#if form?.error && form?.loginType === 'patient'}
                        <div class="border-l-4 border-red-600 bg-red-50 p-4">
                            <p class="text-base font-bold text-red-900">{form.error}</p>
                        </div>
                    {/if}

                    <button 
                        type="submit" 
                        class="w-full bg-green-700 text-white px-6 py-4 text-xl font-bold rounded-none hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition-colors"
                    >
                        ACCESS PATIENT PORTAL
                    </button>
                </form>
            {:else}
                <!-- Doctor Login Form -->
                <form method="POST" action="?/doctorLogin" use:enhance class="space-y-6">
                    <div class="space-y-2">
                        <label for="doctor_id" class="block text-lg font-bold text-gray-900">
                            Doctor ID
                        </label>
                        <input 
                            type="text" 
                            id="doctor_id"
                            name="doctor_id" 
                            required
                            placeholder="e.g., DR_SMITH_001"
                            class="block w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                        />
                        <p class="text-sm text-gray-500">Available: DR_SMITH_001, DR_MEHTA_005, DR_PATEL_003</p>
                    </div>

                    <div class="space-y-2">
                        <label for="doctor_password" class="block text-lg font-bold text-gray-900">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="doctor_password"
                            name="password" 
                            required 
                            class="block w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                        />
                        <p class="text-sm text-gray-500">Test password: DoctorPass123!</p>
                    </div>

                    {#if form?.error && form?.loginType === 'doctor'}
                        <div class="border-l-4 border-red-600 bg-red-50 p-4">
                            <p class="text-base font-bold text-red-900">{form.error}</p>
                        </div>
                    {/if}

                    <button 
                        type="submit" 
                        class="w-full bg-blue-700 text-white px-6 py-4 text-xl font-bold rounded-none hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm transition-colors"
                    >
                        ACCESS CLINICIAN PORTAL
                    </button>
                </form>
            {/if}
        </div>

        <!-- Info Panel -->
        <div class="mt-6 bg-gray-50 border-2 border-gray-300 p-4">
            <h3 class="text-sm font-bold text-gray-700 mb-2">SYSTEM INFO</h3>
            <ul class="text-sm text-gray-600 space-y-1">
                <li>✓ NFR1: Secure session validation</li>
                <li>✓ NFR2: &lt;2s load time compliance</li>
                <li>✓ NFR3: High-contrast accessibility</li>
            </ul>
        </div>
    </div>
</div>