<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    type Infer,
    type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { addTopup, updateTopup } from "$lib/actions/topup";
  import { Drawer } from "vaul-svelte";
  import { Label, Button, Select } from "bits-ui";
  import { Field, Control, Description, FieldErrors } from "formsnap";
  import { useTopupEntries } from "$lib/stores/logs.svelte";
  import { type LogTopUpSchema, logTopUpSchema } from "$lib/utils/schema";

  let {
    id,
    onSuccess,
  }: {
    id?: string;
    onSuccess?: () => void;
  } = $props();

  const { topUpForm } = getContext<{
    topUpForm: SuperValidated<Infer<LogTopUpSchema>>;
  }>("forms");

  const form = superForm(topUpForm, {
    SPA: true,
    validators: zod4Client(logTopUpSchema),
    onUpdate({ form }) {
      if (form.valid) {
        const date = $formData.date;
        const timestamp = $formData.date;
        const data = {
          type: "topup" as const,
          amount: form.data.amount,
          date,
          timestamp,
        };
        if (form.data.id) {
          updateTopup(form.data.id, data);
        } else {
          addTopup(data);
        }
        handleSuccess();
      }
    },
  });

  const { form: formData, enhance } = form;

  const topUpStore = useTopupEntries();
  const topUp = $derived(id ? topUpStore.find((e) => e.id === id) : undefined);

  function handleSuccess() {
    invalidateAll();
    onSuccess?.();
  }

  onMount(() => {
    if (topUp) {
      formData.set({
        ...$formData,
        id: topUp.id,
        date: topUp.timestamp.split("T")[0],
        amount: topUp.amount,
      });
    }
  });
</script>

<form method="POST" use:enhance class="grid gap-8">
  <div class="grid gap-2 px-4 h-50">
    <Field {form} name="date">
      <div class="flex flex-col gap-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root>Tanggal</Label.Root>
              <input
                type="date"
                {...props}
                bind:value={$formData.date}
                class="input"
              >
            </div>
          {/snippet}
        </Control>
        <Description class="text-xs"
          >Kapan kamu melakukan top up token listrik</Description
        >
        <FieldErrors />
      </div>
    </Field>

    <Field {form} name="amount">
      <div class="flex flex-col gap-1">
        <Control>
          {#snippet children({props})}
            <div class="grid gap-1">
              <Label.Root>Jumlah (kWh)</Label.Root>
              <input
                class="input"
                type="number"
                inputmode="numeric"
                {...props}
                bind:value={$formData.amount}
              >
            </div>
          {/snippet}
        </Control>
        <Description class="text-xs"
          >Masukkan jumlah kWh yang kamu dapat dari top up</Description
        >
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
