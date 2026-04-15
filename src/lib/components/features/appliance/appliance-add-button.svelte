<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import { Button } from "bits-ui";
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
    <Button.Root class="btn-primary h-12 px-4 w-full"
      ><Plus size="16" />Tambah Perangkat</Button.Root
    >
  {/snippet}
  {#snippet content()}
    <ApplianceForm onSuccess={() => (open = false)} />
  {/snippet}
</DrawerWrapper>
