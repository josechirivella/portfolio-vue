<template>
  <a
    v-if="link && icon"
    :href="link"
    target="_blank"
  >
    <div class="icon-wrapper">
      <Icon
        :name="icon"
        color="white"
      />
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps({
  link: { type: String, required: true },
  icon: { type: String, required: true },
});
</script>

<style lang="scss" scoped>
.icon-wrapper {
  @apply flex items-center justify-center px-4 text-4xl;
}
</style>
