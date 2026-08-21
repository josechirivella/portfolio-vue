<template>
  <div class="flex flex-wrap items-center gap-3 not-prose">
    <button
      type="button"
      class="group inline-flex items-center justify-center rounded-full p-3 border-0 text-zinc-500 transition-colors hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-red-400 dark:focus-visible:outline-zinc-50"
      :disabled="!canLike"
      :aria-label="likeAriaLabel"
      @click="addLike"
    >
      <Icon
        name="fa6-regular:heart"
        class="text-2xl transition-transform motion-safe:group-active:scale-125"
        :class="{ 'text-red-500 dark:text-red-400': userLikes > 0 }"
      />
    </button>

    <div class="flex flex-col leading-tight">
      <span class="font-semibold text-zinc-900 dark:text-zinc-50" aria-live="polite">
        {{ ready ? totalLikes : '–' }} {{ totalLikes === 1 ? 'like' : 'likes' }}
      </span>
      <span class="text-sm text-zinc-500 dark:text-zinc-400">
        <template v-if="!ready">Loading likes…</template>
        <template v-else-if="unavailable">Likes are unavailable right now.</template>
        <template v-else-if="userLikes === 0">Be the first to like this post.</template>
        <template v-else-if="atLimit">You've liked this {{ userLikes }} times — that's the max!</template>
        <template v-else
          >You've liked this {{ userLikes }} time{{ userLikes === 1 ? '' : 's' }}. {{ remainingLikes }} left.</template
        >
      </span>
    </div>

    <button
      v-if="userLikes > 0"
      type="button"
      class="rounded border-0 bg-transparent text-xs text-zinc-400 underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-500 dark:hover:text-zinc-300 dark:focus-visible:outline-zinc-50"
      :disabled="!canUnlike"
      aria-label="Remove one like from this post"
      @click="removeLike"
    >
      Undo
    </button>

    <p v-if="error" role="alert" class="w-full text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  slug: { type: String, required: true },
});

const {
  totalLikes,
  userLikes,
  remainingLikes,
  canLike,
  canUnlike,
  atLimit,
  ready,
  unavailable,
  error,
  addLike,
  removeLike,
} = useBlogLikes(() => props.slug);

const likeAriaLabel = computed(() =>
  ready.value ? `Like this post, you've liked it ${userLikes.value} times` : 'Like this post',
);
</script>
