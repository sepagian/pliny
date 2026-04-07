<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import { TooltipProvider } from "$lib/components/ui/tooltip";
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import Header from "$lib/components/features/layout/layout-header.svelte";
  import NavBar from "$lib/components/features/layout/layout-navbar.svelte";
  import { initApplianceStore } from "$lib/stores/appliance.svelte";
  import {
    initDailyStore,
    initMeterStore,
    initSessionStore,
    initTopupStore,
  } from "$lib/stores/logs.svelte";

  let { children } = $props();

  onMount(() => {
    initApplianceStore();
    initMeterStore();
    initSessionStore();
    initTopupStore();
    initDailyStore();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <title>pliny</title>
</svelte:head>

<ModeWatcher />
<TooltipProvider>
  <main class="max-w-2xl mx-auto h-screen p-4 flex flex-col gap-y-5">
    <Header />
    {@render children()}
    <NavBar />
  </main>
</TooltipProvider>
