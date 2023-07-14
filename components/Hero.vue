<template>
  <div
    id="hero"
    class="bg-black text-white min-h-screen flex items-center flex-col justify-center text-lg hero"
  >
    <h1 class="hero__name">Jose Chirivella</h1>
    <h3 class="hero__title mb-2">Software Engineer</h3>
    <div id="icons-container" class="mt-4 flex align-middle">
      <template v-for="(icon, index) in icons" :key="index">
        <btn-icons :link="icon.link" :icon="icon.icon"></btn-icons>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faFilePdf, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import BtnIcons from '~/components/BtnIcons';

const icons = ref([
  {
    link: 'https://twitter.com/chiri14',
    icon: faTwitter,
  },
  {
    link: 'https://linkedin.com/in/josechirivella',
    icon: faLinkedin,
  },
  {
    link: 'https://github.com/josechirivella',
    icon: faGithub,
  },
  {
    link: 'mailto:joser.chirivella@gmail.com',
    icon: faPaperPlane,
  },
  {
    link: 'https://storage.googleapis.com/portfolio-assets/resume/ResumeJose.pdf',
    icon: faFilePdf,
  },
]);
</script>
