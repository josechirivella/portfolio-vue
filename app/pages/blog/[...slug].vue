<template>
  <div v-if="post">
    <BlogReadProgress />
    <article
      class="mx-auto prose dark:prose-invert prose-code:before:content-none prose-code:after:content-none lg:prose-xl"
    >
      <h1>{{ post.title }}</h1>
      <span>{{ post?.date }}</span>
      <NuxtImg :src="post?.image" alt="Post cover" class="rounded-lg mx-auto" />
      <!-- Table of contents -->
      <LazyBlogToc
        v-if="post.body.toc?.links?.length > 0"
        :toc="post.body.toc"
      />
      <ContentRenderer v-if="post" :value="post" />
    </article>
    <ScrollTop />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const url = useRequestURL();
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection("content").path(route.path).first(),
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: `${post.value.title} - Jose Chirivella`,
  ogTitle: `${post.value.title} - Jose Chirivella`,
  description: post.value.description ?? "",
  ogDescription: post.value.description ?? "",
  ogImage: post.value.image,
  ogImageAlt: post.value.imageAlt ?? "",
  ogUrl: url.href,
  ogType: "article",
  twitterCard: "summary_large_image",
  twitterTitle: `${post.value.title} - Jose Chirivella`,
  twitterDescription: post.value.description ?? "",
  twitterImage: post.value.image,
  twitterImageAlt: post.value.imageAlt ?? "",
});
</script>
