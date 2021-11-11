<template>
  <div id='content' class='container mx-auto'>
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from '~/components/Footer';

export default {
  components: {
    Footer
  }
}
</script>
