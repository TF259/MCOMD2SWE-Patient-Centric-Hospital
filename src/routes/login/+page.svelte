<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Login - HealthConnect</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
      <p class="text-gray-600 mt-2">Sign in to your patient portal</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-8">
      {#if form?.error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {form.error}
        </div>
      {/if}

      <form method="POST" use:enhance>
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

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>Demo credentials: <strong>demo@example.com</strong> / <strong>demo123</strong></p>
      </div>

      <div class="mt-4 text-center text-sm">
        <span class="text-gray-600">Don't have an account? </span>
        <a href="/register" class="text-blue-600 hover:text-blue-800 font-medium">Create one</a>
      </div>
    </div>
  </div>
</div>
