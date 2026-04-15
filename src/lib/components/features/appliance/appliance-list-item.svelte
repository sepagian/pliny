<script lang="ts">
  import { Pencil, Trash } from "@lucide/svelte";
  import { deleteAppliance } from "$lib/actions/appliance";
  import ApplianceForm from "$lib/components/features/entry/entry-appliance-form.svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import TooltipWrapper from "$lib/components/features/layout/layout-tooltip.svelte";
  import { Button } from "bits-ui";
  import ConfirmDeleteDialog, {
    confirmDelete,
  } from "$lib/components/features/layout/layout-confirm-delete.svelte";
  import type { Appliance } from "$lib/types";

  let { appliance }: { appliance: Appliance } = $props();
  let open = $state(false);

  function handleDelete() {
    confirmDelete({
      title: "Hapus",
      description: `Apakah kamu yakin untuk menghapus ${appliance.name}?`,
      onConfirm: async () => {
        await deleteAppliance(appliance.id);
      },
    });
  }
</script>

<div
  class="flex gap-4 items-center bg-secondary rounded-xl p-4 hover:bg-secondary/60"
>
  <div class="flex flex-col w-full">
    <h2 class="text-sm">{appliance.name} </h2>
    <div class="flex gap-2">
      <p class="text-xs text-muted-foreground">{appliance.watt} Watt</p>
      {#if appliance.dailyHours}
        <span>·</span>
        <p class="text-muted-foreground text-xs">
          {appliance.dailyHours}
          jam/hari
        </p>
      {/if}
    </div>
  </div>
  <div class="flex gap-2">
    <ConfirmDeleteDialog />
    <!-- Edit Button -->
    <DrawerWrapper
      title="Edit Perangkat"
      description="Perbarui informasi perangkat."
      bind:open
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
        <ApplianceForm id={appliance.id} onSuccess={() => (open = false)} />
      {/snippet}
    </DrawerWrapper>
    <!-- Delete Button -->
    <TooltipWrapper>
      {#snippet trigger()}
        <Button.Root
          class="btn-secondary bg-red-700 text-red-100 hover:(bg-red-800 text-red-100) p-3"
          onclick={handleDelete}
        >
          <Trash size="16" />
        </Button.Root>
      {/snippet}
      Delete
    </TooltipWrapper>
  </div>
</div>
