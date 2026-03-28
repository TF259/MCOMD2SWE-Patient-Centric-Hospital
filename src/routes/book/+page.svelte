<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { page } from '$app/stores';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let selectedDoctorId = $state($page.url.searchParams.get('doctor') ?? '');
  let selectedDate = $state('');
  let selectedTime = $state($page.url.searchParams.get('time') ?? '');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let selectedDoctor = $derived(data.doctors.find((d: any) => d.id.toString() === selectedDoctorId));

  let availableSlots = $derived((() => {
    if (!selectedDate || !selectedDoctor) return [];
    const dayOfWeek = dayNames[new Date(selectedDate + 'T00:00:00').getDay()];
    const doctorAvailability = data.availability.filter(
      (a: any) => a.doctor_id.toString() === selectedDoctorId && a.day_of_week === dayOfWeek
    );
    return doctorAvailability.flatMap((slot: any) => generateTimeSlots(slot.start_time, slot.end_time));
  })());

  function generateTimeSlots(start: string, end: string): string[] {
    const slots: string[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    while (currentMinutes + 30 <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      slots.push(`${displayH}:${m.toString().padStart(2, '0')} ${period}`);
      currentMinutes += 30;
    }
    return slots;
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
</script>

<svelte:head>
  <title>Book Appointment - HealthConnect</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Book an Appointment</h1>
    <p class="text-gray-600 mt-1">Schedule a visit with one of our specialists</p>
  </div>

  {#if !data.patient}
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
      <div class="text-5xl mb-4">🔒</div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Sign In Required</h2>
      <p class="text-gray-600 mb-6">Please sign in or create an account to book an appointment.</p>
      <div class="flex justify-center gap-4">
        <a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Sign In
        </a>
        <a href="/register" class="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
          Register
        </a>
      </div>
    </div>
  {:else}
    {#if form?.success}
      <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center mb-8">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Appointment Booked!</h2>
        <p class="text-gray-600 mb-4">Your appointment has been successfully scheduled.</p>
        <div class="bg-white rounded-lg p-4 text-left mb-6 max-w-sm mx-auto">
          <p class="text-sm text-gray-600"><strong>Doctor:</strong> {form.doctorName}</p>
          <p class="text-sm text-gray-600"><strong>Date:</strong> {form.date}</p>
          <p class="text-sm text-gray-600"><strong>Time:</strong> {form.time}</p>
        </div>
        <div class="flex justify-center gap-4">
          <a href="/appointments" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors">
            View Appointments
          </a>
          <a href="/book" class="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm transition-colors">
            Book Another
          </a>
        </div>
      </div>
    {/if}

    {#if form?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
        {form.error}
      </div>
    {/if}

    {#if !form?.success}
      <div class="bg-white rounded-xl shadow-md p-8">
        <form method="POST" use:enhance>
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">1. Select a Doctor</h2>
            <div class="grid md:grid-cols-2 gap-3">
              {#each data.doctors as doctor}
                <label class="cursor-pointer">
                  <input
                    type="radio"
                    name="doctorId"
                    value={doctor.id}
                    bind:group={selectedDoctorId}
                    class="sr-only"
                  />
                  <div class="border-2 rounded-lg p-4 transition-colors {selectedDoctorId === doctor.id.toString() ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {doctor.avatar}
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">{doctor.name}</p>
                        <p class="text-sm text-blue-600">{doctor.specialty}</p>
                      </div>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">2. Select a Date</h2>
            <input
              type="date"
              name="date"
              bind:value={selectedDate}
              min={today}
              max={maxDate}
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {#if selectedDoctor && selectedDate}
              {@const dayOfWeek = dayNames[new Date(selectedDate + 'T00:00:00').getDay()]}
              {@const hasSlots = data.availability.some((a: any) => a.doctor_id.toString() === selectedDoctorId && a.day_of_week === dayOfWeek)}
              {#if !hasSlots}
                <p class="mt-2 text-orange-600 text-sm">
                  ⚠️ {selectedDoctor.name} is not available on {dayOfWeek}s. Please select a different date.
                </p>
              {/if}
            {/if}
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">3. Select a Time Slot</h2>
            {#if !selectedDoctorId || !selectedDate}
              <p class="text-gray-500 text-sm">Please select a doctor and date first</p>
            {:else if availableSlots.length === 0}
              <p class="text-orange-600 text-sm">No available slots for this date</p>
            {:else}
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {#each availableSlots as slot}
                  <label class="cursor-pointer">
                    <input type="radio" name="time" value={slot} bind:group={selectedTime} class="sr-only" />
                    <div class="text-center py-2 px-3 border-2 rounded-lg text-sm transition-colors {selectedTime === slot ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 hover:border-blue-300 text-gray-700'}">
                      {slot}
                    </div>
                  </label>
                {/each}
              </div>
            {/if}
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">4. Reason for Visit (Optional)</h2>
            <textarea
              name="reason"
              rows="3"
              placeholder="Briefly describe your reason for the visit..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            >{form?.reason ?? ''}</textarea>
          </div>

          <button
            type="submit"
            disabled={!selectedDoctorId || !selectedDate || !selectedTime}
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    {/if}
  {/if}
</div>
