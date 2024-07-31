<template>
  <div>
    <h1 class="font-bold text-4xl">Hi! I'm Jose</h1>
    <p>I'm a Software Engineer with a focus in Front End. Here you will find my thoughts.</p>
    <div class="pages--container py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="(post, index) in posts" :key="index" class="max-w-sm rounded-lg border-gray-800 border p-4 overflow-hidden shadow-lg">
        <nuxt-link :to="post._path">
          <img v-if="post.image" :src="post.image" alt="Post cover" loading="lazy" class="w-full">
          <div class="px-6 py-4">
            <div class="font-bold text-xl text-white mb-2">{{post.title}}</div>
            <p class="text-gray-100 text-base">{{post.description}}</p>
          </div>
          <BlogTags :tags="post.tags"></BlogTags>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {data: posts} = await useAsyncData('posts', () => queryContent('/').find())
</script>
