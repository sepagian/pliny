<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import LogNavigation from "$lib/components/features/log/log-navigation.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Item, ItemContent } from "$lib/components/ui/item";

  let open = $state(false);
</script>

<Item class="p-0">
  <ItemContent>
    <DrawerWrapper
      bind:open
      title="Log Listrik"
      description="Tambahkan data untuk membantu memantau penggunaan dan sisa listrik di rumahmu."
    >
      {#snippet trigger()}
        <Button
          type="button"
          variant="default"
          class="font-bold w-full"
          size="lg"
        >
          <Plus size="16" />
          Log Baru
        </Button>
      {/snippet}
      {#snippet content()}
        <LogNavigation onSuccess={() => (open = false)} />
      {/snippet}
    </DrawerWrapper>
  </ItemContent>
</Item>
