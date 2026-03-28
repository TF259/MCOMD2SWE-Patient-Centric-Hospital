<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Register - HealthConnect</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create Your Account</h1>
      <p class="text-gray-600 mt-2">Join HealthConnect for seamless healthcare</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-8">
      {#if form?.error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {form.error}
        </div>
      {/if}

      <form method="POST" use:enhance>
        <div class="mb-5">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form?.name ?? ''}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div class="mb-5">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form?.email ?? ''}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div class="mb-5">
          <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={form?.dob ?? ''}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div class="mb-5">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form?.phone ?? ''}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="555-0000"
          />
        </div>

        <div class="mb-5">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Min. 6 characters"
          />
        </div>

        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Create Account
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
        <span class="text-gray-600">Already have an account? </span>
        <a href="/login" class="text-blue-600 hover:text-blue-800 font-medium">Sign in</a>
      </div>
    </div>
  </div>
</div>
