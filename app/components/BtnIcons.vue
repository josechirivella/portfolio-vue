<template>
  <a v-if="link && icon" :href="link" target="_blank" rel="noopener noreferrer" @click="onClick">
    <div class="icon-wrapper">
      <Icon :name="icon" color="white" />
    </div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  link: { type: String, required: true },
  icon: { type: String, required: true },
  trackContext: { type: String, default: 'hero_social' },
});

const { trackExternalLink } = useAnalytics();

function onClick() {
  trackExternalLink(props.link, props.trackContext);
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  @apply flex items-center justify-center px-4 text-4xl;
}
</style>
