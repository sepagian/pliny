<script lang="ts">
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
  <div
    class="i-lucide:sun h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
  ></div>
  <div
    class="i-lucide:moon absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
  ></div>
  <span class="sr-only">Toggle theme</span>
</Button>
