<template>
  <div>
    <Nav />
    <main class="container mx-auto p-4">
      <slot />
    </main>
    <AnalyticsConsentBanner />
  </div>
</template>
<script lang="ts" setup>
useHead({
  htmlAttrs: {
    class: 'dark-mode-always',
  },
});
</script>
