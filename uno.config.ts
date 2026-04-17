import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.148 0.004 228.8);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.148 0.004 228.8);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.148 0.004 228.8);
  --primary: oklch(0.841 0.238 128.85);
  --primary-foreground: oklch(0.405 0.101 131.063);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.963 0.002 197.1);
  --muted-foreground: oklch(0.56 0.021 213.5);
  --accent: oklch(0.963 0.002 197.1);
  --accent-foreground: oklch(0.218 0.008 223.9);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.925 0.005 214.3);
  --input: oklch(0.925 0.005 214.3);
  --ring: oklch(0.723 0.014 214.4);
  --chart-1: oklch(0.897 0.196 126.665);
  --chart-2: oklch(0.768 0.233 130.85);
  --chart-3: oklch(0.648 0.2 131.684);
  --chart-4: oklch(0.532 0.157 131.589);
  --chart-5: oklch(0.453 0.124 130.933);
}

.dark {
  --background: oklch(0.148 0.004 228.8);
  --foreground: oklch(0.987 0.002 197.1);
  --card: oklch(0.218 0.008 223.9);
  --card-foreground: oklch(0.987 0.002 197.1);
  --popover: oklch(0.218 0.008 223.9);
  --popover-foreground: oklch(0.987 0.002 197.1);
  --primary: oklch(0.768 0.233 130.85);
  --primary-foreground: oklch(0.405 0.101 131.063);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.275 0.011 216.9);
  --muted-foreground: oklch(0.723 0.014 214.4);
  --accent: oklch(0.275 0.011 216.9);
  --accent-foreground: oklch(0.987 0.002 197.1);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.56 0.021 213.5);
}

html, body {
  background-color: var(--background);
}
`,
    },
  ],
  theme: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      card: "var(--card)",
      "card-foreground": "var(--card-foreground)",
      popover: "var(--popover)",
      "popover-foreground": "var(--popover-foreground)",
      primary: "var(--primary)",
      "primary-foreground": "var(--primary-foreground)",
      secondary: "var(--secondary)",
      "secondary-foreground": "var(--secondary-foreground)",
      muted: "var(--muted)",
      "muted-foreground": "var(--muted-foreground)",
      accent: "var(--accent)",
      "accent-foreground": "var(--accent-foreground)",
      destructive: "var(--destructive)",
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      "chart-1": "var(--chart-1)",
      "chart-2": "var(--chart-2)",
      "chart-3": "var(--chart-3)",
      "chart-4": "var(--chart-4)",
      "chart-5": "var(--chart-5)",
    },
  },
  shortcuts: {
    "card-primary":
      "p-4 rounded-lg bg-primary grid gap-1 hover:bg-primary/90 text-primary-foreground",
    "card-secondary":
      "p-4 rounded-lg bg-secondary grid gap-1 hover:bg-secondary/90 text-secondary-foreground",
    "btn-primary":
      "bg-primary text-primary-foreground hover:bg-primary/95 inline-flex items-center justify-center text-[15px] font-semibold rounded-lg gap-2",
    "btn-secondary":
      "bg-secondary text-secondary-foreground hover:bg-secondary/95 inline-flex items-center justify-center text-[15px] font-semibold active:scale-[0.98] active:transition-all rounded-lg gap-2",
    "tooltip-content": "origin-(--bits-tooltip-content-transform-origin)",
    "tooltip-main":
      "rounded-md bg-foreground text-background shadow-popover outline-hidden z-0 flex items-center justify-center py-1.5 px-2 text-xs font-medium",
    "tabs-list":
      "bg-secondary dark:bg-background rounded-lg grid w-full grid-cols-3 gap-1 p-1 text-sm font-semibold leading-[0.01em] dark:border dark:border-neutral-600/30",
    "tabs-trigger":
      "dark:data-[state=active]:bg-muted rounded-sm h-8 bg-transparent py-2 data-[state=active]:bg-white",
    "alert-overlay": "fixed inset-0 z-50 bg-black/80",
    "alert-content":
      "rounded-xl grid gap-y-4 bg-background outline-hidden fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border border-secondary p-6 sm:max-w-lg md:w-full",
    input: "h-10 border rounded-lg border-input ring-offset-background bg-secondary/30 px-2",
    "select-content":
      " border-muted bg-background shadow-popover outline-hidden z-50 h-fit max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1.5 py-2",
    "select-item":
      "rounded-lg data-[highlighted]:bg-secondary outline-hidden flex w-full select-none items-center px-4 text-sm capitalize h-10",
  },
  safelist: [
    "p-*",
    "px-*",
    "py-*",
    "pt-*",
    "pb-*",
    "pl-*",
    "pr-*",
    "m-*",
    "mx-*",
    "my-*",
    "mt-*",
    "mb-*",
    "ml-*",
    "mr-*",
    "gap-*",
    "gap-x-*",
    "gap-y-*",
    "size-*",
    "w-*",
    "min-w-*",
    "max-w-*",
    "h-*",
    "min-h-*",
    "max-h-*",
    "bg-*",
    "text-*",
    "border-*",
    "rounded-*",
    "font-*",
    "leading-*",
    "tracking-*",
    "shadow-*",
    "opacity-*",
    "inline-flex",
    "grid-cols-*",
    "col-span-*",
    "grid-row-*",
    "row-span-*",
    "justify-*",
    "items-*",
    "self-*",
    "content-*",
    "absolute",
    "relative",
    "fixed",
    "sticky",
    "inset-*",
    "top-*",
    "bottom-*",
    "left-*",
    "right-*",
    "z-*",
    "transition-*",
    "duration-*",
    "delay-*",
    "scale-*",
    "translate-*",
    "rotate-*",
    "skew-*",
    "animate-*",
    "cursor-*",
    "pointer-events-*",
    "select-*",
    "shrink-0",
    "grow",
    "grow-0",
    "order-*",
    "aspect-*",
  ],
  presets: [
    presetWind4({
      dark: "class",
      preflights: {
        reset: true,
      },
    }),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Inter",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
});
