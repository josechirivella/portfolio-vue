<template>
  <h2 class="text-lg font-semibold">
    Table of contents
  </h2>
  <ul class="list-none">
    <li
      v-for="link of toc.links"
      :key="link.id"
    >
      <a :href="`#${link.id}`">{{ link.text }}</a>
      <ul
        v-if="link.children"
        class="list-none"
      >
        <li
          v-for="child of link.children"
          :key="child.id"
        >
          <a :href="`#${child.id}`">{{ child.text }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps({
  toc: Object,
});
</script>
