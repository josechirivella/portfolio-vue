<template>
  <aside class="blog-likes not-prose" aria-label="Post likes">
    <div class="blog-likes__panel">
      <button
        type="button"
        class="blog-likes__heart group"
        :disabled="!canLike"
        :aria-label="likeAriaLabel"
        @click="addLike"
      >
        <Icon
          name="fa6-regular:heart"
          class="blog-likes__icon motion-safe:transition-transform motion-safe:group-active:scale-125"
          :class="{ 'blog-likes__icon--liked': userLikes > 0 }"
        />
      </button>

      <div class="blog-likes__copy">
        <span class="blog-likes__count" aria-live="polite">
          {{ ready ? totalLikes : '–' }}
          <span class="blog-likes__count-label">{{ totalLikes === 1 ? 'like' : 'likes' }}</span>
        </span>
        <span class="blog-likes__status">
          <template v-if="!ready">Loading…</template>
          <template v-else-if="unavailable">Unavailable</template>
          <template v-else-if="totalLikes === 0">Be the first</template>
          <template v-else-if="userLikes === 0">Tap to like</template>
          <template v-else-if="atLimit">Max {{ userLikes }}</template>
          <template v-else>{{ userLikes }} · {{ remainingLikes }} left</template>
        </span>
      </div>

      <button
        v-if="userLikes > 0"
        type="button"
        class="blog-likes__undo"
        :disabled="!canUnlike"
        aria-label="Remove one like from this post"
        @click="removeLike"
      >
        Undo
      </button>
    </div>

    <p v-if="error" role="alert" class="blog-likes__error">{{ error }}</p>
  </aside>
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

// Exposed for unit tests that need to bypass the disabled attribute.
defineExpose({ addLike });
</script>

<style lang="scss" scoped>
.blog-likes {
  // Mobile: floating control near the reading surface — not buried after the article.
  position: fixed;
  z-index: 40;
  right: 1rem;
  bottom: 1.25rem;
  max-width: calc(100vw - 2rem);

  @media (min-width: 1024px) {
    // Desktop: sticky rail beside the article; stays in view while scrolling.
    position: sticky;
    top: 42vh;
    right: auto;
    bottom: auto;
    float: left;
    width: 0;
    margin: 0;
    max-width: none;
  }
}

.blog-likes__panel {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem 0.55rem 0.55rem;
  border: 1px solid rgb(24 24 27 / 0.12);
  background: rgb(255 255 255 / 0.92);
  color: rgb(63 63 70);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgb(24 24 27 / 0.08);

  @media (min-width: 1024px) {
    // Sit in the left margin of the prose column without shifting layout flow.
    transform: translateX(calc(-100% - 1.25rem));
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    width: 4.75rem;
    padding: 0.85rem 0.55rem;
    border-color: rgb(24 24 27 / 0.1);
  }
}

:global(.dark) .blog-likes__panel {
  border-color: rgb(250 250 250 / 0.12);
  background: rgb(24 24 27 / 0.88);
  color: rgb(161 161 170);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
}

.blog-likes__heart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0.45rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:focus-visible {
    outline: 2px solid rgb(24 24 27);
    outline-offset: 2px;
  }
}

:global(.dark) .blog-likes__heart:focus-visible {
  outline-color: rgb(250 250 250);
}

.blog-likes__icon {
  font-size: 1.35rem;

  &--liked {
    color: rgb(239 68 68);
  }
}

:global(.dark) .blog-likes__icon--liked {
  color: rgb(248 113 113);
}

.blog-likes__copy {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;

  @media (min-width: 1024px) {
    align-items: center;
    text-align: center;
  }
}

.blog-likes__count {
  font-weight: 600;
  color: rgb(24 24 27);
  font-variant-numeric: tabular-nums;
}

:global(.dark) .blog-likes__count {
  color: rgb(250 250 250);
}

.blog-likes__count-label {
  font-weight: 500;
  font-size: 0.8em;

  @media (min-width: 1024px) {
    display: block;
    margin-top: 0.1rem;
  }
}

.blog-likes__status {
  margin-top: 0.15rem;
  font-size: 0.75rem;
  color: rgb(113 113 122);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 9.5rem;

  @media (min-width: 1024px) {
    white-space: normal;
    max-width: 4.2rem;
  }
}

:global(.dark) .blog-likes__status {
  color: rgb(161 161 170);
}

.blog-likes__undo {
  margin: 0;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgb(161 161 170);
  font-size: 0.7rem;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  cursor: pointer;

  @media (min-width: 1024px) {
    margin-left: 0;
    margin-top: 0.15rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:hover:not(:disabled) {
    color: rgb(82 82 91);
  }

  &:focus-visible {
    outline: 2px solid rgb(24 24 27);
    outline-offset: 2px;
  }
}

:global(.dark) .blog-likes__undo {
  color: rgb(113 113 122);

  &:hover:not(:disabled) {
    color: rgb(212 212 216);
  }

  &:focus-visible {
    outline-color: rgb(250 250 250);
  }
}

.blog-likes__error {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 0.4rem);
  margin: 0;
  padding: 0.35rem 0.5rem;
  border: 1px solid rgb(239 68 68 / 0.35);
  background: rgb(254 242 242 / 0.95);
  color: rgb(185 28 28);
  font-size: 0.75rem;

  @media (min-width: 1024px) {
    left: auto;
    right: 0;
    width: 11rem;
    transform: translateX(calc(-100% - 1.25rem));
  }
}

:global(.dark) .blog-likes__error {
  background: rgb(69 10 10 / 0.92);
  color: rgb(252 165 165);
  border-color: rgb(248 113 113 / 0.35);
}
</style>
