<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-blue-700 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <a href="/" class="text-xl font-bold flex items-center gap-2">
            <span class="text-2xl">🏥</span>
            <span>HealthConnect</span>
          </a>
          <div class="hidden md:flex gap-6">
            <a href="/doctors" class="hover:text-blue-200 transition-colors">Doctors</a>
            {#if data.patient}
              <a href="/appointments" class="hover:text-blue-200 transition-colors">My Appointments</a>
              <a href="/book" class="hover:text-blue-200 transition-colors">Book Appointment</a>
            {/if}
          </div>
        </div>
        <div class="flex items-center gap-4">
          {#if data.patient}
            <a href="/dashboard" class="hover:text-blue-200 transition-colors text-sm">
              👤 {data.patient.name}
            </a>
            <form method="POST" action="/logout">
              <button class="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded text-sm transition-colors">
                Logout
              </button>
            </form>
          {:else}
            <a href="/login" class="hover:text-blue-200 transition-colors text-sm">Login</a>
            <a href="/register" class="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded text-sm font-medium transition-colors">
              Register
            </a>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main>
    {@render children()}
  </main>

  <footer class="bg-gray-800 text-gray-300 mt-16 py-8">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-sm">© 2024 HealthConnect Hospital Management System. All rights reserved.</p>
    </div>
  </footer>
</div>
