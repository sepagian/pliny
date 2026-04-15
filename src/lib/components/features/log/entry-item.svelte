<script lang="ts">
  import { Pencil, Trash } from "@lucide/svelte";
  import { deleteMeter } from "$lib/actions/meter";
  import { deleteSession } from "$lib/actions/session";
  import { deleteTopup } from "$lib/actions/topup";
  import MeterForm from "$lib/components/features/entry/entry-meter-form.svelte";
  import SessionForm from "$lib/components/features/entry/entry-session-form.svelte";
  import TopUpForm from "$lib/components/features/entry/entry-topup-form.svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import { Button } from "bits-ui";
  import TooltipWrapper from "$lib/components/features/layout/layout-tooltip.svelte";
  import ConfirmDeleteDialog, {
    confirmDelete,
  } from "$lib/components/features/layout/layout-confirm-delete.svelte";
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
    topup: {
      title: "Edit Top-Up",
      description: "Perbarui data pengisian token",
    },
    meter: {
      title: "Edit Catatan Meteran",
      description: "Perbarui angka saldo meteran",
    },
    session: {
      title: "Edit Sesi Pemakaian",
      description: "Perbarui durasi sesi yang sudah dicatat",
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
        return "Top-up Token";
      case "meter":
        return "Catat Meter";
      case "session":
        return entry.appliance;
      case "daily":
        return "Penggunaan harian";
      default:
        return "";
    }
  });

  const subtitle = $derived(() => {
    switch (entry.type) {
      case "session":
        return `${entry.duration} jam`;
      case "meter":
        return null;
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

<div
  class="flex gap-4 items-center bg-secondary/80 rounded-xl p-4 hover:bg-secondary/60"
>
  <div class="dot" style="background: {color};"></div>
  <div class="flex flex-row justify-between w-full">
    <div class="flex flex-col gap-1">
      <h2 class="flex items-center gap-2 text-sm">
        {label()}
        {#if subtitle()}
          <p class="text-xs text-muted-foreground">{subtitle()}</p>
        {/if}
      </h2>
      <p class="text-xs text-muted-foreground">
        {fmtDate(new Date(entry.timestamp))}
      </p>
    </div>
    <div class="flex flex-col gap-1 ">
      <p class="text-right {amountColor()} font-medium text-sm">
        {displayValue()}
        {unit()}
      </p>
      <p class="text-xs text-right text-muted-foreground">
        Sisa: {entry.computedBal} kWh
      </p>
    </div>
  </div>
  {#if isEditable}
    <div class="flex gap-1">
      <ConfirmDeleteDialog />
      <DrawerWrapper
        bind:open
        title={formConfig[entry.type]?.title ?? ""}
        description={formConfig[entry.type ]?.description ?? ""}
      >
        {#snippet trigger()}
          <TooltipWrapper>
            {#snippet trigger()}
              <Button.Root
                class="btn-secondary bg-stone-700 text-stone-100 hover:(bg-stone-800 text-stone-100) p-3"
              >
                <Pencil size="16" />
              </Button.Root>
            {/snippet}
            Edit
          </TooltipWrapper>
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
      <TooltipWrapper>
        {#snippet trigger()}
          {#if entry.type !== "daily"}
            <Button.Root
              class="btn-secondary bg-red-700 text-red-100 hover:(bg-red-800 text-red-100) p-3"
              onclick={handleDelete}
            >
              <Trash size="16" />
            </Button.Root>
          {/if}
        {/snippet}
        Delete
      </TooltipWrapper>
    </div>
  {/if}
</div>

<style>
  .dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
