<template>
  <div v-if="post">
    <BlogReadProgress />
    <article
      class="mx-auto prose dark:prose-invert prose-code:before:content-none prose-code:after:content-none lg:prose-xl"
    >
      <h1>{{ post.title }}</h1>
      <span>{{ useFormatDateToLocale(post.date) }}</span>
      <NuxtImg :src="post?.image" alt="Post cover" class="rounded-lg mx-auto" />
      <!-- Table of contents -->
      <LazyBlogToc v-if="post.body.toc?.links?.length > 0" :toc="post.body.toc" />
      <ContentRenderer v-if="post" :value="post" />
    </article>
    <BlogLikes :slug="likeSlug" />
    <ScrollTop />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const url = useRequestURL();
const { data: post } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first());

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: false,
  });
}

// API slugs are bare, e.g. "my-post" — strip the "/blog/" prefix (and any stray leading/
// trailing slashes from the catch-all route) that the content path carries.
const likeSlug = computed(() => (post.value?.path ?? route.path).replace(/^\/?blog\/?/, '').replace(/^\/+|\/+$/g, ''));

useSeoMeta({
  title: `${post.value.title} - Jose Chirivella`,
  ogTitle: `${post.value.title} - Jose Chirivella`,
  description: post.value.description ?? '',
  ogDescription: post.value.description ?? '',
  ogImage: post.value.image,
  ogImageAlt: post.value.imageAlt ?? '',
  ogUrl: url.href,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: `${post.value.title} - Jose Chirivella`,
  twitterDescription: post.value.description ?? '',
  twitterImage: post.value.image,
  twitterImageAlt: post.value.imageAlt ?? '',
});
</script>
