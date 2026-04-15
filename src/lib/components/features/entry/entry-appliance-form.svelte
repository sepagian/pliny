<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    type Infer,
    type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { Drawer } from "vaul-svelte";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { addAppliance, updateAppliance } from "$lib/actions/appliance";
  import { Label, Button } from "bits-ui";
  import { Field, Control, Description, FieldErrors, Fieldset } from "formsnap";
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

  const { form: formData, enhance, errors } = form;

  const appliancesStore = useAppliances();
  const appliance = $derived(
    id ? appliancesStore.find((a) => a.id === id) : undefined
  );

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
  <div class="grid gap-4 px-4">
    <Field {form} name="name">
      <div class="grid gap-y-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root class="text-sm">Nama Perangkat</Label.Root>
              <input
                class="input"
                type="text"
                {...props}
                bind:value={$formData.name}
              >
            </div>
          {/snippet}
        </Control>
        {#if !$errors.name}
          <Description class="text-xs">
            Beri nama perangkat agar mudah dikenali
          </Description>
        {:else}
          <FieldErrors class="text-destructive text-xs" />
        {/if}
      </div>
    </Field>

    <Field {form} name="watt">
      <div class="grid gap-y-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root class="text-sm">Daya (Watt)</Label.Root>
              <input
                class="input"
                type="number"
                inputmode="decimal"
                {...props}
                bind:value={$formData.watt}
              >
            </div>
          {/snippet}
        </Control>
        {#if !$errors.name}
          <Description class="text-xs">
            Isi sesuai daya listrik perangkat.
          </Description>
        {:else}
          <FieldErrors class="text-destructive text-xs" />
        {/if}
      </div>
    </Field>

    {#if !sessionBased}
      <Field {form} name="dailyHours">
        <div class="grid gap-y-1">
          <Control>
            {#snippet children({props})}
              <div class="grid gap-1">
                <Label.Root class="text-sm">Durasi (jam/hari)</Label.Root>
                <input
                  class="input"
                  type="number"
                  inputmode="decimal"
                  {...props}
                  bind:value={$formData.dailyHours}
                >
              </div>
            {/snippet}
          </Control>
          {#if !$errors.name}
            <Description class="text-xs">
              Berapa lama perangkat biasanya menyala setiap hari.
            </Description>
          {:else}
            <FieldErrors class="text-destructive text-xs" />
          {/if}
        </div>
      </Field>
    {/if}

    <Fieldset {form} name="sessionBased">
      <Control>
        <div class="flex gap-2 items-center">
          <input
            class="border-secondary size-6 items-center rounded-lg border transition-all duration-150"
            type="checkbox"
            id="sessionBased"
            bind:checked={sessionBased}
          >
          <Label.Root class="text-sm" id="session-label" for="sessionBased">
            Perangkat digunakan saat diperlukan
          </Label.Root>
        </div>
      </Control>
      <FieldErrors />
    </Fieldset>
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
