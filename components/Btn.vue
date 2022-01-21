<template>
  <button class="btn p-4 border-0 rounded-lg" :class="classList">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Btn',
  props: {
    classList: {
      type: String,
      default: ''
    }
  }
};
</script>
