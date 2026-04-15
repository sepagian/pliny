<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    type Infer,
    type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { addSession, updateSession } from "$lib/actions/session";
  import { DrawerClose } from "$lib/components/ui/drawer";
  import {
    FormButton,
    FormControl,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
  import { applianceStore } from "$lib/stores/appliance.svelte";
  import { useSessionEntries } from "$lib/stores/logs.svelte";
  import type { Appliance } from "$lib/types";
  import { type LogSessionSchema, logSessionSchema } from "$lib/utils/schema";
  import { toKwh } from "$lib/utils/calc";

  let {
    id,
    onSuccess,
  }: {
    id?: string;
    onSuccess?: () => void;
  } = $props();

  const { sessionForm } = getContext<{
    sessionForm: SuperValidated<Infer<LogSessionSchema>>;
  }>("forms");

  const appliances = $derived(
    applianceStore.appliances.filter((a: Appliance) => a.sessionBased === true)
  );

  const form = superForm(sessionForm, {
    SPA: true,
    validators: zod4Client(logSessionSchema),
    onUpdate({ form }) {
      if (form.valid) {
        const date = new Date().toISOString().split("T")[0];
        const timestamp = new Date().toISOString();
        const appliance = appliances.find((a) => a.id === form.data.appliance);
        const data = {
          type: "session" as const,
          appliance: appliance?.name ?? "",
          duration: form.data.duration,
          kwh: toKwh(appliance?.watt as number, form.data.duration),
          date,
          timestamp,
        };
        if (form.data.id) {
          updateSession(form.data.id, data);
        } else {
          addSession(data);
        }
        handleSuccess();
      }
    },
  });

  const { form: formData, enhance } = form;

  const sessionsStore = useSessionEntries();
  const session = $derived(
    id ? sessionsStore.find((e) => e.id === id) : undefined
  );

  const appliance = $derived(
    session
      ? applianceStore.appliances.find((a) => a.name === session.appliance)
      : undefined
  );

  function handleSuccess() {
    invalidateAll();
    onSuccess?.();
  }

  onMount(() => {
    if (session && appliance) {
      formData.set({
        ...$formData,
        id: session.id,
        appliance: appliance.id,
        duration: session.duration,
      });
    }
  });

  const applianceList = $derived(
    appliances.map((a: Appliance) => ({
      value: a.id,
      label: a.name,
      watt: a.watt,
      kwh: (a.watt as number) / 1000,
    }))
  );
</script>

<form method="POST" use:enhance class="grid gap-8">
  <div class="grid gap-2 px-4 h-50">
    <FormField {form} name="appliance" class="flex flex-col gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Perangkat</FormLabel>
            <NativeSelect
              bind:value={$formData.appliance}
              class="w-full"
              style="height:2.5rem"
              aria-label="Pilih perangkat"
              placeholder="Pilih perangkat"
            >
              {#each applianceList as item (item.value)}
                <NativeSelectOption {...props} value={item.value} class="h-10"
                  >{item.label}</NativeSelectOption
                >
              {/each}
            </NativeSelect>
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs"
        >Pilih atau isi perangkat yang digunakan (misalnya AC).</FormDescription
      >
      <FormFieldErrors />
    </FormField>

    <FormField {form} name="duration" class="grid gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Durasi (jam)</FormLabel>
            <Input
              class="h-10"
              type="number"
              inputmode="numeric"
              {...props}
              bind:value={$formData.duration}
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs">
        Berapa lama perangkat digunakan.
      </FormDescription>
      <FormFieldErrors />
    </FormField>
  </div>

  <div class="grid gap-2 px-4">
    <FormButton class="flex-1 font-bold btn-primary h-10">Simpan</FormButton>
    <DrawerClose class="flex-1 font-normal btn-secondary h-10"
      >Batalkan</DrawerClose
    >
  </div>
</form>
