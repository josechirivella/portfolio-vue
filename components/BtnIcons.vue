<template>
  <a :href="link" target="_blank">
    <div class="icon">
      <fa-icon :icon="icon"></fa-icon>
    </div>
  </a>
</template>

<script>
export default {
  name: "BtnIcons",
  props: {
    link: {
      type: String,
      required: true
    },
    icon: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  @apply text-white w-4 h-4 rounded-full flex items-center justify-center py-4 px-8 text-4xl;
}
</style>
