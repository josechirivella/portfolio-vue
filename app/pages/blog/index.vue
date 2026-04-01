<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="font-bold text-4xl">Hi! I'm Jose</h1>
    <p class="mb-4">I'm a Software Engineer, over 10 years of experience. Here you will find my thoughts and rants.</p>

    <div v-if="error" class="py-4">
      <Message severity="error">Failed to load posts. Please try again later.</Message>
    </div>

    <div class="pages--container py-4 grid grid-cols-1 gap-4">
      <template v-if="pending">
        <Card v-for="n in 3" :key="n" class="overflow-hidden">
          <template #header>
            <Skeleton height="12rem" />
          </template>
          <template #title>
            <Skeleton width="60%" height="1.5rem" />
          </template>
          <template #content>
            <Skeleton width="100%" height="1rem" class="mb-2" />
            <Skeleton width="80%" height="1rem" />
          </template>
          <template #footer>
            <Skeleton width="30%" height="1.5rem" />
          </template>
        </Card>
      </template>

      <template v-else>
        <div v-for="post in posts" :key="post.id">
          <nuxt-link :to="post.path">
            <Card class="overflow-hidden">
              <template v-if="post.image" #header>
                <img :src="post.image" alt="Post cover" class="w-full h-48 object-cover" loading="lazy" />
              </template>
              <template #title>
                {{ post.title }}
              </template>
              <template #content>
                {{ post.description }}
              </template>
              <template v-if="post.tags" #footer>
                <Chip v-for="(tag, idx) in post.tags" :key="idx" class="mr-2">
                  {{ tag }}
                </Chip>
              </template>
            </Card>
          </nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const pageNo = ref(1);
const {
  data: posts,
  pending,
  error,
} = useAsyncData('posts', () => {
  const query = queryCollection('content');

  return query
    .limit(9)
    .skip(9 * (pageNo.value - 1))
    .order('date', 'ASC')
    .all();
});

useHead(
  computed(() => ({
    link:
      posts.value?.filter((post) => post.image).map((post) => ({ rel: 'preload', as: 'image', href: post.image })) ??
      [],
  })),
);
</script>
