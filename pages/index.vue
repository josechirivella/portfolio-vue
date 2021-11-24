<template>
  <div>
    <Hero />
    <Contact />
    <btn-icons icon="times"></btn-icons>
  </div>
</template>

<script>

import Hero from "~/components/Hero";
import Contact from "~/components/Contact";
import BtnIcons from "~/components/BtnIcons";

export default {
  components: {
    Hero,
    Contact,
    BtnIcons
  }
};
</script>

