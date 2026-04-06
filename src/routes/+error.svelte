<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
	<div class="max-w-2xl w-full">
		<!-- Error Header -->
		<div class="text-center mb-8">
			<div class="inline-block bg-red-600 text-white px-6 py-2 text-sm font-bold mb-4">
				ERROR
			</div>
			<h1 class="text-6xl font-bold text-white mb-2">
				{$page.status || 500}
			</h1>
			<p class="text-2xl text-gray-300 font-bold mb-4">
				{#if $page.status === 404}
					Page Not Found
				{:else if $page.status === 403}
					Access Denied
				{:else if $page.status === 500}
					Server Error
				{:else}
					Something Went Wrong
				{/if}
			</p>
		</div>

		<!-- Error Message Box -->
		<div class="bg-gray-800 border-4 border-gray-700 p-8 mb-8 text-center">
			<p class="text-gray-300 mb-4 text-lg">
				{#if $page.status === 404}
					The page you're looking for doesn't exist or has been moved.
				{:else if $page.status === 403}
					You don't have permission to access this page. Please log in or contact an administrator.
				{:else if $page.status === 500}
					We encountered an unexpected server error. Our team has been notified.
				{:else if $page.error?.message}
					{$page.error.message}
				{:else}
					An unexpected error occurred. Please try again or contact support.
				{/if}
			</p>

			<!-- Error Details (if available) -->
			{#if $page.error?.message && $page.status !== 404 && $page.status !== 403}
				<div class="mt-6 p-4 bg-gray-900 border border-gray-600 rounded text-left text-sm text-gray-400 font-mono">
					<p class="font-bold text-red-400 mb-2">Error Details:</p>
					<p>{$page.error.message}</p>
				</div>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/"
				class="px-8 py-4 bg-gray-900 text-white border-2 border-white font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
			>
				← GO HOME
			</a>
			<button
				onclick={() => window.history.back()}
				class="px-8 py-4 bg-gray-700 text-white border-2 border-gray-500 font-bold text-lg hover:bg-gray-600 transition-colors"
			>
				← GO BACK
			</button>
		</div>

		<!-- Status Code Reference -->
		<div class="mt-12 text-center text-gray-500 text-sm">
			<p>Error Code: {$page.status || 'UNKNOWN'}</p>
			<p class="mt-1">If this persists, please contact support: support@carepoint.local</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
