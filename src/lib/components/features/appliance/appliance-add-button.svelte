<script lang="ts">
  import { motion } from "@humanspeak/svelte-motion";
  import { Plus } from "@lucide/svelte";
  import ApplianceForm from "$lib/components/features/entry/entry-appliance-form.svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";

  let open = $state(false);
</script>

<DrawerWrapper
  bind:open
  title="Perangkat Baru"
  description="Tambahkan perangkat yang ingin kamu pantau penggunaan listriknya."
>
  {#snippet trigger()}
    <motion.button
      class="btn-primary h-12 px-4 w-full"
      whileHover={{ scale:0.98 }}
      whileTap={{ scale:0.9}}
      ><Plus size="16" />Tambah Perangkat</motion.button
    >
  {/snippet}
  {#snippet content()}
    <ApplianceForm onSuccess={() => (open = false)} />
  {/snippet}
</DrawerWrapper>
