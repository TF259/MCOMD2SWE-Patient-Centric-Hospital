<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  let activeTab = $state('upcoming');

  let upcomingAppointments = $derived(data.appointments.filter((a: any) => a.status === 'scheduled'));
  let pastAppointments = $derived(data.appointments.filter((a: any) => a.status !== 'scheduled'));

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
</script>

<svelte:head>
  <title>My Appointments - HealthConnect</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">My Appointments</h1>
      <p class="text-gray-600 mt-1">View and manage your scheduled appointments</p>
    </div>
    <a href="/book" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
      + Book New
    </a>
  </div>

  <div class="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
    <button
      onclick={() => activeTab = 'upcoming'}
      class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors {activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      Upcoming ({upcomingAppointments.length})
    </button>
    <button
      onclick={() => activeTab = 'past'}
      class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors {activeTab === 'past' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      Past ({pastAppointments.length})
    </button>
  </div>

  {#if activeTab === 'upcoming'}
    {#if upcomingAppointments.length === 0}
      <div class="text-center py-16 bg-white rounded-xl shadow-sm">
        <div class="text-5xl mb-4">📅</div>
        <p class="text-lg font-medium text-gray-700">No upcoming appointments</p>
        <p class="text-sm text-gray-500 mt-1">Book a new appointment to get started</p>
        <a href="/book" class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors">
          Book Appointment
        </a>
      </div>
    {:else}
      <div class="space-y-4">
        {#each upcomingAppointments as appt}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  {appt.doctor_avatar}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{appt.doctor_name}</h3>
                  <p class="text-blue-600 text-sm">{appt.specialty}</p>
                  <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                    <span>📅 {formatDate(appt.date)}</span>
                    <span>⏰ {appt.time}</span>
                  </div>
                  {#if appt.reason}
                    <p class="text-sm text-gray-500 mt-1">📋 {appt.reason}</p>
                  {/if}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium {statusColors[appt.status] ?? 'bg-gray-100 text-gray-800'}">
                  {appt.status}
                </span>
                <form method="POST" action="/appointments/{appt.id}/cancel">
                  <button class="text-sm text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    {#if pastAppointments.length === 0}
      <div class="text-center py-16 bg-white rounded-xl shadow-sm">
        <div class="text-5xl mb-4">📋</div>
        <p class="text-lg font-medium text-gray-700">No past appointments</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each pastAppointments as appt}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-80">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                  {appt.doctor_avatar}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{appt.doctor_name}</h3>
                  <p class="text-gray-500 text-sm">{appt.specialty}</p>
                  <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>📅 {formatDate(appt.date)}</span>
                    <span>⏰ {appt.time}</span>
                  </div>
                  {#if appt.reason}
                    <p class="text-sm text-gray-400 mt-1">📋 {appt.reason}</p>
                  {/if}
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium self-start {statusColors[appt.status] ?? 'bg-gray-100 text-gray-800'}">
                {appt.status}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
