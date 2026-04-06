<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Minimal Header -->
<header class="bg-gray-900 border-b-2 border-blue-600 sticky top-0 z-40">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
		<!-- Logo + Home Link -->
		<a href={data.session?.type ? (data.session.type === 'doctor' ? '/doctor' : '/dashboard') : '/'} class="text-white font-bold text-lg hover:text-blue-400 transition-colors">
			🏥 CarePoint
		</a>

		<!-- Desktop: User + Logout -->
		<div class="hidden sm:flex items-center gap-6">
			{#if data.session}
				<div class="text-right text-sm">
					<p class="text-gray-400">{data.session.type === 'doctor' ? 'Clinician' : 'Patient'}</p>
					<p class="text-white font-bold">{data.session.full_name}</p>
				</div>
				{#if data.session.type === 'patient'}
					<a href="/profile" class="text-gray-300 hover:text-blue-400 font-bold text-sm transition-colors">
						👤 Profile
					</a>
				{/if}
				<form method="POST" action="?/logout" use:enhance>
					<button type="submit" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold transition-colors">
						Logout
					</button>
				</form>
			{:else}
				<a href="/" class="text-white hover:text-blue-400 font-bold transition-colors">Login</a>
			{/if}
		</div>

		<!-- Mobile: Menu Button -->
		<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="sm:hidden text-white p-2">
			{#if mobileMenuOpen}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen && data.session}
		<div class="sm:hidden border-t border-gray-800 bg-gray-800 p-4 space-y-3">
			{#if data.session.type === 'patient'}
				<a href="/dashboard" class="block text-white hover:text-blue-400 py-2 font-bold">Dashboard</a>
				<a href="/booking" class="block text-white hover:text-blue-400 py-2 font-bold">Book</a>
				<a href="/audit-log" class="block text-white hover:text-blue-400 py-2 font-bold">Audit Log</a>
				<a href="/profile" class="block text-white hover:text-blue-400 py-2 font-bold">Profile</a>
			{/if}
			<form method="POST" action="?/logout" use:enhance>
				<button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-bold">
					Logout
				</button>
			</form>
		</div>
	{/if}
</header>

<!-- Content -->
<main class="min-h-[calc(100vh-200px)]">
	{@render children()}
</main>

<!-- Footer -->
<footer class="bg-gray-900 border-t border-gray-800 py-3 px-4 text-center text-xs text-gray-500">
	CarePoint HMS © 2026
</footer>
