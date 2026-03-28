<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let sortedAvailability = $derived([...data.availability].sort(
    (a: any, b: any) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
  ));

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
</script>

<svelte:head>
  <title>{data.doctor.name} - HealthConnect</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <a href="/doctors" class="text-blue-600 hover:text-blue-800 text-sm">← Back to Doctors</a>

  <div class="bg-white rounded-xl shadow-md overflow-hidden mt-4 mb-8">
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
      <div class="flex items-center gap-6">
        <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
          {data.doctor.avatar}
        </div>
        <div class="text-white">
          <h1 class="text-2xl font-bold">{data.doctor.name}</h1>
          <p class="text-blue-100 text-lg">{data.doctor.specialty}</p>
          <div class="flex gap-4 mt-2 text-sm text-blue-100">
            <span>📞 {data.doctor.phone}</span>
            <span>✉️ {data.doctor.email}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <p class="text-gray-600">{data.doctor.bio}</p>
      <a
        href="/book?doctor={data.doctor.id}"
        class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Book an Appointment
      </a>
    </div>
  </div>

  <div class="bg-white rounded-xl shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Weekly Availability</h2>

    {#if sortedAvailability.length === 0}
      <p class="text-gray-500 text-center py-8">No availability information provided.</p>
    {:else}
      <div class="space-y-4">
        {#each sortedAvailability as slot}
          <div class="border border-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-800">{slot.day_of_week}</h3>
              <span class="text-sm text-gray-500">{slot.start_time} – {slot.end_time}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each generateTimeSlots(slot.start_time, slot.end_time) as timeSlot}
                <a
                  href="/book?doctor={data.doctor.id}&time={encodeURIComponent(timeSlot)}&day={encodeURIComponent(slot.day_of_week)}"
                  class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm transition-colors border border-blue-200"
                >
                  {timeSlot}
                </a>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
