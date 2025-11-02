<template>
  <button
    :class="classList"
    class="btn p-4 border-0 rounded-lg"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
defineProps({
  classList: { type: String, default: "" },
});
</script>
