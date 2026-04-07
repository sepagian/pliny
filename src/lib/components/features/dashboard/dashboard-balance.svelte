<script lang="ts">
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useCombinedEntries } from "$lib/stores/logs.svelte";
  import type { Appliance, Entry } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { computeCurrentBalance } from "$lib/utils/helper";

  const appliances = $derived(applianceStore.appliances);
  const entries = $derived(useCombinedEntries() as Entry[]);

  const alwaysOnKwhPerDay = $derived(
    appliances
      .filter((a: Appliance) => !a.sessionBased)
      .reduce(
        (sum: number, a: Appliance) => sum + toKwh(a.watt, a.dailyHours),
        0
      )
  );

  const currentBalance = $derived(
    computeCurrentBalance(entries as Entry[], alwaysOnKwhPerDay)
  );
</script>

<div class="grid col-span-5 content-center gap-0">
  <h2 class="text-4xl font-bold tabular-nums">{currentBalance ?? "--"} Kwh</h2>
  <p class="text-sm">estimated remaining balance from usage</p>
</div>
