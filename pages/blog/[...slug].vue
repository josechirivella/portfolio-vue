<template>
  <ContentDoc v-slot="{ doc }">
    <article class="mx-auto prose dark:prose-invert lg:prose-xl">
      <h1>{{ doc.title }}</h1>
      <img :src="doc.image" alt="Post cover">
      <ContentRenderer :value="doc" />
    </article>
  </ContentDoc>
</template>
<script setup lang="ts">
</script>
