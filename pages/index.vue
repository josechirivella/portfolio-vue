<template>
  <div>
    <Hero />
    <template v-for="(icon, index) in icons">
      <btn-icons :key="index" :icon="icon"></btn-icons>
    </template>
  </div>
</template>

<script>

import Hero from "~/components/Hero";
import BtnIcons from "~/components/BtnIcons";

export default {
  components: {
    Hero,
    BtnIcons
  },
  data() {
    return {
      iconBrands: ['facebook', 'twitter', 'linkedinIn'],
      icons: [['fab', 'facebook'], ['fab', 'twitter'], ['fab', 'linkedinIn']]
    };
  }
};
</script>

