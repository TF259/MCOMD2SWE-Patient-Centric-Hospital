<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Not provided';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatAppointmentDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
</script>

<svelte:head>
  <title>Dashboard - HealthConnect</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Welcome back, {data.patient.name}!</h1>
    <p class="text-gray-600 mt-1">Manage your health appointments and profile</p>
  </div>

  <div class="grid lg:grid-cols-3 gap-8">
    <div class="lg:col-span-1">
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">My Profile</h2>
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
            {data.patient.name.charAt(0)}
          </div>
          <h3 class="mt-3 font-semibold text-gray-800">{data.patient.name}</h3>
          <p class="text-gray-500 text-sm">{data.patient.email}</p>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex items-start gap-3">
            <span class="text-gray-400 w-5">📅</span>
            <div>
              <p class="text-gray-500 text-xs">Date of Birth</p>
              <p class="text-gray-800">{formatDate(data.patient.dob)}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-gray-400 w-5">📞</span>
            <div>
              <p class="text-gray-500 text-xs">Phone</p>
              <p class="text-gray-800">{data.patient.phone ?? 'Not provided'}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-gray-400 w-5">🏠</span>
            <div>
              <p class="text-gray-500 text-xs">Address</p>
              <p class="text-gray-800">{data.patient.address ?? 'Not provided'}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-gray-400 w-5">🗓️</span>
            <div>
              <p class="text-gray-500 text-xs">Member Since</p>
              <p class="text-gray-800">{formatDate(data.patient.created_at)}</p>
            </div>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <a href="/dashboard/profile" class="block text-center w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg text-sm transition-colors">
            Edit Profile
          </a>
          <a href="/book" class="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            Book Appointment
          </a>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{data.appointments.filter((a: any) => a.status === 'scheduled').length}</div>
            <div class="text-xs text-gray-600 mt-1">Upcoming</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600">{data.appointments.filter((a: any) => a.status === 'completed').length}</div>
            <div class="text-xs text-gray-600 mt-1">Completed</div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-2">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-800">My Appointments</h2>
          <a href="/appointments" class="text-blue-600 hover:text-blue-800 text-sm">View All</a>
        </div>

        {#if data.appointments.length === 0}
          <div class="text-center py-12 text-gray-500">
            <div class="text-5xl mb-4">📋</div>
            <p class="text-lg font-medium">No appointments yet</p>
            <p class="text-sm mt-1">Book your first appointment to get started</p>
            <a href="/book" class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors">
              Book Now
            </a>
          </div>
        {:else}
          <div class="space-y-4">
            {#each data.appointments.slice(0, 5) as appt}
              <div class="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-800">{appt.doctor_name}</h3>
                    <p class="text-sm text-blue-600">{appt.specialty}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>📅 {formatAppointmentDate(appt.date)}</span>
                      <span>⏰ {appt.time}</span>
                    </div>
                    {#if appt.reason}
                      <p class="text-sm text-gray-500 mt-1">Reason: {appt.reason}</p>
                    {/if}
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <span class="px-2 py-1 rounded-full text-xs font-medium {statusColors[appt.status] ?? 'bg-gray-100 text-gray-800'}">
                      {appt.status}
                    </span>
                    {#if appt.status === 'scheduled'}
                      <form method="POST" action="/appointments/{appt.id}/cancel">
                        <button class="text-xs text-red-600 hover:text-red-800">Cancel</button>
                      </form>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
