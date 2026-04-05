import { relative, sep } from "node:path";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "@unocss/svelte-scoped/preprocess";

const prod = process.env.NODE_ENV !== "development";

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
    adapter: adapter(),
  },
  preprocess: [
    vitePreprocess(),
    UnoCSS({
      combine: prod,
      configOrPath: "./uno.config.ts",
      exclude: ["node_modules/*"],
    }),
  ],
};

export default config;
