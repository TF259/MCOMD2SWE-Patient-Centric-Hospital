<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props(); // Svelte 5 Rune
</script>

<div class="min-h-screen bg-white flex flex-col justify-center py-8 px-4">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">CarePoint HMS</h1>
        <p class="text-base text-gray-600 mb-8">[ ASSET: NHS_IDENTITY_PROVIDER ]</p>

        <form method="POST" action="?/login" use:enhance class="space-y-6">
            <div class="space-y-2">
                <label for="nhs_number" class="block text-lg font-bold text-gray-900">
                    NHS Number (10-digit PK)
                </label>
                <input 
                    type="text" 
                    id="nhs_number"
                    name="nhs_number" 
                    required 
                    class="block w-full px-3 py-2 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                />
            </div>
            
            <div class="space-y-2">
                <label for="password" class="block text-lg font-bold text-gray-900">
                    Access Credential
                </label>
                <input 
                    type="password" 
                    id="password"
                    name="password" 
                    required 
                    class="block w-full px-3 py-2 text-lg border-2 border-gray-900 rounded-none focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-gray-900" 
                />
            </div>

            {#if form?.error}
                <div class="border-l-4 border-red-600 bg-red-50 p-4">
                    <p class="text-base font-bold text-red-900">{form.error}</p>
                </div>
            {/if}

            <button 
                type="submit" 
                class="w-full bg-green-700 text-white px-6 py-3 text-lg font-bold rounded-none hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-sm"
            >
                EXECUTE_SESSION_INIT
            </button>
        </form>
    </div>
</div>