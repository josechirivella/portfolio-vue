<template>
  <ContentDoc v-slot="{ doc }">
    <article class="mx-auto prose dark:prose-invert lg:prose-xl">
      <h1>{{ doc.title }}</h1>
      <span>{{ doc?.date }}</span>
      <img :src="doc?.image" alt="Post cover" class="rounded-lg" />
      <ContentRenderer :value="doc" />
    </article>
    <ScrollTop />
  </ContentDoc>
</template>
