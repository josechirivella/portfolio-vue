<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="font-bold text-4xl">Hi! I'm Jose</h1>
    <p class="mb-4">
      I'm a Software Engineer with a focus in Front End. Here you will find my
      thoughts.
    </p>
    <div class="pages--container py-4 grid grid-cols-1 gap-4">
      <div v-for="(post, index) in posts" :key="index">
        <nuxt-link :to="post._path">
          <Card class="overflow-hidden">
            <template v-if="post.image" #header>
              <img
                :src="post.image"
                alt="Post cover"
                loading="lazy"
                class="w-full h-48 object-cover"
              />
            </template>
            <template #title>{{ post.title }}</template>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('/').find()
);
</script>
