<script lang="ts">
  import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "$lib/components/ui/drawer";

  let {
    trigger,
    title,
    description,
    content = undefined,
    triggerProps = undefined,
    open = $bindable(false),
  } = $props();
</script>

<Drawer bind:open>
  <DrawerTrigger {...triggerProps} data-props="drawer-trigger">
    {@render trigger()}
  </DrawerTrigger>

  <DrawerContent>
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      {@render content?.()}
    </div>
  </DrawerContent>
</Drawer>
