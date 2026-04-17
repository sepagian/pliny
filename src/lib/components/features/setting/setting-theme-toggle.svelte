<script lang="ts">
  import { motion } from "@humanspeak/svelte-motion";
  import { SunMoon } from "@lucide/svelte";
  import { toggleMode } from "mode-watcher";
</script>

<motion.button
  class="btn-secondary p-3 w-fit"
  onclick={toggleMode}
  whileHover={{ scale:0.98 }}
  whileTap={{ scale:0.9}}
>
  <SunMoon size="16" />
  <span class="sr-only">Toggle theme</span>
</motion.button>
