<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import PageLoadingIndicator from '$lib/components/PageLoadingIndicator.svelte';

    let { data, form }: { data: PageData; form: any } = $props();

    // Local state
    let selectedSlot = $state('');
    let selectedDate = $state(data.selectedDate);

    // Sync selectedDate with data.selectedDate when it changes
    $effect(() => {
        selectedDate = data.selectedDate;
    });

    // Handle specialty filter change
    function handleSpecialtyChange(e: Event) {
        const value = (e.target as HTMLSelectElement).value;
        const params = new URLSearchParams();
        if (value) params.set('specialty', value);
        goto(`/booking?${params.toString()}`);
    }

    // Handle doctor selection
    function handleDoctorChange(e: Event) {
        const value = (e.target as HTMLSelectElement).value;
        const params = new URLSearchParams();
        if (data.selectedSpecialty) params.set('specialty', data.selectedSpecialty);
        if (value) params.set('doctor', value);
        goto(`/booking?${params.toString()}`);
    }

    // Handle date change
    function handleDateChange(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        const params = new URLSearchParams();
        if (data.selectedSpecialty) params.set('specialty', data.selectedSpecialty);
        if (data.selectedDoctorId) params.set('doctor', data.selectedDoctorId);
        if (value) params.set('date', value);
        goto(`/booking?${params.toString()}`);
    }

    // Get minimum date (today)
    function getMinDate(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Format date for display
    function formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Auto-select first available slot
    let firstAvailable = $derived.by(() => {
        if (data.availability.length > 0) {
            return data.availability.find(s => s.status !== 'BOOKED')?.datetime || '';
        }
        return '';
    });

    // Set selectedSlot to first available when it changes
    $effect(() => {
        if (firstAvailable) {
            selectedSlot = firstAvailable;
        }
    });
</script>

<!-- Page Loading Indicator -->
<PageLoadingIndicator />

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-gray-900 text-white px-6 py-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
            <div>
                <span class="text-sm text-gray-400">MODULE:</span>
                <span class="font-bold ml-2">REACTIVE_BOOKING_V2</span>
            </div>
            <a href="/dashboard" class="border border-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-gray-900 transition-colors">
                ← BACK TO DASHBOARD
            </a>
        </div>
    </header>

    <main class="max-w-4xl mx-auto p-6">
        <!-- Two-column filter section matching wireframe -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Specialty Filter -->
            <div class="border-2 border-gray-300 bg-white p-4">
                <p class="text-xs text-gray-500 mb-1">ENTITY_REF: DOCTOR.SPECIALTY</p>
                <select 
                    value={data.selectedSpecialty}
                    onchange={handleSpecialtyChange}
                    class="w-full border-2 border-gray-900 p-3 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    <option value="">[ SELECT_FILTER: ALL SPECIALTIES ]</option>
                    {#each data.specialties as specialty}
                        <option value={specialty}>{specialty.toUpperCase()}</option>
                    {/each}
                </select>
            </div>

            <!-- Appointment Booking Guidelines -->
            <div class="border-2 border-gray-300 bg-white p-4">
                <p class="text-xs text-gray-500 mb-2">YOUR APPOINTMENT INFORMATION</p>
                <div class="space-y-2 text-sm text-gray-700">
                    <div>
                        <p class="font-bold text-gray-900">✓ Appointment Times</p>
                        <p class="text-gray-600">Morning: 09:00 - 12:00 | Afternoon: 14:00 - 17:00</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">✗ Lunch Break</p>
                        <p class="text-gray-600">12:00 - 14:00 (Unavailable for all doctors)</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">📅 Future Dates Only</p>
                        <p class="text-gray-600">Appointments can only be booked for today onwards</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Doctor Selection -->
        {#if data.doctors.length > 0}
            <div class="border-2 border-gray-300 bg-white p-4 mb-6">
                <label class="block text-sm font-bold text-gray-700 mb-2">SELECT DOCTOR</label>
                <select 
                    value={data.selectedDoctorId}
                    onchange={handleDoctorChange}
                    class="w-full border-2 border-gray-900 p-3 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    <option value="">-- Choose a doctor --</option>
                    {#each data.doctors as doctor}
                        <option value={doctor.doctor_id}>
                            {doctor.name} ({doctor.specialty})
                        </option>
                    {/each}
                </select>
            </div>
        {:else}
            <div class="border-2 border-gray-300 bg-white p-6 mb-6 text-center">
                <p class="text-gray-600">No doctors available for selected specialty</p>
            </div>
        {/if}

        <!-- Date Selection (only show when doctor selected) -->
        {#if data.selectedDoctorId}
            <div class="border-2 border-gray-300 bg-white p-4 mb-6">
                <label class="block text-sm font-bold text-gray-700 mb-2">SELECT DATE</label>
                <input
                    type="date"
                    bind:value={selectedDate}
                    onchange={handleDateChange}
                    min={getMinDate()}
                    class="w-full border-2 border-gray-900 p-3 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {#if selectedDate}
                    <p class="text-sm text-gray-600 mt-2">{formatDate(selectedDate)}</p>
                {/if}
            </div>
        {/if}

        <!-- Slot Grid (only show when doctor and date selected) -->
        {#if data.selectedDoctorId && data.selectedDate && data.availability.length > 0}
            <form method="POST" action="?/createAppointment" use:enhance>
                <input type="hidden" name="doctor_id" value={data.selectedDoctorId} />

                <!-- Next Available Hint (moved up and highlighted) -->
                {#if data.nextAvailable}
                    <div class="mb-6 bg-green-100 border-2 border-green-600 p-4">
                        <p class="text-sm font-bold text-green-900">💡 Suggestion: First available slot</p>
                        <p class="text-base text-green-800 font-bold mt-1">{data.nextAvailable.date} at {data.nextAvailable.time}</p>
                        <p class="text-xs text-green-700 mt-2">This slot will be pre-selected below</p>
                    </div>
                {/if}

                <div class="mb-6">
                    <p class="text-sm font-bold text-gray-700 mb-4">AVAILABLE SLOTS FOR {formatDate(data.selectedDate).toUpperCase()}</p>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {#each data.availability as slot}
                            <label class="relative cursor-pointer {slot.status === 'BOOKED' ? 'cursor-not-allowed' : ''}">
                                <input 
                                    type="radio" 
                                    name="slot_datetime" 
                                    value={slot.datetime}
                                    required
                                    disabled={slot.status === 'BOOKED'}
                                    bind:group={selectedSlot}
                                    class="sr-only peer"
                                />
                                <div class="p-4 text-center border-2 transition-all
                                    {slot.status === 'BOOKED' 
                                        ? 'bg-gray-100 border-gray-200 text-gray-400' 
                                        : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 peer-checked:bg-green-700 peer-checked:border-green-700'
                                    }
                                    peer-focus:ring-4 peer-focus:ring-yellow-400"
                                >
                                    <span class="text-xl font-bold block">{slot.time}</span>
                                    <span class="text-xs block mt-1">STATE: {slot.status}</span>
                                </div>
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Reason for Visit Field (Story 03 - Patient Chief Complaint Capture) -->
                <div class="border-2 border-gray-300 bg-white p-4 mb-6">
                    <label for="reason_for_visit" class="block text-sm font-bold text-gray-700 mb-2">
                        Reason for Visit (Optional)
                    </label>
                    <textarea
                        id="reason_for_visit"
                        name="reason_for_visit"
                        rows="3"
                        placeholder="e.g., Persistent cough, annual check-up, follow-up appointment"
                        class="w-full border-2 border-gray-300 p-3 font-normal bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Briefly describe your chief complaint or reason for this appointment</p>
                </div>

                <!-- Acceptance Criteria -->
                <div class="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-6">
                    <p class="text-xs font-bold text-gray-500 mb-1">ACCEPTANCE_CRITERIA_CHECK</p>
                    <p class="text-sm text-gray-700">
                        Validation: If (Doctor && Date && Slot) == NULL → Disable(Book_Button)
                    </p>
                </div>

                <!-- Error Message -->
                {#if form?.error}
                    <div class="border-l-4 border-red-600 bg-red-50 p-4 mb-6">
                        <p class="font-bold text-red-900">{form.error}</p>
                    </div>
                {/if}

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    disabled={!selectedSlot}
                    class="w-full bg-gray-900 text-white px-6 py-4 text-lg font-bold 
                           hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 
                           disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    TRIGGER: CREATE_APPOINTMENT_ENTRY (STATUS=ACTIVE)
                </button>
            </form>
        {:else if data.selectedDoctorId && !data.selectedDate}
            <div class="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                <p>Select a date to view available time slots</p>
            </div>
        {:else if !data.selectedDoctorId}
            <div class="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                <p>Select a doctor to continue booking</p>
            </div>
        {/if}
    </main>
</div>