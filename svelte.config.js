import { relative, sep } from "node:path";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "@unocss/svelte-scoped/preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: ({ filename }) => {
      const relativePath = relative(import.meta.dirname, filename);
      const pathSegments = relativePath.toLowerCase().split(sep);
      const isExternalLibrary = pathSegments.includes("node_modules");

      return isExternalLibrary ? undefined : true;
    },
  },
  kit: {
    adapter: adapter({
      routes: {
        include: ["/*"],
        exclude: [
          "<all>",
          "/sitemap.xml",
          "<build>",
          "<prerendered>",
          "/sw.js",
          "/manifest.webmanifest",
          "/workbox-*.js",
        ],
      },
    }),
  },
  preprocess: [
    vitePreprocess(),
    UnoCSS({
      configOrPath: "./uno.config.ts",
      exclude: ["node_modules/*"],
    }),
  ],
};

export default config;
