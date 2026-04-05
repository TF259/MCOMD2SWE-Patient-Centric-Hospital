<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    
    let { data }: { data: PageData } = $props();
    let selectedRecord = $state<any>(null);

    // Check for success/cancelled message from URL
    let showSuccess = $derived($page.url.searchParams.get('success') === 'true');
    let showCancelled = $derived($page.url.searchParams.get('cancelled') === 'true');

    // Format date for display
    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Format slot time
    function formatSlotTime(slotTime: string) {
        const date = new Date(slotTime.replace(' ', 'T'));
        return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    // Open record and log view (T14 GDPR compliance)
    function viewRecordDetail(record: any) {
        selectedRecord = record;
        
        // Log the record view via form action
        const formData = new FormData();
        formData.append('record_id', record.record_id.toString());
        fetch('?/viewRecord', {
            method: 'POST',
            body: formData
        });
    }
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Header matching wireframe exactly -->
    <header class="bg-white border-b-4 border-gray-900 px-6 py-6">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-400 mb-1">ARCH_TYPE: CENTRAL_CONTROLLER</p>
                    <h1 class="text-3xl font-bold text-gray-900">PATIENT_DASHBOARD</h1>
                    <p class="text-sm text-gray-500 mt-1">[ VIEW: /dashboard/{data.nhs_number} ]</p>
                </div>
                <form method="POST" action="?/logout" use:enhance>
                    <button 
                        type="submit"
                        class="border-2 border-gray-900 px-4 py-2 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        FUNC: CLEAR_SESSION
                    </button>
                </form>
            </div>
        </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
        <!-- Success/Cancelled Banners -->
        {#if showSuccess}
            <div class="mb-6 bg-green-700 text-white p-4 flex items-center gap-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="font-bold">Appointment confirmed successfully</span>
            </div>
        {/if}

        {#if showCancelled}
            <div class="mb-6 bg-blue-700 text-white p-4">
                <span class="font-bold">Appointment cancelled</span>
            </div>
        {/if}

        <!-- Two-column module layout matching wireframe -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- ACT_SCHEDULING_ENGINE Module -->
            <section class="border-2 border-gray-900 bg-white">
                <div class="bg-gray-900 text-white px-4 py-2 text-sm font-bold">
                    MODULE: FR2/FR3
                </div>
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">ACT_SCHEDULING_ENGINE</h2>
                    <p class="text-sm text-gray-600 mb-1">Logic: Fetch DOCTOR.availability_json.</p>
                    <p class="text-sm text-gray-600 mb-6">State: Real-time Slot Ticker.</p>

                    <!-- Doctor List with Book buttons -->
                    <div class="space-y-3 mb-6">
                        {#each data.doctors.slice(0, 4) as doctor}
                            <div class="flex items-center justify-between p-3 border border-gray-200 hover:border-gray-900 transition-colors">
                                <div>
                                    <p class="font-bold text-gray-900">{doctor.name}</p>
                                    <p class="text-sm text-gray-500">{doctor.specialty}</p>
                                </div>
                                <a 
                                    href="/booking?doctor={doctor.doctor_id}"
                                    class="bg-gray-900 text-white px-4 py-2 text-sm font-bold hover:bg-gray-800"
                                >
                                    BOOK →
                                </a>
                            </div>
                        {/each}
                    </div>

                    <a 
                        href="/booking" 
                        class="block w-full text-center border-2 border-gray-900 py-3 font-bold hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        VIEW ALL DOCTORS →
                    </a>

                    <!-- Current Appointments -->
                    {#if data.appointments.length > 0}
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <h3 class="font-bold text-gray-900 mb-3">Your Appointments</h3>
                            {#each data.appointments as appointment}
                                <div class="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-600 mb-2">
                                    <div>
                                        <p class="text-sm font-bold">{appointment.doctor_id}</p>
                                        <p class="text-sm text-gray-600">{formatSlotTime(appointment.slot_time)}</p>
                                    </div>
                                    {#if appointment.status === 'Active'}
                                        <form method="POST" action="?/cancelAppointment" use:enhance>
                                            <input type="hidden" name="app_id" value={appointment.app_id} />
                                            <button 
                                                type="submit"
                                                class="bg-red-600 text-white px-3 py-1 text-xs font-bold hover:bg-red-700"
                                                onclick={(e) => { if (!confirm('Cancel?')) e.preventDefault(); }}
                                            >
                                                CANCEL
                                            </button>
                                        </form>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>

            <!-- ACT_RECORD_FETCHER Module -->
            <section class="border-2 border-gray-900 bg-white">
                <div class="bg-gray-900 text-white px-4 py-2 text-sm font-bold">
                    MODULE: FR4
                </div>
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">ACT_RECORD_FETCHER</h2>
                    <p class="text-sm text-gray-600 mb-1">Logic: SQL Join(Patient, Medical_Record).</p>
                    <p class="text-sm text-gray-600 mb-6">Constraint: Read-Only Grid.</p>

                    {#if data.medicalRecords.length > 0}
                        <div class="space-y-3">
                            {#each data.medicalRecords as record}
                                <article class="p-4 border border-gray-200 hover:border-gray-900 transition-colors">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="font-bold text-gray-900">Record #{record.record_id}</span>
                                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1">
                                            {formatDate(record.entry_date)}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-2">Doctor: {record.doctor_id}</p>
                                    <p class="text-sm text-gray-800 line-clamp-2">{record.notes}</p>
                                    <button 
                                        onclick={() => viewRecordDetail(record)}
                                        class="mt-3 text-sm font-bold text-gray-900 underline hover:no-underline"
                                    >
                                        VIEW DETAILS →
                                    </button>
                                </article>
                            {/each}
                        </div>
                    {:else}
                        <div class="text-center py-8 text-gray-500">
                            <p>No medical records found</p>
                        </div>
                    {/if}
                </div>
            </section>
        </div>

        <!-- Backlog Traceability matching wireframe -->
        <aside class="mt-8 border-2 border-dashed border-gray-300 p-6 bg-white">
            <p class="text-sm font-bold text-gray-400 mb-3">BACKLOG_TRACEABILITY:</p>
            <ul class="text-sm text-gray-500 space-y-1">
                <li>- Story 01: Secure authentication check per session.</li>
                <li>- Story 02: Reactive load for availability display.</li>
                <li>- NFR3: High-contrast accessibility design.</li>
            </ul>
        </aside>
    </main>
</div>

<!-- Record Detail Modal -->
{#if selectedRecord}
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div class="bg-white border-4 border-gray-900 p-6 max-w-lg w-full">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-xl font-bold">Record #{selectedRecord.record_id}</h2>
                <button onclick={() => selectedRecord = null} class="text-2xl font-bold hover:text-red-600">×</button>
            </div>
            <p class="text-sm text-gray-600 mb-1">Date: {formatDate(selectedRecord.entry_date)}</p>
            <p class="text-sm text-gray-600 mb-4">Doctor: {selectedRecord.doctor_id}</p>
            <div class="bg-gray-50 border-l-4 border-blue-600 p-4 mb-4">
                <p class="text-gray-900">{selectedRecord.notes}</p>
            </div>
            <p class="text-xs text-gray-400 mb-4">T14: This view has been logged for GDPR compliance</p>
            <button 
                onclick={() => selectedRecord = null} 
                class="w-full bg-gray-900 text-white py-3 font-bold hover:bg-gray-800"
            >
                CLOSE
            </button>
        </div>
    </div>
{/if}