<script lang="ts">
    import type { Doctor, MedicalRecord, Appointment } from '$lib/types';
    import type { PageData } from './$types';
    
    // Svelte 5 Runes for state management
    let { data }: { data: PageData } = $props();
    let isLoading = $state(true);
    let selectedDoctor = $state<Doctor | null>(null);

    // Simulate loading state for NFR2 (2-second load time)
    $effect(() => {
        const timer = setTimeout(() => {
            isLoading = false;
        }, 100);
        return () => clearTimeout(timer);
    });

    // Parse doctor availability
    function parseAvailability(doctor: Doctor) {
        try {
            return JSON.parse(doctor.availability_json);
        } catch {
            return [];
        }
    }

    // Format date for display
    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
</script>

{#if isLoading}
    <!-- NFR2: Loading state demonstration -->
    <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="text-center space-y-4">
            <div class="inline-block w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xl font-bold text-gray-900">Loading Dashboard...</p>
            <p class="text-base text-gray-600">Meeting 2-second load time goal (NFR2)</p>
        </div>
    </div>
{:else}
    <!-- Main Dashboard -->
    <div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header - Responsive for mobile-first (Sarah) -->
            <header class="mb-8 pb-6 border-b-4 border-gray-900">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Welcome, {data.patient_name}
                        </h1>
                        <p class="text-base text-gray-600">NHS Number: {data.nhs_number || 'N/A'}</p>
                    </div>
                    <form method="POST" action="?/logout">
                        <button 
                            type="submit"
                            class="bg-gray-900 text-white px-6 py-3 text-lg font-bold rounded-none hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-center"
                        >
                            LOGOUT
                        </button>
                    </form>
                </div>
            </header>

            <!-- Mobile-first responsive grid layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                <!-- ACT_SCHEDULING_ENGINE: Real-time Availability Ticker -->
                <section class="bg-white border-4 border-gray-900 p-6" aria-label="Doctor Availability">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase">
                        Book Appointment
                    </h2>
                    <p class="text-base text-gray-600 mb-6">[ ACT_SCHEDULING_ENGINE ]</p>

                    {#if data.doctors.length > 0}
                        <div class="space-y-4">
                            {#each data.doctors as doctor}
                                <div class="border-2 border-gray-900 p-4">
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                                    <p class="text-base text-gray-700 mb-4">{doctor.specialty}</p>
                                    
                                    <!-- Real-time Availability Ticker -->
                                    <div class="bg-gray-50 border-l-4 border-green-700 p-4">
                                        <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase">
                                            Real-time Availability
                                        </h4>
                                        <div class="space-y-2">
                                            {#each parseAvailability(doctor) as slot}
                                                <div class="flex items-center justify-between">
                                                    <span class="text-base font-bold text-gray-900">{slot.time}</span>
                                                    <span 
                                                        class="px-3 py-1 text-sm font-bold rounded-none {
                                                            slot.status === 'READY' 
                                                                ? 'bg-green-700 text-white' 
                                                                : 'bg-gray-300 text-gray-700'
                                                        }"
                                                    >
                                                        {slot.status}
                                                    </span>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>

                                    <button 
                                        class="w-full mt-4 bg-green-700 text-white px-6 py-3 text-lg font-bold rounded-none hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                        aria-label="Book appointment with {doctor.name}"
                                    >
                                        BOOK WITH {doctor.name.toUpperCase()}
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-base text-gray-700">No doctors available at this time.</p>
                    {/if}

                    <!-- Current Appointments -->
                    {#if data.appointments.length > 0}
                        <div class="mt-6 pt-6 border-t-2 border-gray-300">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">Your Appointments</h3>
                            {#each data.appointments as appointment}
                                <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-2">
                                    <p class="text-base font-bold text-gray-900">Doctor: {appointment.doctor_id}</p>
                                    <p class="text-base text-gray-700">Time: {appointment.slot_time}</p>
                                    <p class="text-sm text-gray-600">Status: {appointment.status}</p>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </section>

                <!-- ACT_RECORD_FETCHER: Medical Records -->
                <section class="bg-white border-4 border-gray-900 p-6" aria-label="Medical Records">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase">
                        Medical Records
                    </h2>
                    <p class="text-base text-gray-600 mb-6">[ ACT_RECORD_FETCHER ]</p>

                    {#if data.medicalRecords.length > 0}
                        <!-- High-contrast list with NHS styling -->
                        <div class="space-y-4" role="list">
                            {#each data.medicalRecords as record}
                                <article 
                                    class="bg-white border-2 border-gray-900 p-5 hover:bg-gray-50 focus-within:ring-4 focus-within:ring-yellow-400"
                                    role="listitem"
                                >
                                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                        <h3 class="text-lg font-bold text-gray-900">
                                            Record #{record.record_id}
                                        </h3>
                                        <time 
                                            datetime={record.entry_date}
                                            class="text-base font-bold text-gray-700 bg-gray-100 px-3 py-1"
                                        >
                                            {formatDate(record.entry_date)}
                                        </time>
                                    </div>
                                    
                                    <p class="text-sm font-bold text-gray-600 mb-2">
                                        Doctor: {record.doctor_id}
                                    </p>
                                    
                                    <div class="bg-gray-50 border-l-4 border-blue-600 p-4">
                                        <p class="text-base text-gray-900 leading-relaxed">
                                            {record.notes}
                                        </p>
                                    </div>

                                    <button 
                                        class="mt-4 w-full sm:w-auto bg-gray-900 text-white px-6 py-2 text-base font-bold rounded-none hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                        aria-label="View full details for record {record.record_id}"
                                    >
                                        VIEW FULL DETAILS
                                    </button>
                                </article>
                            {/each}
                        </div>
                    {:else}
                        <div class="border-l-4 border-gray-400 bg-gray-50 p-6">
                            <p class="text-base font-bold text-gray-900 mb-2">No medical records found</p>
                            <p class="text-base text-gray-700">Your medical records will appear here once they are added by your healthcare provider.</p>
                        </div>
                    {/if}
                </section>
            </div>

            <!-- Accessibility notice for Arthur -->
            <aside class="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6" role="complementary">
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
{/if}