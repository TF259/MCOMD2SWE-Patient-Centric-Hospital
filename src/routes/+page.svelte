<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>HealthConnect - Patient-Centric Hospital Management</title>
</svelte:head>

<section class="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-24">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <h1 class="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
    <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
      Book appointments, view doctor availability, and manage your health records — all in one place.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      {#if data.patient}
        <a href="/book" class="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Book an Appointment
        </a>
        <a href="/dashboard" class="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Go to Dashboard
        </a>
      {:else}
        <a href="/register" class="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Get Started
        </a>
        <a href="/login" class="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Sign In
        </a>
      {/if}
    </div>
  </div>
</section>

<section class="py-20 max-w-7xl mx-auto px-4">
  <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Everything You Need</h2>
  <div class="grid md:grid-cols-3 gap-8">
    <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
      <div class="text-5xl mb-4">🔒</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Secure Patient Portal</h3>
      <p class="text-gray-600">Access your medical history, appointments, and personal health records securely from anywhere.</p>
    </div>
    <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
      <div class="text-5xl mb-4">📅</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Doctor Availability</h3>
      <p class="text-gray-600">View real-time doctor schedules and find the perfect time slot that works for you.</p>
    </div>
    <div class="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
      <div class="text-5xl mb-4">⚡</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Instant Booking</h3>
      <p class="text-gray-600">Book, reschedule, or cancel appointments instantly with real-time confirmation.</p>
    </div>
  </div>
</section>

<section class="bg-blue-50 py-16">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-4xl font-bold text-blue-700">50+</div>
        <div class="text-gray-600 mt-1">Specialist Doctors</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-700">10K+</div>
        <div class="text-gray-600 mt-1">Patients Served</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-700">24/7</div>
        <div class="text-gray-600 mt-1">Online Booking</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-700">15+</div>
        <div class="text-gray-600 mt-1">Specialties</div>
      </div>
    </div>
  </div>
</section>

<section class="py-20 max-w-7xl mx-auto px-4">
  <div class="flex items-center justify-between mb-8">
    <h2 class="text-3xl font-bold text-gray-800">Our Specialists</h2>
    <a href="/doctors" class="text-blue-600 hover:text-blue-800 font-medium">View All →</a>
  </div>
  <div class="grid md:grid-cols-3 gap-6">
    {#each data.doctors.slice(0, 3) as doctor}
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-600">
            {doctor.avatar}
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800">{doctor.name}</h3>
          <p class="text-blue-600 text-sm mb-3">{doctor.specialty}</p>
          <p class="text-gray-600 text-sm mb-4">{doctor.bio}</p>
          <a href="/doctors/{doctor.id}" class="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            View Schedule
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
