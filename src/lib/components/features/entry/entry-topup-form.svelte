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
    <FormField {form} name="date" class="flex flex-col gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Tanggal</FormLabel>
            <Input
              type="date"
              {...props}
              bind:value={$formData.date}
              class="h-10"
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs"
        >Kapan kamu melakukan top up token listrik</FormDescription
      >
      <FormFieldErrors />
    </FormField>

    <FormField {form} name="amount" class="grid gap-1">
      <FormControl>
        {#snippet children({props})}
          <div class="grid gap-2">
            <FormLabel>Jumlah (kWh)</FormLabel>
            <Input
              class="h-10"
              type="number"
              inputmode="numeric"
              {...props}
              bind:value={$formData.amount}
            />
          </div>
        {/snippet}
      </FormControl>
      <FormDescription class="text-xs"
        >Masukkan jumlah kWh yang kamu dapat dari top up</FormDescription
      >
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
