<script lang="ts">
  import Logo from "$lib/assets/logo.svg?raw";
  import LogoLight from "$lib/assets/logo-light.svg?raw";
  import ThemeSwitcher from "$lib/components/features/setting/setting-theme-toggle.svelte";
</script>

<section class="flex justify-between items-center">
  <div class="dark:hidden inline size-w-20 size-h-auto">{@html Logo}</div>
  <div class="hidden dark:inline size-w-20 size-h-auto">{@html LogoLight}</div>
  <ThemeSwitcher />
</section>
