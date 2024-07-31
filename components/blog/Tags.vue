<template>
  <div class="px-6 pt-4 pb-2">
    <template v-for="(tag, index) in props.tags" :key="index">
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{tag}}</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  tags: { type: Array<string>, required: true }
});

</script>
