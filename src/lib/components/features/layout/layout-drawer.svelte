<script lang="ts">
  import { Drawer } from "vaul-svelte";

  let {
    trigger,
    title,
    description,
    content = undefined,
    triggerProps = undefined,
    open = $bindable(false),
  } = $props();
</script>

<Drawer.Root bind:open shouldScaleBackground>
  <Drawer.Trigger {...triggerProps} data-props="drawer-trigger">
    {@render trigger()}
  </Drawer.Trigger>

  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/80" />
    <Drawer.Content
      class="fixed bottom-0 left-0 right-0 mt-24 flex h-fit flex-col rounded-t-xl bg-background"
    >
      <div class="mx-auto w-full max-w-sm pt-4 flex flex-col gap-2">
        <div
          class="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300"
        ></div>
        <div class="flex flex-col gap-0 px-4">
          <Drawer.Title class="font-medium">{title}</Drawer.Title>
          <Drawer.Description class="text-sm text-muted-foreground"
            >{description}</Drawer.Description
          >
        </div>
        {@render content?.()}
      </div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
