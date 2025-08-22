<template>
  <div>
    <Nav />
    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>
<script lang="ts" setup>
useHead({
  htmlAttrs: {
    class: 'dark-mode-always'
  }
})
</script>
