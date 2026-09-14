<template>
  <div
    v-if="showBanner"
    class="analytics-consent"
    role="dialog"
    aria-labelledby="analytics-consent-title"
    aria-describedby="analytics-consent-copy"
  >
    <div class="analytics-consent__inner">
      <div class="analytics-consent__copy">
        <p id="analytics-consent-title" class="analytics-consent__title">Analytics</p>
        <p id="analytics-consent-copy" class="analytics-consent__text">
          I use PostHog to understand how this site is used — page views and a few key clicks. No ads. You can decline
          and nothing is tracked.
        </p>
      </div>
      <div class="analytics-consent__actions">
        <button type="button" class="analytics-consent__btn analytics-consent__btn--ghost" @click="decline">
          Decline
        </button>
        <button type="button" class="analytics-consent__btn analytics-consent__btn--solid" @click="accept">
          Accept
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { showBanner, accept, decline, hydrate } = useAnalyticsConsent();

onMounted(() => {
  hydrate();
});
</script>

<style lang="scss" scoped>
.analytics-consent {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 60;
  padding: 1rem;
  pointer-events: none;
}

.analytics-consent__inner {
  pointer-events: auto;
  margin-inline: auto;
  max-width: 42rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid rgb(63 63 70); /* zinc-700 */
  background: rgb(24 24 27 / 0.96); /* zinc-900 */
  color: rgb(244 244 245); /* zinc-100 */
  box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
  backdrop-filter: blur(8px);

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.analytics-consent__title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.analytics-consent__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: rgb(212 212 216); /* zinc-300 */
}

.analytics-consent__actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
  align-items: center;
}

.analytics-consent__btn {
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.55rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    border-color 140ms ease;
}

.analytics-consent__btn--ghost {
  border: 1px solid rgb(82 82 91); /* zinc-600 */
  background: transparent;
  color: rgb(228 228 231); /* zinc-200 */

  &:hover {
    border-color: rgb(161 161 170);
    color: rgb(250 250 250);
  }
}

.analytics-consent__btn--solid {
  border: 1px solid rgb(244 244 245);
  background: rgb(244 244 245); /* zinc-100 */
  color: rgb(24 24 27); /* zinc-900 */

  &:hover {
    background: rgb(255 255 255);
    border-color: rgb(255 255 255);
  }
}
</style>
