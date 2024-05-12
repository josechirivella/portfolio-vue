<template>
  <Hero />
</template>

<script setup lang="ts">
import Hero from '~/components/Hero.vue';

useHead({
  title: 'Jose Chirivella | Software Engineer',
  meta: [
    { name: 'description', content: 'The portfolio website for Jose Chirivella' }
  ],
})
</script>
