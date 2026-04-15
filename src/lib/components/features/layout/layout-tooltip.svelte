<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { type Snippet } from "svelte";

  type Props = Tooltip.RootProps & {
    trigger: Snippet;
    triggerProps?: Tooltip.TriggerProps;
  };

  let {
    open = $bindable(false),
    children,
    trigger,
    triggerProps = {},
    ...restProps
  }: Props = $props();
</script>

<!--
 Ensure you have a `Tooltip.Provider` component wrapping
 your root layout content
-->
<Tooltip.Root bind:open {...restProps} delayDuration={0}>
  <Tooltip.Trigger {...triggerProps}> {@render trigger()} </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content class="tooltip-content" sideOffset={6}>
      <Tooltip.Arrow />
      <div class="tooltip-main">{@render children?.()}</div>
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
