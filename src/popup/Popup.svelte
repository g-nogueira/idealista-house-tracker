<script lang="ts">
    import { onMount } from 'svelte';
    import { storage } from '../lib/storage';
    import type { HouseInfo } from '../lib/types';

    let houses: HouseInfo[] = [];
    let loading = true;
    let exportStatus: 'idle' | 'exporting' | 'done' = 'idle';
    let importStatus: 'idle' | 'importing' | 'done' = 'idle';
    let notification: { type: 'success' | 'error'; message: string } | null = null;

    onMount(async () => {
        try {
            houses = await storage.getHouses();
        } finally {
            loading = false;
        }
    });

    function showNotification(type: 'success' | 'error', message: string) {
        notification = { type, message };
        setTimeout(() => notification = null, 3000);
    }

    async function exportToCsv() {
        exportStatus = 'exporting';
        try {
            const csvContent = await storage.exportToCsv();
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `idealista-houses-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            exportStatus = 'done';
            showNotification('success', 'Houses exported successfully');
            setTimeout(() => exportStatus = 'idle', 2000);
        } catch (error) {
            console.error('Export failed:', error);
            exportStatus = 'idle';
            showNotification('error', 'Failed to export houses');
        }
    }

    async function importFromClipboard() {
        importStatus = 'importing';
        try {
            const text = await navigator.clipboard.readText();
            if (!text.trim()) {
                throw new Error('Clipboard is empty');
            }

            const results = await storage.importFromCsv(text);
            houses = await storage.getHouses();
            
            showNotification(
                'success',
                `Imported ${results.success} houses successfully${results.failed ? ` (${results.failed} failed)` : ''}`
            );
            importStatus = 'done';
            setTimeout(() => importStatus = 'idle', 2000);
        } catch (error) {
            console.error('Import failed:', error);
            showNotification('error', 'Failed to import houses from clipboard');
            importStatus = 'idle';
        }
    }

    async function removeHouse(id: string, event: MouseEvent) {
        const button = event.currentTarget as HTMLButtonElement;
        button.disabled = true;
        try {
            await storage.removeHouse(id);
            houses = await storage.getHouses();
        } catch (error) {
            console.error('Remove failed:', error);
            button.disabled = false;
        }
    }

    async function copyToCsv() {
        try {
            const csvContent = await storage.exportToCsv();
            await navigator.clipboard.writeText(csvContent);
            showNotification('success', 'CSV copied to clipboard');
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('error', 'Failed to copy to clipboard');
        }
    }
</script>

<main class="w-full max-h-[600px] overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
    {#if notification}
        <div 
            class="fixed top-2 right-2 left-2 p-3 rounded-lg shadow-lg slide-in z-50 {notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
            role="alert"
        >
            {notification.message}
        </div>
    {/if}

    <header class="sticky top-0 bg-gray-50/95 backdrop-blur-sm pb-4 p-3 shadow-sm z-40">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-800">Saved Houses</h1>
                <p class="text-sm text-gray-500 mt-1">{houses.length} {houses.length === 1 ? 'house' : 'houses'} saved</p>
            </div>
            <div class="flex gap-2">
                <button
                    class="rounded-lg px-4 py-2 text-white transition-all duration-200 
                        bg-purple-500 hover:bg-purple-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                        active:scale-95"
                    on:click={importFromClipboard}
                    disabled={importStatus === 'importing'}
                    title="Import CSV from clipboard"
                >
                    <div class="flex items-center gap-2">
                        {#if importStatus === 'importing'}
                            <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Importing...
                        {:else if importStatus === 'done'}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Imported
                        {:else}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v13"/>
                            </svg>
                            Import CSV
                        {/if}
                    </div>
                </button>
                <button
                    class="rounded-lg px-4 py-2 text-white transition-all duration-200 
                        bg-gray-500 hover:bg-gray-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                        active:scale-95"
                    on:click={copyToCsv}
                    disabled={houses.length === 0}
                    title="Copy CSV to clipboard"
                >
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                        </svg>
                        Copy CSV
                    </div>
                </button>
                <button
                    class="rounded-lg px-4 py-2 text-white transition-all duration-200 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        {exportStatus === 'done' ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}
                        active:scale-95"
                    on:click={exportToCsv}
                    disabled={exportStatus === 'exporting' || houses.length === 0}
                    title="Download CSV file"
                >
                    <div class="flex items-center gap-2">
                        {#if exportStatus === 'exporting'}
                            <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Exporting...
                        {:else if exportStatus === 'done'}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Exported
                        {:else}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4V4"/>
                            </svg>
                            Download CSV
                        {/if}
                    </div>
                </button>
            </div>
        </div>
    </header>

    {#if loading}
        <div class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p class="mt-4 text-gray-600">Loading saved houses...</p>
        </div>
    {:else if houses.length === 0}
        <div class="text-center py-12 px-4">
            <div class="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
            </div>
            <p class="text-lg font-semibold text-gray-700 mb-2">No houses saved yet</p>
            <p class="text-sm text-gray-500">Right-click on an Idealista house page and select "Consider this house"</p>
        </div>
    {:else}
        <div class="space-y-4 mt-2">
            {#each houses as house}
                <div class="house-card bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md">
                    <div class="flex gap-4">
                        <a 
                            href={house.url}
                            target="_blank"
                            class="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md group"
                        >
                            <img 
                                src={house.thumbnail} 
                                alt={house.title} 
                                class="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110" 
                            />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </a>
                        <div class="flex-1 min-w-0">
                            <a 
                                href={house.url}
                                target="_blank"
                                class="block group"
                            >
                                <h3 class="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {house.title}
                                </h3>
                            </a>
                            <p class="font-bold text-green-600 mt-1">{house.price}€</p>
                            <p class="text-sm text-gray-500 truncate mt-0.5">{house.address}</p>
                        </div>
                        <button 
                            class="text-gray-400 hover:text-red-500 transition-colors duration-200 
                                disabled:opacity-50 disabled:cursor-not-allowed
                                h-6 w-6 rounded-full hover:bg-red-50 flex items-center justify-center"
                            on:click={(e) => removeHouse(house.id, e)}
                            title="Remove house"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    main {
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #f3f4f6;  /* gray-300 and gray-100 equivalents */
    }
    
    main::-webkit-scrollbar {
        width: 6px;
    }
    
    main::-webkit-scrollbar-track {
        background: #f3f4f6;  /* gray-100 */
    }
    
    main::-webkit-scrollbar-thumb {
        background-color: #d1d5db;  /* gray-300 */
        border-radius: 3px;
    }
</style>