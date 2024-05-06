<template>
  <ContentDoc v-slot="{ doc }">
    <article class="mx-auto prose lg:prose-xl">
      <h1 class="text-white">{{ doc.title }}</h1>
      <img :src="doc.image" alt="Post cover">
      <ContentRenderer :value="doc" />
    </article>
  </ContentDoc>
</template>
<script setup lang="ts">
</script>
