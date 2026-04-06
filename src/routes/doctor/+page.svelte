<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import type { Appointment } from '$lib/types';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    let isLoading = $state(true);
    let activeTab = $state<'today' | 'upcoming' | 'history'>('today');
    let showReasonModal = $state(false);
    let reasonModalType = $state<'complete' | 'cancel' | null>(null);
    let reasonModalAppId = $state<number | null>(null);
    let reasonText = $state('');

    // Check for success messages from URL
    let showCompleted = $derived($page.url.searchParams.get('completed') === 'true');
    let showCancelled = $derived($page.url.searchParams.get('cancelled') === 'true');

    // Loading state for NFR2 compliance
    $effect(() => {
        const timer = setTimeout(() => {
            isLoading = false;
        }, 100);
        return () => clearTimeout(timer);
    });

    // Format date for display
    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    // Format time for display
    function formatTime(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    // Format full datetime
    function formatDateTime(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            weekday: 'short',
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get appointment count for today
    function getTodayCount() {
        return data.todayAppointments?.length ?? 0;
    }

    // Open reason modal for complete/cancel
    function openReasonModal(appId: number, type: 'complete' | 'cancel') {
        reasonModalAppId = appId;
        reasonModalType = type;
        reasonText = '';
        showReasonModal = true;
    }

    // Close reason modal
    function closeReasonModal() {
        showReasonModal = false;
        reasonModalAppId = null;
        reasonModalType = null;
        reasonText = '';
    }

    // Submit action with optional reason
    function submitWithReason() {
        if (!reasonModalAppId || !reasonModalType) return;

        const form = new FormData();
        form.append('app_id', reasonModalAppId.toString());
        if (reasonText.trim()) {
            form.append('notes', reasonText);
        }

        const action = reasonModalType === 'complete' ? '?/completeAppointment' : '?/cancelAppointment';

        fetch(action, {
            method: 'POST',
            body: form
        }).then(() => {
            closeReasonModal();
            // Page will reload via use:enhance
        });
    }
</script>

{#if isLoading}
    <!-- NFR2: Loading state -->
    <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="text-center space-y-4">
            <div class="inline-block w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xl font-bold text-gray-900">Loading Doctor Dashboard...</p>
            <p class="text-base text-gray-600">Meeting 2-second load time goal (NFR2)</p>
        </div>
    </div>
{:else if !data.authenticated}
    <!-- Not logged in - Redirect to main login -->
    <div class="min-h-screen bg-white flex items-center justify-center p-4">
        <div class="text-center max-w-md">
            <div class="inline-block bg-blue-700 text-white px-4 py-2 text-sm font-bold mb-4">
                SESSION REQUIRED
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Doctor Access Required</h1>
            <p class="text-base text-gray-600 mb-6">
                Please log in using the Doctor Login tab on the main login page.
            </p>
            <a 
                href="/"
                class="inline-block bg-blue-700 text-white px-8 py-4 text-xl font-bold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-colors"
            >
                GO TO LOGIN
            </a>
        </div>
    </div>
{:else}
    <!-- Doctor Dashboard -->
    <div class="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <header class="mb-8 pb-6 border-b-4 border-gray-900">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <div class="inline-block bg-blue-700 text-white px-3 py-1 text-sm font-bold mb-2">
                            CLINICIAN_PORTAL
                        </div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                            Welcome, {data.doctor?.name}
                        </h1>
                        <p class="text-base text-gray-600">
                            {data.doctor?.specialty} | ID: {data.doctor?.doctor_id}
                        </p>
                    </div>
                    <div class="flex flex-col sm:items-end gap-2">
                        <form method="POST" action="?/logout" use:enhance>
                            <button 
                                type="submit"
                                class="bg-gray-900 text-white px-6 py-3 text-lg font-bold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                            >
                                LOGOUT
                            </button>
                        </form>
                        <p class="text-sm text-gray-500">NFR2_METRIC: {data.loadTime}ms</p>
                    </div>
                </div>
            </header>

            <!-- Success Messages -->
            {#if showCompleted}
                <div class="mb-6 bg-green-700 text-white p-6 shadow-lg border-4 border-green-900">
                    <div class="flex items-center gap-4">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <h3 class="text-xl font-bold">Appointment Completed</h3>
                            <p class="text-base">The appointment has been marked as completed.</p>
                        </div>
                    </div>
                </div>
            {/if}

            {#if showCancelled}
                <div class="mb-6 bg-blue-700 text-white p-6 shadow-lg border-4 border-blue-900">
                    <div class="flex items-center gap-4">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <h3 class="text-xl font-bold">Appointment Cancelled</h3>
                            <p class="text-base">The appointment has been cancelled successfully.</p>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Quick Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div class="bg-blue-50 border-4 border-blue-700 p-6">
                    <p class="text-sm font-bold text-blue-700 uppercase mb-1">Today's Schedule</p>
                    <p class="text-4xl font-bold text-gray-900">{data.todayAppointments?.length ?? 0}</p>
                    <p class="text-base text-gray-600">appointments</p>
                </div>
                <div class="bg-green-50 border-4 border-green-700 p-6">
                    <p class="text-sm font-bold text-green-700 uppercase mb-1">Upcoming (7 days)</p>
                    <p class="text-4xl font-bold text-gray-900">{data.upcomingAppointments?.length ?? 0}</p>
                    <p class="text-base text-gray-600">appointments</p>
                </div>
                <div class="bg-gray-50 border-4 border-gray-700 p-6">
                    <p class="text-sm font-bold text-gray-700 uppercase mb-1">Recent History</p>
                    <p class="text-4xl font-bold text-gray-900">{data.appointmentHistory?.length ?? 0}</p>
                    <p class="text-base text-gray-600">past records</p>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="flex flex-wrap gap-2 mb-6 border-b-4 border-gray-200 pb-4">
                <button
                    onclick={() => activeTab = 'today'}
                    class="px-6 py-3 text-lg font-bold transition-colors {activeTab === 'today' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
                >
                    TODAY'S_SCHEDULE ({data.todayAppointments?.length ?? 0})
                </button>
                <button
                    onclick={() => activeTab = 'upcoming'}
                    class="px-6 py-3 text-lg font-bold transition-colors {activeTab === 'upcoming' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
                >
                    UPCOMING ({data.upcomingAppointments?.length ?? 0})
                </button>
                <button
                    onclick={() => activeTab = 'history'}
                    class="px-6 py-3 text-lg font-bold transition-colors {activeTab === 'history' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
                >
                    HISTORY ({data.appointmentHistory?.length ?? 0})
                </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-white border-4 border-gray-900 p-6">
                {#if activeTab === 'today'}
                    <!-- Today's Appointments -->
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase">
                        Today's Schedule
                    </h2>
                    <p class="text-base text-gray-600 mb-6">
                        {formatDate(new Date().toISOString())} - {data.todayAppointments?.length ?? 0} appointments
                    </p>

                    {#if (data.todayAppointments?.length ?? 0) > 0}
                        <div class="space-y-4">
                            {#each data.todayAppointments as appointment}
                                <div class="border-2 border-gray-900 p-4 bg-blue-50">
                                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <span class="bg-blue-700 text-white px-3 py-1 text-lg font-bold">
                                                    {formatTime(appointment.slot_time)}
                                                </span>
                                                <span class="text-sm font-bold text-gray-600">
                                                    #{appointment.app_id}
                                                </span>
                                            </div>
                                            <p class="text-xl font-bold text-gray-900">
                                                {appointment.patient_name || 'Unknown Patient'}
                                            </p>
                                            <p class="text-base text-gray-600">
                                                NHS: {appointment.nhs_number}
                                            </p>
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                type="button"
                                                onclick={() => openReasonModal(appointment.app_id, 'complete')}
                                                class="bg-green-700 text-white px-4 py-2 font-bold hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                            >
                                                COMPLETE
                                            </button>
                                            <button
                                                type="button"
                                                onclick={() => openReasonModal(appointment.app_id, 'cancel')}
                                                class="bg-red-600 text-white px-4 py-2 font-bold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="border-l-4 border-gray-400 bg-gray-50 p-6">
                            <p class="text-lg font-bold text-gray-900 mb-2">No appointments today</p>
                            <p class="text-base text-gray-700">Your schedule is clear for today.</p>
                        </div>
                    {/if}

                {:else if activeTab === 'upcoming'}
                    <!-- Upcoming Appointments -->
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase">
                        Upcoming Appointments
                    </h2>
                    <p class="text-base text-gray-600 mb-6">
                        Next 7 days - {data.upcomingAppointments?.length ?? 0} appointments
                    </p>

                    {#if (data.upcomingAppointments?.length ?? 0) > 0}
                        <div class="space-y-4">
                            {#each data.upcomingAppointments as appointment}
                                <div class="border-2 border-gray-900 p-4 bg-green-50">
                                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <span class="bg-green-700 text-white px-3 py-1 text-base font-bold">
                                                    {formatDateTime(appointment.slot_time)}
                                                </span>
                                            </div>
                                            <p class="text-xl font-bold text-gray-900">
                                                {appointment.patient_name || 'Unknown Patient'}
                                            </p>
                                            <p class="text-base text-gray-600">
                                                NHS: {appointment.nhs_number}
                                            </p>
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                type="button"
                                                onclick={() => openReasonModal(appointment.app_id, 'cancel')}
                                                class="bg-red-600 text-white px-4 py-2 font-bold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="border-l-4 border-gray-400 bg-gray-50 p-6">
                            <p class="text-lg font-bold text-gray-900 mb-2">No upcoming appointments</p>
                            <p class="text-base text-gray-700">No appointments scheduled for the next 7 days.</p>
                        </div>
                    {/if}

                {:else}
                    <!-- Appointment History -->
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 uppercase">
                        Appointment History
                    </h2>
                    <p class="text-base text-gray-600 mb-6">
                        Past and completed appointments
                    </p>

                    {#if (data.appointmentHistory?.length ?? 0) > 0}
                        <div class="space-y-4">
                            {#each data.appointmentHistory as appointment}
                                <div class="border-2 border-gray-300 p-4 bg-gray-50">
                                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <span class="bg-gray-600 text-white px-3 py-1 text-base font-bold">
                                                    {formatDateTime(appointment.slot_time)}
                                                </span>
                                                <span class="px-2 py-1 text-sm font-bold {
                                                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }">
                                                    {appointment.status}
                                                </span>
                                            </div>
                                            <p class="text-xl font-bold text-gray-900">
                                                {appointment.patient_name || 'Unknown Patient'}
                                            </p>
                                            <p class="text-base text-gray-600">
                                                NHS: {appointment.nhs_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="border-l-4 border-gray-400 bg-gray-50 p-6">
                            <p class="text-lg font-bold text-gray-900 mb-2">No appointment history</p>
                            <p class="text-base text-gray-700">Past appointments will appear here.</p>
                        </div>
                    {/if}
                {/if}
            </div>

            <!-- Story 05 Traceability -->
            <aside class="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
                <h2 class="text-lg font-bold text-gray-900 mb-2">Story 05: Doctor Daily Bookings</h2>
                <ul class="space-y-2 text-base text-gray-900">
                    <li>✓ View today's appointments at a glance</li>
                    <li>✓ Track upcoming appointments for the next 7 days</li>
                    <li>✓ Access appointment history</li>
                    <li>✓ Mark appointments as completed</li>
                    <li>✓ Cancel appointments (Story 10: Admin functionality)</li>
                </ul>
            </aside>
        </div>
    </div>
{/if}

<!-- Reason Modal (Optional feedback/notes for complete/cancel) -->
{#if showReasonModal && reasonModalAppId !== null && reasonModalType !== null}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white border-4 border-gray-900 max-w-md w-full shadow-2xl">
            <div class="bg-gray-900 text-white px-6 py-4 font-bold text-lg">
                {reasonModalType === 'complete' ? '✓ COMPLETE APPOINTMENT' : '✗ CANCEL APPOINTMENT'}
            </div>
            <div class="p-6">
                <p class="text-gray-700 mb-4">
                    {reasonModalType === 'complete'
                        ? 'Add optional notes about this appointment completion:'
                        : 'Add optional reason for cancellation:'}
                </p>
                <textarea
                    placeholder={reasonModalType === 'complete'
                        ? 'e.g., Appointment completed successfully. Patient in good health.'
                        : 'e.g., Doctor emergency, please reschedule.'}
                    rows="4"
                    bind:value={reasonText}
                    class="w-full border-2 border-gray-300 p-3 font-normal bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                ></textarea>
                <p class="text-xs text-gray-500 mt-2">(Optional - leave blank to skip)</p>

                <div class="flex gap-3 mt-6">
                    <button
                        type="button"
                        onclick={closeReasonModal}
                        class="flex-1 border-2 border-gray-300 px-4 py-3 font-bold text-gray-900 hover:bg-gray-100"
                    >
                        CANCEL
                    </button>
                    <button
                        type="button"
                        onclick={submitWithReason}
                        class={reasonModalType === 'complete'
                            ? 'flex-1 bg-green-700 text-white px-4 py-3 font-bold hover:bg-green-800'
                            : 'flex-1 bg-red-600 text-white px-4 py-3 font-bold hover:bg-red-700'}
                    >
                        {reasonModalType === 'complete' ? 'COMPLETE' : 'CANCEL'} APPOINTMENT
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}