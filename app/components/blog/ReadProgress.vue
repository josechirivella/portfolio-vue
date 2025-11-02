<template>
  <div class="read-progress-container">
    <span
      :class="{ 'with-shadow': 'shadow' }"
      :style="{
        width: readProgress + '%',
        color: color,
        height: height,
        opacity: opacity,
        backgroundColor: color,
      }"
      class="read-progress-bar"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  color: {
    type: String,
    default: "var(--p-primary-color)",
  },
  height: {
    type: String,
    default: "4px",
  },
  opacity: {
    type: [String, Number],
    default: 1,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
});
const readProgress = ref(0);

onMounted(() => {
  window.addEventListener("scroll", updateReadProgress);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateReadProgress);
});

function updateReadProgress(): void {
  readProgress.value = currentScrollPosition(window.scrollY);
}

function currentScrollPosition(position: number): number {
  return (
    (position /
      (document.body.clientHeight - document.documentElement.clientHeight)) *
    100
  );
}
</script>

<style lang="scss" scoped>
.read-progress-container {
  width: 100%;
  background-color: transparent;
  position: fixed;
  display: block;
  z-index: 9999;
  top: 0;
  left: 0;

  .read-progress-bar {
    display: block;
    width: 0;
    height: inherit;

    &.with-shadow {
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
