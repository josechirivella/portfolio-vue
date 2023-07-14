<template>
  <a :href="props.link" target="_blank">
    <div class="icon">
      <font-awesome-icon :icon="props.icon"></font-awesome-icon>
    </div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  link: { type: String, required: true },
  icon: { type: Object, required: true },
});
</script>

<style lang="scss" scoped>
.icon {
  @apply text-white w-4 h-4 rounded-full flex items-center justify-center py-4 px-8 text-4xl;
}
</style>
