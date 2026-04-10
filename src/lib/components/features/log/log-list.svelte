<script lang="ts">
  import EntryItem from "$lib/components/features/log/entry-item.svelte";
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

<section class="grid gap-2 mb-10">
  <div>
    <h2 class="uppercase text-sm">Log Aktivitas</h2>
    <p class="text-sm text-muted-foreground">
      Pantau semua aktivitas listrik, termasuk top up, meter, dan pemakaian.
    </p>
  </div>

  {#if enrichedLogs.length}
    <div class="flex flex-col gap-2">
      {#each enrichedLogs as entry (entry.id)}
        <EntryItem {entry} />
      {/each}
    </div>
  {:else}
    <div class="bg-secondary rounded-lg">
      <p class="text-sm text-secondary-foreground text-center py-4">
        Belum ada entri.
      </p>
    </div>
  {/if}
</section>
