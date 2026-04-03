<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    // Svelte 5 Runes
    let { data, form }: { data: PageData; form: any } = $props();
</script>

<div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <header class="mb-8 pb-6 border-b-4 border-gray-900">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Book Appointment
                    </h1>
                    <p class="text-base text-gray-600">[ FR3: Self-Service Booking Transaction ]</p>
                </div>
                <a 
                    href="/dashboard" 
                    class="bg-gray-900 text-white px-6 py-3 text-lg font-bold rounded-none hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-center"
                >
                    BACK TO DASHBOARD
                </a>
            </div>
        </header>

        <!-- Booking Form -->
        <div class="bg-white border-4 border-gray-900 p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 uppercase">
                Appointment Details
            </h2>

            <form method="POST" action="?/createAppointment" use:enhance class="space-y-6">
                
                <!-- Doctor Selection -->
                <div class="space-y-2">
                    <label for="doctor_id" class="block text-lg font-bold text-gray-900">
                        Select Doctor
                    </label>
                    <select 
                        id="doctor_id"
                        name="doctor_id" 
                        required
                        class="block w-full px-3 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900 bg-white"
                    >
                        <option value="">-- Choose a doctor --</option>
                        {#each data.doctors as doctor}
                            <option value={doctor.doctor_id}>
                                {doctor.name} - {doctor.specialty}
                            </option>
                        {/each}
                    </select>
                    <p class="text-sm text-gray-600 mt-1">Select from available specialists</p>
                </div>

                <!-- Slot Time (Date and Time Picker) -->
                <div class="space-y-2">
                    <label for="slot_time" class="block text-lg font-bold text-gray-900">
                        Appointment Date & Time
                    </label>
                    <input 
                        type="datetime-local"
                        id="slot_time"
                        name="slot_time" 
                        required
                        class="block w-full px-3 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900"
                    />
                    <p class="text-sm text-gray-600 mt-1">Must be a future date and time (UT03 validation)</p>
                </div>

                <!-- Reason / Clinical Notes -->
                <div class="space-y-2">
                    <label for="reason" class="block text-lg font-bold text-gray-900">
                        Reason for Visit (Clinical Notes)
                    </label>
                    <textarea 
                        id="reason"
                        name="reason"
                        rows="6"
                        placeholder="Please describe the reason for your appointment..."
                        class="block w-full px-3 py-3 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900 resize-none"
                    ></textarea>
                    <p class="text-sm text-gray-600 mt-1">Provide details to help your doctor prepare</p>
                </div>

                <!-- Error Message -->
                {#if form?.error}
                    <div class="border-l-4 border-red-600 bg-red-50 p-4">
                        <p class="text-base font-bold text-red-900">{form.error}</p>
                    </div>
                {/if}

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full bg-green-700 text-white px-6 py-4 text-lg font-bold rounded-none hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm"
                >
                    CONFIRM BOOKING
                </button>
            </form>
        </div>

        <!-- Information Panel -->
        <div class="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-3">Before You Book</h3>
            <ul class="space-y-2 text-base text-gray-900 list-disc list-inside">
                <li>Appointments can only be scheduled for future dates</li>
                <li>You will receive a confirmation after booking</li>
                <li>Please arrive 10 minutes before your appointment time</li>
                <li>Bring your NHS card and any relevant medical documents</li>
            </ul>
        </div>

        <!-- Accessibility Features (NFR3) -->
        <aside class="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-2">Accessibility Features (NFR3)</h2>
            <ul class="space-y-2 text-base text-gray-900">
                <li>✓ High contrast design with 2px borders</li>
                <li>✓ Large, clear typography (minimum 16px)</li>
                <li>✓ Yellow focus indicators for keyboard navigation</li>
                <li>✓ Mobile-first responsive layout</li>
                <li>✓ Semantic HTML with ARIA labels</li>
            </ul>
        </aside>
    </div>
</div>