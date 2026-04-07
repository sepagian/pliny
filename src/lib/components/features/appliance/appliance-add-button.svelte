<script lang="ts">
  import { Plus } from "@lucide/svelte";
  import ApplianceForm from "$lib/components/features/entry/entry-appliance-form.svelte";
  import DrawerWrapper from "$lib/components/features/layout/layout-drawer.svelte";
  import { Button } from "$lib/components/ui/button";

  interface Props {
    buttonClass?: string;
  }

  let { buttonClass }: Props = $props();
  let open = $state(false);
</script>

<DrawerWrapper
  bind:open
  title="Perangkat Baru"
  description="Tambahkan perangkat yang ingin kamu pantau penggunaan listriknya."
>
  {#snippet trigger()}
    <Button class={buttonClass} size="sm">
      <Plus size="16" />Tambah Perangkat
    </Button>
  {/snippet}
  {#snippet content()}
    <ApplianceForm onSuccess={() => (open = false)} />
  {/snippet}
</DrawerWrapper>
