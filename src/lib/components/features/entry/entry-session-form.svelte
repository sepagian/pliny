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
  import { Drawer } from "vaul-svelte";
  import { Label, Button, Select } from "bits-ui";
  import { Field, Control, Description, FieldErrors } from "formsnap";
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

  const selectedAppliance = $derived(
    applianceList.find((a) => a.value === $formData.appliance)
  );
</script>

<form method="POST" use:enhance class="grid gap-8">
  <div class="grid gap-2 px-4 h-50">
    <Field {form} name="appliance">
      <div class="flex flex-col gap-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root>Perangkat</Label.Root>
              <Select.Root type="single" bind:value={$formData.appliance}>
                <Select.Trigger {...props} class="input text-sm text-left">
                  {selectedAppliance?.label ?? "Pilih perangkat"}
                </Select.Trigger>
                <Select.Content sideOffset={6} class="select-content">
                  {#each applianceList as item}
                    <Select.Item value={item.value} class="select-item">
                      <div class="flex justify-between gap-2 items-center">
                        <span>{item.label}</span>
                        <span class="text-sm text-gray-500">
                          {item.watt}
                          Watt
                        </span>
                      </div>
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          {/snippet}
        </Control>
        <Description class="text-xs"
          >Pilih atau isi perangkat yang digunakan (misalnya AC).</Description
        >
        <FieldErrors />
      </div>
    </Field>

    <Field {form} name="duration">
      <div class="flex flex-col gap-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root>Durasi (jam)</Label.Root>
              <input
                class="input"
                type="number"
                inputmode="numeric"
                {...props}
                bind:value={$formData.duration}
              >
            </div>
          {/snippet}
        </Control>
        <Description class="text-xs">
          Berapa lama perangkat digunakan.
        </Description>
        <FieldErrors />
      </div>
    </Field>
  </div>

  <div class="grid gap-2 px-4">
    <Button.Root type="submit" class="flex-1 font-bold btn-primary h-10"
      >Simpan</Button.Root
    >
    <Drawer.Close class="flex-1 font-normal btn-secondary h-10"
      >Batalkan</Drawer.Close
    >
  </div>
</form>
