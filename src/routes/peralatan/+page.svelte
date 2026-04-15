<script lang="ts">
  import { setContext } from "svelte";
  import ApplianceList from "$lib/components/features/appliance/appliance-list.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  setContext("appliance-form", {
    applianceForm: data.applianceForm,
  });
</script>

<ApplianceList />
