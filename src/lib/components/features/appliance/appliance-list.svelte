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
  import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
  } from "$lib/components/ui/item";
  import { applianceStore } from "$lib/stores/appliance.svelte";

  const appliances = $derived(applianceStore.appliances);
</script>

<Item class="p-0">
  <ItemContent class="gap-2">
    <div>
      <ItemTitle class="uppercase">Perangkat</ItemTitle>
      <ItemDescription>
        Kelola daftar perangkat elektronik yang ingin kamu pantau penggunaan
        listriknya.
      </ItemDescription>
    </div>

    <ItemContent class="border rounded-xl">
      {#if appliances.length}
        <div class="grid gap-y-2 m-2">
          {#each appliances as appliance}
            <ApplianceListItem {appliance} />
          {/each}

          <AddApplianceButton buttonClass="font-bold w-full" />
        </div>
      {:else}
        <Empty>
          <EmptyHeader>
            <EmptyMedia class="bg-secondary size-12 rounded-full">
              <Unplug size="24" />
            </EmptyMedia>
            <EmptyTitle>Belum ada perangkat</EmptyTitle>
            <EmptyDescription>
              Tambahkan perangkat yang ingin kamu pantau agar bisa mulai
              mencatat pemakaian listrik
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddApplianceButton buttonClass="font-bold" />
          </EmptyContent>
        </Empty>
      {/if}
    </ItemContent>
  </ItemContent>
</Item>
