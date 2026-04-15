<script lang="ts">
  import { Unplug } from "@lucide/svelte";
  import AddApplianceButton from "$lib/components/features/appliance/appliance-add-button.svelte";
  import ApplianceListItem from "$lib/components/features/appliance/appliance-list-item.svelte";
  import { applianceStore } from "$lib/stores/appliance.svelte";

  const appliances = $derived(applianceStore.appliances);
</script>

<div class="p-0 grid gap-2">
  <div>
    <h2 class="uppercase text-sm">Perangkat</h2>
    <p class="text-sm text-muted-foreground">
      Kelola daftar perangkat elektronik yang ingin kamu pantau penggunaan
      listriknya.
    </p>
  </div>

  {#if appliances.length}
    <div class="grid gap-y-4">
      <div class="grid gap-y-2">
        {#each appliances as appliance}
          <ApplianceListItem {appliance} />
        {/each}
      </div>

      <AddApplianceButton />
    </div>
  {:else}
    <div
      class="gap-4 rounded-xl border border-secondary p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance bg-muted"
    >
      <div class="flex flex-col flex-1 justify-center items-center gap-2">
        <div
          class="bg-muted-foreground text-muted flex size-12 shrink-0 items-center justify-center rounded-full [&_svg:not([class*='size-'])]:size-6"
        >
          <Unplug size="24" />
        </div>
        <h2 class="text-sm">Belum ada perangkat</h2>
        <p class="text-sm text-muted-foreground w-sm">
          Tambahkan perangkat yang ingin kamu pantau agar bisa mulai mencatat
          pemakaian listrik
        </p>
      </div>
      <div
        class="gap-2.5 text-sm flex w-full max-w-sm min-w-0 flex-col items-center text-balance"
      >
        <AddApplianceButton />
      </div>
    </div>
  {/if}
</div>
