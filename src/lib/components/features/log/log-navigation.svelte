<script lang="ts">
  import type { Component } from "svelte";
  import LogMeterForm from "$lib/components/features/entry/entry-meter-form.svelte";
  import SessionForm from "$lib/components/features/entry/entry-session-form.svelte";
  import TopUpForm from "$lib/components/features/entry/entry-topup-form.svelte";
  import {
    UnderlineTabs,
    UnderlineTabsContent,
    UnderlineTabsList,
    UnderlineTabsTrigger,
  } from "$lib/components/ui/underline-tabs";

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

<UnderlineTabs value="top-up" class="grid gap-4">
  <div class="">
    <UnderlineTabsList class="grid grid-cols-3 text-center">
      {#each tabs as { value, label }}
        <UnderlineTabsTrigger {value}>{label}</UnderlineTabsTrigger>
      {/each}
    </UnderlineTabsList>
  </div>
  {#each tabs as { value, component }}
    <UnderlineTabsContent {value}>
      {@const Component = component}
      <div class="mb-6"><Component {onSuccess} /></div>
    </UnderlineTabsContent>
  {/each}
</UnderlineTabs>
