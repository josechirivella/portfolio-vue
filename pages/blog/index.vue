<template>
  <div class="container mx-auto">
    <h1>Blog</h1>
    <div class="pages--container">
      <template v-for="(post, index) in posts" :key="index">
        <nuxt-link :to="post._path">{{ post.title }}</nuxt-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {data: posts} = await useAsyncData('posts', () => queryContent('/').find())
</script>