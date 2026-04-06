<script lang="ts">
	import { page } from '$app/stores';

	let isLoading = $derived(
		$page.url.searchParams.toString() !== '' &&
		($page.state?.navigationInProgress ?? false)
	);
</script>

<!-- Loading Overlay -->
{#if isLoading}
	<div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
		<div class="bg-white p-8 rounded-lg shadow-2xl border-4 border-gray-900 text-center">
			<div class="inline-block">
				<div class="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
			</div>
			<p class="text-lg font-bold text-gray-900">Searching...</p>
			<p class="text-sm text-gray-600 mt-2">Finding records for you</p>
		</div>
	</div>
{/if}
