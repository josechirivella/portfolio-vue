<template>
  <ContentDoc v-slot="{ doc }">
    <BlogReadProgress />
    <article class="mx-auto prose dark:prose-invert lg:prose-xl">
      <h1>{{ doc.title }}</h1>
      <span>{{ doc?.date }}</span>
      <img
        :src="doc?.image"
        alt="Post cover"
        class="rounded-lg"
      >
      <ContentRenderer :value="doc" />
    </article>
    <ScrollTop />
  </ContentDoc>
</template>

<script lang="ts" setup>
const route = useRoute();
const url = useRequestURL();
const { data: post } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}

useSeoMeta({
  title: `${post.value.title} - Jose Chirivella`,
  ogTitle: `${post.value.title} - Jose Chirivella`,
  description: post.value.description,
  ogDescription: post.value.description,
  ogImage: post.value.image,
  ogUrl: url.href,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: `${post.value.title} - Jose Chirivella`,
  twitterCreator: 'chiri14',
});
</script>
