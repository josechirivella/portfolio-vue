<template>
  <div class="icon">
    <fa-icon :icon="icon"></fa-icon>
  </div>
</template>

<script>
export default {
  name: "BtnIcons",
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  @apply border-black border w-4 h-4 rounded-full flex items-center justify-center p-4;
}
</style>
