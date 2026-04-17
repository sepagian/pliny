<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import { pwaInfo } from "virtual:pwa-info";
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

  onMount(async () => {
    initApplianceStore();
    initMeterStore();
    initSessionStore();
    initTopupStore();
    initDailyStore();

    if (pwaInfo) {
      const { registerSW } = await import("virtual:pwa-register");
      registerSW({
        immediate: true,
        onRegistered(r) {
          console.log(`SW Registered: ${r}`);
        },
        onRegisterError(error) {
          console.log("SW registration error", error);
        },
      });
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <title>Pliny - Pelacak Listrik Prabayar</title>
  <meta
    name="description"
    content="Lacak penggunaan listrik prabayar, pantau perangkat elektronik, dan estimasi sisa saldo untuk rumah tangga Indonesia."
  >

  <meta property="og:title" content="Pliny - Pelacak Listrik Prabayar">
  <meta
    property="og:description"
    content="Lacak penggunaan listrik prabayar dan pantau konsumsi perangkat elektronik."
  >
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://pliny.sepagian.xyz">
  <meta property="og:image" content="https://pliny.sepagian.xyz/og-image.png">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Pliny - Pelacak Listrik Prabayar">
  <meta
    name="twitter:description"
    content="Lacak penggunaan listrik prabayar dan pantau konsumsi perangkat elektronik."
  >
  <meta name="twitter:image" content="https://pliny.sepagian.xyz/og-image.png">

  <meta name="theme-color" content="#ffffff">
  {@html pwaInfo ? pwaInfo.webManifest.linkTag : ""}
</svelte:head>

<ModeWatcher />
<Tooltip.Provider>
  <main
    class="max-w-2xl mx-auto h-screen p-4 grid grid-flow-row auto-rows-max gap-y-4"
  >
    <Header />
    {@render children()}
    <NavBar />
  </main>
</Tooltip.Provider>
