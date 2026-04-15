<script lang="ts" module>
  import { AlertDialog } from "bits-ui";

  class ConfirmDeleteDialogState {
    open = $state(false);
    inputText = $state("");
    options = $state<ConfirmDeleteOptions | null>(null);
    loading = $state(false);

    constructor() {
      this.confirm = this.confirm.bind(this);
      this.cancel = this.cancel.bind(this);
    }

    newConfirmation(options: ConfirmDeleteOptions) {
      this.reset();
      this.options = options;
      this.open = true;
    }

    reset() {
      this.open = false;
      this.inputText = "";
      this.options = null;
    }

    confirm() {
      if (
        this.options?.input &&
        this.inputText !== this.options.input.confirmationText
      ) {
        return;
      }

      this.loading = true;
      this.options
        ?.onConfirm()
        .then(() => {
          this.open = false;
        })
        .finally(() => {
          this.loading = false;
        });
    }

    cancel() {
      this.options?.onCancel?.();
      this.open = false;
    }
  }

  const dialogState = new ConfirmDeleteDialogState();

  export interface ConfirmDeleteOptions {
    cancel?: {
      text?: string;
    };
    confirm?: {
      text?: string;
    };
    description: string;
    input?: {
      confirmationText: string;
    };
    onCancel?: () => void;
    onConfirm: () => Promise<unknown>;
    skipConfirmation?: boolean;
    title: string;
  }

  export function confirmDelete(options: ConfirmDeleteOptions) {
    if (options.skipConfirmation) {
      options.onConfirm();
      return;
    }

    dialogState.newConfirmation(options);
  }
</script>

<script lang="ts">
</script>

<AlertDialog.Root bind:open={dialogState.open}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay class="alert-overlay" />
    <AlertDialog.Content class="alert-content gap-y-6">
      <div class="grid gap-y-1">
        <AlertDialog.Title class="text-lg font-bold"
          >{dialogState.options?.title}</AlertDialog.Title
        >
        <AlertDialog.Description class="text-sm text-muted-foreground">
          {dialogState.options?.description}
        </AlertDialog.Description>
      </div>
      <form
        method="POST"
        onsubmit={(e) => {
          e.preventDefault();
          dialogState.confirm();
        }}
      >
        {#if dialogState.options?.input}
          <input
            bind:value={dialogState.inputText}
            placeholder={`Enter "${dialogState.options.input.confirmationText}" to confirm.`}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                dialogState.confirm();
              }
            }}
          >
        {/if}
        <div class="grid grid-cols-2 gap-x-2">
          <AlertDialog.Cancel
            type="button"
            onclick={dialogState.cancel}
            class="w-full bg-secondary py-2 rounded-lg"
          >
            {dialogState.options?.cancel?.text ?? "Cancel"}
          </AlertDialog.Cancel>
          <AlertDialog.Action
            class="w-full bg-red-800 text-red-100 py-2 rounded-lg"
            type="submit"
            disabled={dialogState.options?.input &&
              dialogState.inputText !== dialogState.options.input.confirmationText}
          >
            {dialogState.options?.confirm?.text ?? "Delete"}
          </AlertDialog.Action>
        </div>
      </form>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
