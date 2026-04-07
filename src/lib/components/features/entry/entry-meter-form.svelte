<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    type Infer,
    type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { addMeter, updateMeter } from "$lib/actions/meter";
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
  import { useMeterEntries } from "$lib/stores/logs.svelte";
  import { type LogMeterSchema, logMeterSchema } from "$lib/utils/schema";

  let {
    id,
    onSuccess,
  }: {
    id?: string;
    onSuccess?: () => void;
  } = $props();

  const { meterForm } = getContext<{
    meterForm: SuperValidated<Infer<LogMeterSchema>>;
  }>("forms");

  const form = superForm(meterForm, {
    SPA: true,
    validators: zod4Client(logMeterSchema),
    onUpdate({ form }) {
      if (form.valid) {
        const date = new Date().toISOString().split("T")[0];
        const timestamp = new Date().toISOString();
        const data = {
          type: "meter" as const,
          meter: form.data.meter,
          date,
          timestamp,
        };
        if (form.data.id) {
          updateMeter(form.data.id, data);
        } else {
          addMeter(data);
        }
        handleSuccess();
      }
    },
  });

  const { form: formData, enhance } = form;

  const metersStore = useMeterEntries();
  const meter = $derived(id ? metersStore.find((e) => e.id === id) : undefined);

  function handleSuccess() {
    invalidateAll();
    onSuccess?.();
  }

  onMount(() => {
    if (meter) {
      formData.set({
        ...$formData,
        id: meter.id,
        meter: meter.meter,
      });
    }
  });
</script>

<form method="POST" use:enhance class="grid gap-8">
  <div class="grid gap-2 px-4">
    <FormField {form} name="meter" class="flex flex-col gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Meter (kWh)</FormLabel>
            <Input
              class="h-10"
              type="number"
              inputmode="numeric"
              {...props}
              bind:value={$formData.meter}
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs">
        Isi angka yang terlihat di meter listrik saat ini.
      </FormDescription>
      <FormFieldErrors />
    </FormField>
  </div>

  <div class="grid gap-2 px-4">
    <FormButton class="flex-1">Simpan</FormButton>
    <DrawerClose class="flex-1">Batalkan</DrawerClose>
  </div>
</form>
