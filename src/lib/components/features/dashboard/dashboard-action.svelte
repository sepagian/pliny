<script lang="ts">
  import { motion } from "@humanspeak/svelte-motion";
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
      <motion.button
        type="button"
        class="btn-primary h-14 w-full"
        whileHover={{ scale:0.98 }}
        whileTap={{ scale:0.9}}
      >
        <Plus size="16" />
        Log Baru
      </motion.button>
    {/snippet}
    {#snippet content()}
      <LogNavigation onSuccess={() => (open = false)} />
    {/snippet}
  </DrawerWrapper>
