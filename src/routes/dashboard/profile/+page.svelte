<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Edit Profile - HealthConnect</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/dashboard" class="text-blue-600 hover:text-blue-800 text-sm">← Back to Dashboard</a>
    <h1 class="text-3xl font-bold text-gray-900 mt-2">Edit Profile</h1>
  </div>

  <div class="bg-white rounded-xl shadow-md p-8">
    {#if form?.success}
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
        Profile updated successfully!
      </div>
    {/if}
    {#if form?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
        {form.error}
      </div>
    {/if}

    <form method="POST" use:enhance>
      <div class="grid grid-cols-2 gap-5 mb-5">
        <div class="col-span-2">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form?.name ?? data.patient.name}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div class="col-span-2">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form?.email ?? data.patient.email}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={form?.dob ?? data.patient.dob ?? ''}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form?.phone ?? data.patient.phone ?? ''}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div class="col-span-2">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={form?.address ?? data.patient.address ?? ''}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Save Changes
      </button>
    </form>
  </div>
</div>
