<script lang="ts">
  import { Unplug } from "@lucide/svelte";
  import AddApplianceButton from "$lib/components/features/appliance/appliance-add-button.svelte";
  import ApplianceListItem from "$lib/components/features/appliance/appliance-list-item.svelte";
  import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "$lib/components/ui/empty";
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
    <Empty>
      <EmptyHeader>
        <EmptyMedia class="bg-secondary size-12 rounded-full">
          <Unplug size="24" />
        </EmptyMedia>
        <EmptyTitle>Belum ada perangkat</EmptyTitle>
        <EmptyDescription>
          Tambahkan perangkat yang ingin kamu pantau agar bisa mulai mencatat
          pemakaian listrik
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent> <AddApplianceButton /> </EmptyContent>
    </Empty>
  {/if}
</div>
