<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    function formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function getActionColor(action: string): string {
        if (action.includes('LOGIN')) return 'bg-blue-100 text-blue-900';
        if (action.includes('RECORD')) return 'bg-green-100 text-green-900';
        if (action.includes('APPOINTMENT')) return 'bg-purple-100 text-purple-900';
        if (action.includes('REGISTRATION')) return 'bg-orange-100 text-orange-900';
        return 'bg-gray-100 text-gray-900';
    }
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b-4 border-gray-900 px-6 py-6">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">AUDIT LOG</h1>
                    <p class="text-sm text-gray-600 mt-1">GDPR Transparency - Your Data Access History</p>
                </div>
                <a href="/dashboard" class="border-2 border-gray-900 px-4 py-2 text-sm font-bold  hover:bg-gray-900 hover:text-white transition-colors">
                    ← BACK
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p class="font-bold text-blue-900">🔒 GDPR Compliance</p>
            <p class="text-sm text-blue-800 mt-1">This log shows all actions related to your account and data. You have the right to access this information under GDPR Article 15.</p>
        </div>

        {#if data.auditLogs.length > 0}
            <div class="bg-white border-2 border-gray-300">
                <div class="grid grid-cols-5 gap-4 bg-gray-900 text-white px-6 py-3 text-sm font-bold">
                    <div>Timestamp</div>
                    <div>Action</div>
                    <div col-span-2>Details</div>
                    <div>Status</div>
                </div>

                <div class="divide-y-2 divide-gray-200">
                    {#each data.auditLogs as log}
                        <div class="grid grid-cols-5 gap-4 px-6 py-4 items-start">
                            <div class="text-sm text-gray-600 font-mono">
                                {formatTimestamp(log.timestamp)}
                            </div>
                            <div class="text-sm font-bold">
                                <span class="px-2 py-1 rounded {getActionColor(log.action)}">
                                    {log.action}
                                </span>
                            </div>
                            <div colspan="2" class="text-sm text-gray-700">
                                {log.details}
                            </div>
                            <div class="text-xs text-gray-500">
                                ✓ Logged
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="mt-6 bg-gray-50 border-l-4 border-gray-600 p-4 text-sm text-gray-700">
                <p class="font-bold mb-2">📊 Summary</p>
                <ul class="space-y-1">
                    <li>Total events logged: <span class="font-bold">{data.auditLogs.length}</span></li>
                    <li>Date range: {data.auditLogs.length > 0 ? formatTimestamp(data.auditLogs[data.auditLogs.length - 1].timestamp) : 'N/A'} to {data.auditLogs.length > 0 ? formatTimestamp(data.auditLogs[0].timestamp) : 'N/A'}</li>
                    <li>NHS Number: <span class="font-mono font-bold">{data.nhs_number}</span></li>
                </ul>
            </div>
        {:else}
            <div class="bg-white border-2 border-gray-300 p-8 text-center">
                <p class="text-lg font-bold text-gray-900 mb-2">No audit events yet</p>
                <p class="text-gray-600">Your account activity will appear here</p>
            </div>
        {/if}

        <!-- GDPR Links -->
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/privacy/data-request" class="bg-blue-600 text-white px-6 py-4 font-bold hover:bg-blue-700 text-center transition-colors">
                📥 Request All My Data
            </a>
            <a href="/privacy/deletion-request" class="bg-red-600 text-white px-6 py-4 font-bold hover:bg-red-700 text-center transition-colors">
                🗑️ Request Account Deletion
            </a>
        </div>
    </main>
</div>
