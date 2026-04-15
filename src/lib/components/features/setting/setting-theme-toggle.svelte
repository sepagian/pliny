<script lang="ts">
  import { SunMoon } from "@lucide/svelte";
  import { Button } from "bits-ui";
  import { toggleMode } from "mode-watcher";
</script>

<Button.Root class="btn-secondary p-3" onclick={toggleMode}>
  <SunMoon size="16" />
  <span class="sr-only">Toggle theme</span>
</Button.Root>
