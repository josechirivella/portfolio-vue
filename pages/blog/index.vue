<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="font-bold text-4xl">
      Hi! I'm Jose
    </h1>
    <p class="mb-4">
      I'm a Software Engineer, over 10 years of experience. Here you will find
      my thoughts and rants.
    </p>
    <div class="pages--container py-4 grid grid-cols-1 gap-4">
      <div
        v-for="post in posts"
        :key="post._id"
      >
        <nuxt-link :to="post._path">
          <Card class="overflow-hidden">
            <template
              v-if="post.image"
              #header
            >
              <img
                :src="post.image"
                alt="Post cover"
                class="w-full h-48 object-cover"
                loading="lazy"
              >
            </template>
            <template #title>
              {{ post.title }}
            </template>
            <template #content>
              {{ post.description }}
            </template>
            <template
              v-if="post.tags"
              #footer
            >
              <Chip
                v-for="(tag, idx) in post.tags"
                :key="idx"
                class="mr-2"
              >
                {{ tag }}
              </Chip>
            </template>
          </Card>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const pageNo = ref(1);
const config = useRuntimeConfig();
const whereQuery = config.public.production ? { published: { $ne: true } } : {};
const { data: posts } = useAsyncData('posts', () =>
  queryContent('/')
    .where(whereQuery)
    .limit(9)
    .only(['title', 'description', 'image', 'tags', '_id', '_path'])
    .skip(9 * (pageNo.value - 1))
    .sort({ date: 1 })
    .find(),
);
</script>
