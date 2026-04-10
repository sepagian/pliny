<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    type Infer,
    type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { addAppliance, updateAppliance } from "$lib/actions/appliance";
  import { Checkbox } from "$lib/components/ui/checkbox";
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
  import { useAppliances } from "$lib/stores/appliance.svelte";
  import { type ApplianceSchema, applianceSchema } from "$lib/utils/schema";

  let {
    id,
    onSuccess,
  }: {
    id?: string;
    onSuccess?: () => void;
  } = $props();

  let sessionBased = $state(false);

  const { applianceForm } = getContext<{
    applianceForm: SuperValidated<Infer<ApplianceSchema>>;
  }>("appliance-form");

  const form = superForm(applianceForm, {
    SPA: true,
    validators: zod4Client(applianceSchema),
    onUpdate({ form }) {
      if (form.valid) {
        const data = {
          name: form.data.name,
          watt: form.data.watt,
          sessionBased: sessionBased ? true : undefined,
          dailyHours: sessionBased ? undefined : (form.data.dailyHours ?? 0),
        };
        if (form.data.id) {
          updateAppliance(form.data.id, data);
        } else {
          addAppliance(data);
        }
        handleSuccess();
      }
    },
  });

  const { form: formData, enhance } = form;

  const appliancesStore = useAppliances();
  const appliance = $derived(
    id ? appliancesStore.find((a) => a.id === id) : undefined
  );

  function handleCheck(e: boolean) {
    sessionBased = e;
  }

  function handleSuccess() {
    invalidateAll();
    onSuccess?.();
  }

  onMount(() => {
    if (appliance) {
      formData.set({
        ...$formData,
        id: appliance.id,
        name: appliance.name,
        watt: appliance.watt as number,
        dailyHours: appliance.dailyHours,
      });
      sessionBased = appliance.sessionBased === true;
    }
  });
</script>

<form method="POST" use:enhance class="grid gap-8 mb-6">
  <div class="grid gap-2 px-4">
    <FormField {form} name="name" class="grid gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Nama Perangkat</FormLabel>
            <Input
              class="h-10"
              type="text"
              {...props}
              bind:value={$formData.name}
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs">
        Beri nama perangkat agar mudah dikenali (misalnya AC kamar atau kipas).
      </FormDescription>
      <FormFieldErrors />
    </FormField>

    <FormField {form} name="watt" class="grid gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Daya (Watt)</FormLabel>
            <Input
              class="h-10"
              type="number"
              inputmode="decimal"
              {...props}
              bind:value={$formData.watt}
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs">
        Isi sesuai daya listrik perangkat. Biasanya tertera di label atau
        spesifikasi.
      </FormDescription>
      <FormFieldErrors />
    </FormField>

    {#if !sessionBased}
      <FormField {form} name="dailyHours" class="grid gap-1">
        <FormControl>
          {#snippet children({props})}
            <div class="grid gap-2">
              <FormLabel>Durasi (jam/hari)</FormLabel>
              <Input
                class="h-10"
                type="number"
                inputmode="decimal"
                {...props}
                bind:value={$formData.dailyHours}
              />
            </div>
          {/snippet}
        </FormControl>
        <FormDescription class="text-xs">
          Berapa lama perangkat biasanya menyala setiap hari.
        </FormDescription>
        <FormFieldErrors />
      </FormField>
    {/if}

    <FormField {form} name="sessionBased" class="grid gap-1">
      <FormControl>
        <div class="flex gap-2">
          <Checkbox
            id="sessionBased"
            bind:checked={sessionBased}
            onCheckedChange={handleCheck}
          />
          <FormLabel> Perangkat digunakan saat diperlukan </FormLabel>
        </div>
      </FormControl>
      <FormFieldErrors />
    </FormField>
  </div>

  <div class="grid gap-2 px-4">
    <FormButton class="flex-1">Simpan</FormButton>
    <DrawerClose class="flex-1">Batalkan</DrawerClose>
  </div>
</form>
