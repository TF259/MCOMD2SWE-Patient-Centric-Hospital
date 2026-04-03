<script lang="ts">
    // In a later task, we will load this data dynamically from the server
    let patient_name = "Arthur Retiree"; 
</script>

<div class="min-h-screen bg-slate-50 p-8 font-sans">
    <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-center border-b-4 border-blue-600 pb-4 mb-8">
            <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">
                Welcome, {patient_name}
            </h1>
            <a href="/" class="bg-slate-900 text-white px-4 py-2 font-bold hover:bg-slate-700">
                LOGOUT
            </a>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                <h2 class="text-xl font-bold mb-4 uppercase">Appointments</h2>
                <p class="text-slate-500 italic mb-4 text-sm">ACT_SCHEDULING_ENGINE</p>
                <button class="w-full bg-blue-600 text-white py-3 font-bold hover:bg-blue-700">
                    BOOK NEW APPOINTMENT
                </button>
            </div>

            <div class="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                <h2 class="text-xl font-bold mb-4 uppercase">Medical Records</h2>
                <p class="text-slate-500 italic mb-4 text-sm">ACT_RECORD_FETCHER</p>
                <button class="w-full border-4 border-slate-900 py-3 font-bold hover:bg-slate-100">
                    VIEW PORTAL
                </button>
            </div>
        </div>
    </div>
</div>