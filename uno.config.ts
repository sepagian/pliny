import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { presetLightDark } from "unocss-preset-light-dark";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
        theme: {
          mode: true,
        },
      },
    }),
    presetAttributify(),
    presetIcons(),
    presetLightDark({
      dark: "class",
      colors: {
        background: {
          light: "oklch(1 0 0)",
          dark: "oklch(0.148 0.004 228.8)",
        },
        foreground: {
          light: "oklch(0.148 0.004 228.8)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        card: {
          light: "oklch(1 0 0)",
          dark: "oklch(0.218 0.008 223.9)",
        },
        "card-foreground": {
          light: "oklch(0.148 0.004 228.8)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        popover: {
          light: "oklch(1 0 0)",
          dark: "oklch(0.218 0.008 223.9)",
        },
        "popover-foreground": {
          light: "oklch(0.148 0.004 228.8)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        primary: {
          light: "oklch(0.841 0.238 128.85)",
          dark: "oklch(0.768 0.233 130.85)",
        },
        "primary-foreground": {
          light: "oklch(0.405 0.101 131.063)",
          dark: "oklch(0.405 0.101 131.063)",
        },
        secondary: {
          light: "oklch(0.967 0.001 286.375)",
          dark: "oklch(0.274 0.006 286.033)",
        },
        "secondary-foreground": {
          light: "oklch(0.21 0.006 285.885)",
          dark: "oklch(0.985 0 0)",
        },
        muted: {
          light: "oklch(0.963 0.002 197.1)",
          dark: "oklch(0.275 0.011 216.9)",
        },
        "muted-foreground": {
          light: "oklch(0.56 0.021 213.5)",
          dark: "oklch(0.723 0.014 214.4)",
        },
        accent: {
          light: "oklch(0.963 0.002 197.1)",
          dark: "oklch(0.275 0.011 216.9)",
        },
        "accent-foreground": {
          light: "oklch(0.218 0.008 223.9)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        destructive: {
          light: "oklch(0.577 0.245 27.325)",
          dark: "oklch(0.704 0.191 22.216)",
        },
        border: {
          light: "oklch(0.925 0.005 214.3)",
          dark: "oklch(1 0 0 / 10%)",
        },
        input: {
          light: "oklch(0.925 0.005 214.3)",
          dark: "oklch(1 0 0 / 15%)",
        },
        ring: {
          light: "oklch(0.723 0.014 214.4)",
          dark: "oklch(0.56 0.021 213.5)",
        },
        "chart-1": {
          light: "oklch(0.897 0.196 126.665)",
          dark: "oklch(0.897 0.196 126.665)",
        },
        "chart-2": {
          light: "oklch(0.768 0.233 130.85)",
          dark: "oklch(0.768 0.233 130.85)",
        },
        "chart-3": {
          light: "oklch(0.648 0.2 131.684)",
          dark: "oklch(0.648 0.2 131.684)",
        },
        "chart-4": {
          light: "oklch(0.532 0.157 131.589)",
          dark: "oklch(0.532 0.157 131.589)",
        },
        "chart-5": {
          light: "oklch(0.453 0.124 130.933)",
          dark: "oklch(0.453 0.124 130.933)",
        },
        sidebar: {
          light: "oklch(0.987 0.002 197.1)",
          dark: "oklch(0.218 0.008 223.9)",
        },
        "sidebar-foreground": {
          light: "oklch(0.148 0.004 228.8)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        "sidebar-primary": {
          light: "oklch(0.648 0.2 131.684)",
          dark: "oklch(0.768 0.233 130.85)",
        },
        "sidebar-primary-foreground": {
          light: "oklch(0.986 0.031 120.757)",
          dark: "oklch(0.274 0.072 132.109)",
        },
        "sidebar-accent": {
          light: "oklch(0.963 0.002 197.1)",
          dark: "oklch(0.275 0.011 216.9)",
        },
        "sidebar-accent-foreground": {
          light: "oklch(0.218 0.008 223.9)",
          dark: "oklch(0.987 0.002 197.1)",
        },
        "sidebar-border": {
          light: "oklch(0.925 0.005 214.3)",
          dark: "oklch(1 0 0 / 10%)",
        },
        "sidebar-ring": {
          light: "oklch(0.723 0.014 214.4)",
          dark: "oklch(0.56 0.021 213.5)",
        },
      },
    }),
    presetShadcn(),
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Inter",
        serif: "Instrument Serif",
        borel: "Borel",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
});
