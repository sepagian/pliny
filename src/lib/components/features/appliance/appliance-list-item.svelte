<script lang="ts">
  import { Pencil, Trash } from "@lucide/svelte";
  import { deleteAppliance } from "$lib/actions/appliance";
  import ApplianceForm from "$lib/components/features/entry/entry-appliance-form.svelte";
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

<Item variant="muted">
  <ItemContent>
    <ItemTitle> {appliance.name} </ItemTitle>
    <div class="flex gap-2">
      <ItemDescription class="text-xs">{appliance.watt} Watt</ItemDescription>
      {#if appliance.dailyHours}
        <span>·</span>
        <ItemDescription class="text-xs">
          {appliance.dailyHours}
          jam/hari
        </ItemDescription>
      {/if}
    </div>
  </ItemContent>
  <ItemActions>
    <ConfirmDeleteDialog />
    <!-- Edit Button -->
    <Tooltip>
      <TooltipTrigger>
        <DrawerWrapper
          title="Edit Perangkat"
          description="Edit perangkat"
          bind:open
        >
          {#snippet trigger()}
            <Button variant="secondary" size="sm">
              <Pencil size="12" />
            </Button>
          {/snippet}
          {#snippet content()}
            <ApplianceForm id={appliance.id} onSuccess={() => (open = false)} />
          {/snippet}
        </DrawerWrapper>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
    <!-- Delete Button -->
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
