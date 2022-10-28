<template>
  <div
    id="hero"
    class="
      bg-black
      text-white
      min-h-screen
      flex
      items-center
      flex-col
      justify-center
      text-lg
    "
  >
    <h1>Jose Chirivella</h1>
    <h3>Software Engineer</h3>
    <div id="icons-container" class="mt-4 flex align-middle">
      <template v-for="(icon, index) in icons">
        <btn-icons :key="index" :link="icon.link" :icon="icon.icon"></btn-icons>
      </template>
    </div>
  </div>
</template>

<script>
import BtnIcons from '~/components/BtnIcons';

export default {
  components: {
    BtnIcons
  },
  data () {
    return {
      iconBrands: ['facebook', 'twitter', 'linkedin'],
      icons: [ {
        link: "https://twitter.com/chiri14",
        icon: ['fab', 'twitter']
      }, {
        link: "https://linkedin.com/in/josechirivella",
        icon: ['fab', 'linkedin']
      }, {
        link: "https://github.com/josechirivella",
        icon: ["fab", "github"]
      }]
    };
  }
};
</script>
