<script lang="ts">
  import { ChevronDown, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { Accordion, Pagination } from "bits-ui";
  import EntryItem from "$lib/components/features/log/entry-item.svelte";
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useCombinedEntries } from "$lib/stores/logs.svelte";
  import type { Appliance } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { computeEnrichedEntries, getDateLabel } from "$lib/utils/helper";
  import { slide } from "svelte/transition";
  import { circInOut } from "svelte/easing";

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

  const groupsByDate = $derived(() => {
    const grouped = new Map<string, typeof paginatedLogs>();
    for (const entry of paginatedLogs) {
      const label = getDateLabel(new Date(entry.timestamp));
      if (!grouped.has(label)) {
        grouped.set(label, []);
      }
      grouped.get(label)?.push(entry);
    }
    return grouped;
  });

  const sortedLabels = $derived(
    Array.from(groupsByDate().keys()).sort((a, b) => {
      if (a === "Hari ini") {
        return -1;
      }
      if (b === "Hari ini") {
        return 1;
      }
      if (a === "Kemarin") {
        return -1;
      }
      if (b === "Kemarin") {
        return 1;
      }
      return 0;
    })
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
    <Accordion.Root type="single" class="flex flex-col gap-2">
      {#each sortedLabels as label (label)}
        <Accordion.Item
          value={label}
          class="bg-secondary/50 rounded-xl overflow-hidden cursor-pointer"
        >
          <Accordion.Header>
            <Accordion.Trigger
              class="flex items-center justify-between w-full p-4"
            >
              <span class="text-sm font-medium">
                {label}
                ({groupsByDate().get(label)?.length ?? 0}
                entri)
              </span>
              <ChevronDown size="16" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="px-4 pb-4" forceMount={true}>
            {#snippet child({props, open})}
              {#each groupsByDate().get(label) ?? [] as entry (entry.id)}
                {#if open}
                  <div
                    {...props}
                    transition:slide={{ duration: 300, easing: circInOut }}
                  >
                    <EntryItem {entry} />
                  </div>
                {/if}
              {/each}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</section>
