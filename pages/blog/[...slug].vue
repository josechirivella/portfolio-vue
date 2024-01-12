<template>
  <ContentDoc v-slot="{ doc }" class="">
    <article class="container mx-auto prose lg:prose-xl">
      <h1>{{ doc.title }}</h1>
      <img :src="doc.image" alt="Post cover">
      <ContentRenderer :value="doc" />
    </article>
  </ContentDoc>
</template>
<script setup lang="ts">
</script>
