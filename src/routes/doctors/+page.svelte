<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  let searchQuery = $state('');
  let selectedSpecialty = $state('All');

  let specialties = $derived(['All', ...new Set(data.doctors.map((d: any) => d.specialty))]);

  let filteredDoctors = $derived(data.doctors.filter((d: any) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  }));
</script>

<svelte:head>
  <title>Doctors - HealthConnect</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Our Medical Team</h1>
    <p class="text-gray-600 mt-1">Find the right specialist for your needs</p>
  </div>

  <div class="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search doctors by name or specialty..."
      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
    <select
      bind:value={selectedSpecialty}
      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
      {#each specialties as specialty}
        <option value={specialty}>{specialty}</option>
      {/each}
    </select>
  </div>

  {#if filteredDoctors.length === 0}
    <div class="text-center py-12 text-gray-500">
      <div class="text-5xl mb-4">🔍</div>
      <p class="text-lg">No doctors found matching your search</p>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredDoctors as doctor}
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                {doctor.avatar}
              </div>
              <div class="text-white">
                <h3 class="text-lg font-semibold">{doctor.name}</h3>
                <p class="text-blue-100 text-sm">{doctor.specialty}</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4">{doctor.bio}</p>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>📞</span>
              <span>{doctor.phone}</span>
            </div>
            <div class="flex gap-2">
              <a
                href="/doctors/{doctor.id}"
                class="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm transition-colors"
              >
                View Schedule
              </a>
              <a
                href="/book?doctor={doctor.id}"
                class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
