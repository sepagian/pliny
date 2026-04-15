<script lang="ts">
  import { Pagination } from "bits-ui";
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import EntryItem from "$lib/components/features/log/entry-item.svelte";
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useCombinedEntries } from "$lib/stores/logs.svelte";
  import type { Appliance } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { computeEnrichedEntries } from "$lib/utils/helper";

  const appliances = $derived(applianceStore.appliances);
  const entries = $derived(useCombinedEntries());
  const perPage: number = 10;

  let currentPage: number = $state(1);

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

  const paginatedLogs = $derived(
    enrichedLogs.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<section class="grid gap-2 pb-20">
  <div class="flex justify-between items-center">
    <div>
      <h2 class="uppercase text-sm">Log Aktivitas</h2>
      <p class="text-sm text-muted-foreground">
        Pantau semua aktivitas listrik, termasuk top up, meter, dan pemakaian.
      </p>
    </div>
    <Pagination.Root
      class=""
      bind:page={currentPage}
      count={enrichedLogs.length}
      {perPage}
    >
      <div class="flex items-center justify-center gap-2">
        <Pagination.PrevButton
          class="bg-secondary rounded-md p-2 disabled:text-muted-foreground"
          ><ChevronLeft /></Pagination.PrevButton
        >
        <Pagination.NextButton
          class="bg-secondary rounded-md p-2 disabled:text-muted-foreground"
          ><ChevronRight /></Pagination.NextButton
        >
      </div>
    </Pagination.Root>
  </div>

  {#if paginatedLogs.length}
    <div class="flex flex-col gap-2">
      {#each paginatedLogs as entry (entry.id)}
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
