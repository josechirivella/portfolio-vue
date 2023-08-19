<template>
  <button class="btn p-4 border-0 rounded-lg" :class="props.classList">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  classList: { type: String, default: '' },
});
</script>
