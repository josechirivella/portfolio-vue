<template>
  <div class="read-progress-container">
    <span
      :class="{ 'with-shadow': shadow }"
      :style="{
        width: readProgress + '%',
        color,
        height,
        opacity,
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
    default: 'var(--p-primary-color)',
  },
  height: {
    type: String,
    default: '4px',
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
const { readProgress } = useReadProgress();
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
