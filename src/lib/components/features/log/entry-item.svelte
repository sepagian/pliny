<script lang="ts">
  import { Pencil, Trash } from "@lucide/svelte";
  import { deleteMeter } from "$lib/actions/meter";
  import { deleteSession } from "$lib/actions/session";
  import { deleteTopup } from "$lib/actions/topup";
  import MeterForm from "$lib/components/features/entry/entry-meter-form.svelte";
  import SessionForm from "$lib/components/features/entry/entry-session-form.svelte";
  import TopUpForm from "$lib/components/features/entry/entry-topup-form.svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    ConfirmDeleteDialog,
    confirmDelete,
  } from "$lib/components/ui/confirm-delete-dialog";
  import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
  } from "$lib/components/ui/item";
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "$lib/components/ui/tooltip";
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import type { EnrichedEntry } from "$lib/types";
  import { toKwh } from "$lib/utils/calc";
  import { fmtDate } from "$lib/utils/format";

  interface Props {
    entry: EnrichedEntry;
  }

  let { entry }: Props = $props();
  let open = $state(false);

  const appliances = $derived(applianceStore.appliances);

  const colors: Record<EnrichedEntry["type"], string> = {
    topup: "#1D9E75",
    meter: "#378ADD",
    session: "#BA7517",
    daily: "#9333EA",
  };

  const color = $derived(colors[entry.type]);

  const formConfig = $derived({
    topup: { title: "Edit Top-Up", description: "Edit entri top-up" },
    meter: { title: "Edit Meter", description: "Edit pembacaan meter" },
    session: {
      title: "Edit Pemakaian",
      description: "Edit pemakaian perangkat",
    },
  });

  const isEditable = $derived(
    entry.type === "topup" || entry.type === "meter" || entry.type === "session"
  );

  function handleDelete() {
    confirmDelete({
      title: "Hapus",
      description: "Hapus entri log ini?",
      onConfirm: async () => {
        if (entry.type === "topup") {
          await deleteTopup(entry.id);
        } else if (entry.type === "meter") {
          await deleteMeter(entry.id);
        } else if (entry.type === "session") {
          await deleteSession(entry.id);
        }
      },
    });
  }

  const kwh = $derived(() => {
    if (entry.type !== "session") {
      return null;
    }
    const appliance = appliances.find((a) => a.name === entry.appliance);
    return appliance ? toKwh(appliance.watt, entry.duration) : 0;
  });

  const displayValue = $derived(() => {
    switch (entry.type) {
      case "topup":
        return `+${entry.amount}`;
      case "meter":
        return entry.meter.toString();
      case "session":
        return `-${kwh()?.toFixed(2) ?? "-"}`;
      case "daily":
        return (entry as EnrichedEntry & { type: "daily" }).kwh.toFixed(2);
      default:
        return "-";
    }
  });

  const amountColor = $derived(() => {
    switch (entry.type) {
      case "topup":
        return "text-green-600";
      case "session":
        return "text-red-600";
      case "daily":
        return "text-purple-600";
      default:
        return "text-muted-foreground";
    }
  });

  const label = $derived(() => {
    switch (entry.type) {
      case "topup":
        return "Credit top-up";
      case "meter":
        return "Meter reading";
      case "session":
        return entry.appliance;
      case "daily":
        return "Daily usage";
      default:
        return "";
    }
  });

  const subtitle = $derived(() => {
    switch (entry.type) {
      case "session":
        return `${entry.duration} jam`;
      case "meter":
        return "Manual";
      default:
        return null;
    }
  });

  const unit = $derived(() => {
    switch (entry.type) {
      case "daily":
        return "kWh";
      case "meter":
        return "kWh";
      default:
        return "kWh";
    }
  });
</script>

<Item variant="muted">
  <div class="dot" style="background: {color};"></div>
  <ItemContent class="flex flex-row justify-between">
    <div class="flex flex-col gap-1">
      <ItemTitle class="flex">
        {label()}
        {#if subtitle()}
          <ItemDescription class="text-xs"> {subtitle()}</ItemDescription>
        {/if}
      </ItemTitle>
      <ItemDescription class="text-xs">
        {fmtDate(new Date(entry.timestamp))}
      </ItemDescription>
    </div>
    <div class="flex flex-col gap-1">
      <ItemDescription class="text-right {amountColor()} font-medium">
        {displayValue()}
        {unit()}
      </ItemDescription>
      <ItemDescription class="text-xs text-right text-muted-foreground">
        Sisa: {entry.computedBal} kWh
      </ItemDescription>
    </div>
  </ItemContent>
  <ItemActions>
    <ConfirmDeleteDialog />
    {#if isEditable}
      <DrawerWrapper
        bind:open
        title={formConfig[entry.type]?.title ?? ""}
        description={formConfig[entry.type ]?.description ?? ""}
      >
        {#snippet trigger()}
          <Button variant="secondary" size="sm"> <Pencil size="12" /> </Button>
        {/snippet}
        {#snippet content()}
          <div class="mb-6">
            {#if entry.type === "topup"}
              <TopUpForm id={entry.id} onSuccess={() => (open = false)} />
            {:else if entry.type === "meter"}
              <MeterForm id={entry.id} onSuccess={() => (open = false)} />
            {:else if entry.type === "session"}
              <SessionForm id={entry.id} onSuccess={() => (open = false)} />
            {/if}
          </div>
        {/snippet}
      </DrawerWrapper>
    {/if}
    <Tooltip>
      <TooltipTrigger>
        <Button variant="secondary" onclick={handleDelete} size="sm">
          <Trash size="12" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete</TooltipContent>
    </Tooltip>
  </ItemActions>
</Item>

<style>
  .dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
