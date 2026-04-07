<script lang="ts">
  import EntryItem from "$lib/components/features/log/entry-item.svelte";
  import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
  } from "$lib/components/ui/item";
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useCombinedEntries } from "$lib/stores/logs.svelte";
  import type { Appliance } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { computeEnrichedEntries } from "$lib/utils/helper";

  const appliances = $derived(applianceStore.appliances);
  const entries = $derived(useCombinedEntries());

  const alwaysOnKwhPerDay = $derived(
    appliances
      .filter((a: Appliance) => !a.sessionBased)
      .reduce(
        (sum: number, a: Appliance) =>
          sum + toKwh(a.watt as number, a.dailyHours as number),
        0
      )
  );

  const enrichedLogs = $derived(
    computeEnrichedEntries(entries, alwaysOnKwhPerDay)
  );
</script>

<Item class="p-0 mb-10">
  <ItemContent class="gap-2">
    <div>
      <ItemTitle class="uppercase">Log Aktivitas</ItemTitle>
      <ItemDescription>
        Pantau semua aktivitas listrik, termasuk top up, meter, dan pemakaian.
      </ItemDescription>
    </div>

    {#if enrichedLogs.length}
      <div class="flex flex-col gap-2">
        {#each enrichedLogs as entry (entry.id)}
          <EntryItem {entry} />
        {/each}
      </div>
    {:else}
      <Item variant="muted">
        <ItemContent>
          <p class="text-sm text-muted-foreground text-center py-4">
            Belum ada entri.
          </p>
        </ItemContent>
      </Item>
    {/if}
  </ItemContent>
</Item>
