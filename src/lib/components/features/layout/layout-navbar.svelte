<script lang="ts">
  import { motion } from "@humanspeak/svelte-motion";
  import { House, type Icon, LampCeiling } from "@lucide/svelte";

  interface Link {
    href: string;
    icon: typeof Icon;
    title?: string;
  }
  const links: Link[] = [
    { href: "/", icon: House },
    { href: "/peralatan", title: "peralatan", icon: LampCeiling },
  ];
</script>

<nav>
  <div class="flex fixed bottom-6 w-full gap-x-2">
    {#each links as { href, title, icon }}
      <a {href}>
        <motion.button
          class="font-bold btn-primary h-10 w-fit px-4 capitalize"
          whileHover={{ scale:0.98 }}
          whileTap={{ scale:0.95}}
        >
          {@const Component = icon}
          <Component size="16" />
          {title}
        </motion.button>
      </a>
    {/each}
  </div>
</nav>
