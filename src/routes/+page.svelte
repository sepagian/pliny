<script lang="ts">
  import { setContext } from "svelte";
  import Action from "$lib/components/features/dashboard/dashboard-action.svelte";
  import Balance from "$lib/components/features/dashboard/dashboard-balance.svelte";
  import Usage from "$lib/components/features/dashboard/dashboard-usage.svelte";
  import LogList from "$lib/components/features/log/log-list.svelte";
  import type { PageData } from "./$types.ts";

  let { data }: { data: PageData } = $props();

  setContext("forms", {
    topUpForm: data.topUpForm,
    meterForm: data.meterForm,
    sessionForm: data.sessionForm,
  });
</script>

<section class="grid grid-cols-6"><Balance /></section>
<Usage />
<Action />
<LogList />
