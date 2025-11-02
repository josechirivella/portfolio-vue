<template>
  <div>
    <Nav />
    <main class="container mx-auto p-4">
      <slot />
    </main>
    <SpeedInsights />
  </div>
</template>
<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

useHead({
  htmlAttrs: {
    class: "dark-mode-always",
  },
});
</script>
