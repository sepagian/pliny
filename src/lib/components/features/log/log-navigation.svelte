<script lang="ts">
  import type { Component } from "svelte";
  import LogMeterForm from "$lib/components/features/entry/entry-meter-form.svelte";
  import SessionForm from "$lib/components/features/entry/entry-session-form.svelte";
  import TopUpForm from "$lib/components/features/entry/entry-topup-form.svelte";
  import { Tabs } from "bits-ui";

  interface Tab {
    component: Component;
    isActive: boolean;
    label: string;
    value: string;
  }

  let {
    onSuccess,
  }: {
    onSuccess?: () => void;
  } = $props();

  const tabs: Tab[] = [
    {
      value: "top-up",
      label: "Top-Up",
      component: TopUpForm,
      isActive: true,
    },
    {
      value: "meter",
      label: "Meter",
      component: LogMeterForm,
      isActive: true,
    },
    {
      value: "pemakaian",
      label: "Pemakaian",
      component: SessionForm,
      isActive: true,
    },
  ];
</script>

<Tabs.Root value="top-up" class="grid gap-4">
  <div class="mx-4">
    <Tabs.List class="tabs-list">
      {#each tabs as { value, label }}
        <Tabs.Trigger {value} class="tabs-trigger">{label}</Tabs.Trigger>
      {/each}
    </Tabs.List>
  </div>
  {#each tabs as { value, component }}
    <Tabs.Content {value} class="w-full">
      {@const Component = component}
      <div class="mb-6"><Component {onSuccess} /></div>
    </Tabs.Content>
  {/each}
</Tabs.Root>
