<script lang="ts">
  import { House, type Icon, LampCeiling } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { ButtonGroup } from "$lib/components/ui/button-group";

  interface Link {
    href: string;
    icon: typeof Icon;
    title: string;
  }
  const links: Link[] = [
    { href: "/", title: "Home", icon: House },
    { href: "/appliance", title: "Appliance", icon: LampCeiling },
  ];
</script>

<nav>
  <ButtonGroup class="fixed bottom-8 w-full gap-x-2">
    {#each links as { href, title, icon }}
      <a {href}>
        <Button class="w-full font-bold" size="lg">
          {@const Component = icon}
          <Component size="16" />
          {title}
        </Button>
      </a>
    {/each}
  </ButtonGroup>
</nav>
