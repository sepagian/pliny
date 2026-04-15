<script lang="ts">
  import { House, type Icon, LampCeiling } from "@lucide/svelte";
  import { Button } from "bits-ui";

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
        <Button.Root class="font-bold btn-primary h-10 w-fit px-4 capitalize">
          {@const Component = icon}
          <Component size="16" />
          {title}
        </Button.Root>
      </a>
    {/each}
  </div>
</nav>
