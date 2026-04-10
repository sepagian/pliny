<script lang="ts">
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useCombinedEntries } from "$lib/stores/logs.svelte";
  import type { Appliance, Entry } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { computeCurrentBalance } from "$lib/utils/helper";

  const appliances = $derived(applianceStore.appliances);
  const entries = $derived(useCombinedEntries() as Entry[]);

  const alwaysOnKwh = $derived(
    appliances
      .filter((a: Appliance) => !a.sessionBased)
      .reduce(
        (sum: number, a: Appliance) =>
          sum + toKwh(a.watt, a.dailyHours as number),
        0
      )
  );

  const sessionEntries = $derived(
    entries.filter(
      (e): e is Entry & { type: "session" } => e.type === "session"
    )
  );

  const sessionAvgKwh = $derived(
    sessionEntries.length > 0
      ? sessionEntries.reduce((sum, e) => {
          const appliance = appliances.find((a) => a.name === e.appliance);
          const kwh = appliance ? toKwh(appliance.watt, e.duration) : 0;
          return sum + kwh;
        }, 0) / sessionEntries.length
      : 0
  );

  const dailyTotal = $derived(alwaysOnKwh);

  const currentBalance = $derived(computeCurrentBalance(entries, alwaysOnKwh));

  const daysLeft = $derived(
    currentBalance !== null && dailyTotal > 0
      ? Math.floor(currentBalance / dailyTotal)
      : null
  );

  const usage = $derived([
    { description: "Daily Usage", title: alwaysOnKwh, footer: "kWh/day" },
    {
      description: "Sessions Avg",
      title: Math.round(sessionAvgKwh * 10) / 10,
      footer: "kWh/day",
    },
    { description: "Days left", title: daysLeft ?? "-", footer: "est." },
  ]);
</script>

<section class="grid grid-cols-3 gap-x-3">
  {#each usage as { description, title, footer }}
    <div class="card-secondary">
      <h2 class="uppercase text-xs truncate text-accent-foreground">
        {description}
      </h2>
      <h1 class="text-4xl tabular-nums font-semibold">{title}</h1>
      <p class="text-xs text-muted-foreground">{footer}</p>
    </div>
  {/each}
</section>
