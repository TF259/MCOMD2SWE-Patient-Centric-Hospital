<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let { form } = $props();
    let isSubmitting = $state(false);

    // Format date input to YYYY-MM-DD
    function formatDateForInput(): string {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18); // Default to 18 years ago
        return today.toISOString().split('T')[0];
    }

    // Get max date (today - 0 years, i.e., today)
    function getMaxDate(): string {
        return new Date().toISOString().split('T')[0];
    }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-block bg-blue-600 text-white px-6 py-3 mb-4">
                <h1 class="text-2xl font-bold">ADMIN PORTAL</h1>
            </div>
            <p class="text-gray-600">Patient Registration (Story 07)</p>
        </div>

        <!-- Registration Container -->
        <div class="bg-white border-4 border-gray-900">
            <div class="bg-gray-900 text-white px-4 py-2 text-sm font-bold mb-6">
                AC 7.1: Generate unique NHS number | AC 7.2: Validate DOB
            </div>

            <div class="p-8">
                <form method="POST" action="?/register" use:enhance={() => {
                    isSubmitting = true;
                    return async ({ result, update }) => {
                        isSubmitting = false;
                        if (result.type === 'redirect') {
                            await goto(result.location);
                        } else {
                            await update();
                        }
                    };
                }} class="space-y-6">
                    <!-- Full Name -->
                    <div>
                        <label for="full_name" class="block text-sm font-bold text-gray-900 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            required
                            value={form?.fullName || ''}
                            placeholder="e.g. John Smith"
                            class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p class="text-xs text-gray-500 mt-1">Patient's legal full name</p>
                    </div>

                    <!-- Date of Birth -->
                    <div>
                        <label for="dob" class="block text-sm font-bold text-gray-900 mb-2">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            required
                            max={getMaxDate()}
                            class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p class="text-xs text-gray-500 mt-1">AC 7.2: Cannot be in the future</p>
                    </div>

                    <!-- Address -->
                    <div>
                        <label for="address" class="block text-sm font-bold text-gray-900 mb-2">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            required
                            rows="3"
                            placeholder="Street address, City, Postcode"
                            class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        ></textarea>
                        <p class="text-xs text-gray-500 mt-1">Full residential address</p>
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-bold text-gray-900 mb-2">
                            Initial Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minlength="6"
                            class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p class="text-xs text-gray-500 mt-1">Minimum 6 characters (NFR1: Secure hashing)</p>
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="confirm_password" class="block text-sm font-bold text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            required
                            minlength="6"
                            class="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p class="text-xs text-gray-500 mt-1">Must match above password</p>
                    </div>

                    <!-- Error Message -->
                    {#if form?.error}
                        <div class="bg-red-50 border-l-4 border-red-600 p-4">
                            <p class="text-sm font-bold text-red-900">{form.error}</p>
                        </div>
                    {/if}

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="w-full bg-blue-600 text-white px-6 py-4 text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'CREATING...' : 'CREATE NEW PATIENT RECORD'}
                    </button>
                </form>

                <!-- Info Panel -->
                <div class="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 text-sm text-gray-700">
                    <p class="font-bold mb-2">Story 07 Implementation:</p>
                    <ul class="space-y-1">
                        <li>✓ AC 7.1: NHS number auto-generated on successful registration</li>
                        <li>✓ AC 7.2: DOB validation prevents future dates</li>
                        <li>✓ NFR1: Passwords hashed with bcrypt (salt rounds 10)</li>
                        <li>✓ T14: Audit log created for every registration</li>
                    </ul>
                </div>

                <!-- Link to Login -->
                <div class="mt-6">
                    <a href="/" class="text-center block text-blue-600 hover:text-blue-700 font-bold">
                        ← Back to Login
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
