<template>
  <div
    id="hero"
    class="h-[90svh] flex items-center flex-col justify-center text-lg hero overflow-hidden"
  >
    <h1 class="hero__name">Jose Chirivella</h1>
    <h3 class="hero__title mb-2">Software Engineer</h3>
    <div
      id="icons-container"
      class="mt-4 grid grid-rows-2 lg:grid-rows-1 grid-flow-col gap-4"
    >
      <template v-for="(icon, index) in icons" :key="index">
        <btn-icons :icon="icon.icon" :link="icon.link" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BtnIcons from './BtnIcons.vue';

const icons = [
  {
    link: 'https://twitter.com/chiri14',
    icon: 'fa-brands:twitter',
  },
  {
    link: 'https://linkedin.com/in/josechirivella',
    icon: 'fa-brands:linkedin',
  },
  {
    link: 'https://github.com/josechirivella',
    icon: 'fa-brands:github',
  },
  {
    link: 'https://medium.com/@josechirivella',
    icon: 'fa-brands:medium',
  },
  {
    link: 'mailto:joser.chirivella@gmail.com',
    icon: 'fa6-regular:paper-plane',
  },
  {
    link: 'https://storage.googleapis.com/portfolio-assets/resume/ResumeJose.pdf',
    icon: 'fa6-regular:file-pdf',
  },
];
</script>
