<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import LogNavigation from "$lib/components/features/log/log-navigation.svelte";

  let open = $state(false);
</script>

<DrawerWrapper
  bind:open
  title="Log Listrik"
  description="Tambahkan data untuk membantu memantau penggunaan dan sisa listrik di rumahmu."
>
  {#snippet trigger()}
    <button type="button" class="btn-primary">
      <Plus size="16" />
      Log Baru
    </button>
  {/snippet}
  {#snippet content()}
    <LogNavigation onSuccess={() => (open = false)} />
  {/snippet}
</DrawerWrapper>
