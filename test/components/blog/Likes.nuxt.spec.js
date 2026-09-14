import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { createError, readBody } from 'h3';
import { describe, expect, test } from 'vitest';

import Likes from '@/components/blog/Likes.vue';

const baseState = { totalLikes: 12, userLikes: 3, remainingLikes: 7, maxLikes: 10 };

// Mimics the real API: apply the action to whatever state was registered for this test,
// enforcing the same cap/floor the backend contract promises (409 at the edges).
function mockLikesApi(slug, initial = baseState) {
  const state = { ...initial, postCount: 0 };

  registerEndpoint(`/api/likes/${slug}`, {
    method: 'GET',
    handler: () => ({ ...state }),
  });

  registerEndpoint(`/api/likes/${slug}`, {
    method: 'POST',
    handler: async (event) => {
      const { action } = await readBody(event);
      state.postCount += 1;
      if (action === 'add') {
        if (state.userLikes >= state.maxLikes) {
          throw createError({ statusCode: 409, statusMessage: 'At like limit' });
        }
        state.userLikes += 1;
        state.totalLikes += 1;
      } else if (action === 'remove') {
        if (state.userLikes <= 0) {
          throw createError({ statusCode: 409, statusMessage: 'Nothing to remove' });
        }
        state.userLikes -= 1;
        state.totalLikes -= 1;
      } else {
        throw createError({ statusCode: 400, statusMessage: 'Bad action' });
      }
      state.remainingLikes = state.maxLikes - state.userLikes;
      return { ...state };
    },
  });

  return state;
}

// The composable fires queued POSTs one at a time, so a single flushPromises() only
// settles the first. Drain until the request count stops moving.
async function drainQueue(state, maxTicks = 40) {
  let previous = -1;
  for (let tick = 0; tick < maxTicks && state.postCount !== previous; tick += 1) {
    previous = state.postCount;
    await flushPromises();
  }
}

describe('BlogLikes', () => {
  test('renders with fetched counts', async () => {
    mockLikesApi('test-post');
    const wrapper = await mountSuspended(Likes, { props: { slug: 'test-post' } });
    await flushPromises();

    expect(wrapper.text()).toContain('12');
    expect(wrapper.text()).toContain('likes');
    expect(wrapper.text()).toContain('3 · 7 left');
  });

  test('add increments optimistically before the request settles', async () => {
    mockLikesApi('optimistic-post');
    const wrapper = await mountSuspended(Likes, { props: { slug: 'optimistic-post' } });
    await flushPromises();

    const likeButton = wrapper.find('button[aria-label*="Like this post"]');
    await likeButton.trigger('click');

    // Assert on the very next tick, before the mocked network call resolves: the bump
    // to 13/4 must already be on screen, not waiting on the server round trip.
    expect(wrapper.text()).toContain('13');
    expect(wrapper.text()).toContain('4 · 6 left');

    await flushPromises();
    expect(wrapper.text()).toContain('13');
    expect(wrapper.text()).toContain('4 · 6 left');
  });

  test('the 10-like cap is respected and the add button disables at the max', async () => {
    mockLikesApi('capped-post', { totalLikes: 20, userLikes: 10, remainingLikes: 0, maxLikes: 10 });
    const wrapper = await mountSuspended(Likes, { props: { slug: 'capped-post' } });
    await flushPromises();

    expect(wrapper.text()).toContain('Max 10');
    const likeButton = wrapper.find('button[aria-label*="Like this post"]');
    expect(likeButton.attributes('disabled')).toBeDefined();

    await likeButton.trigger('click');
    await flushPromises();

    // Clicking a disabled control is a no-op; the count must not creep past the cap.
    expect(wrapper.text()).toContain('20');
    expect(wrapper.text()).toContain('Max 10');
  });

  test('a failed request rolls back to the pre-click state', async () => {
    const slug = 'failing-post';
    registerEndpoint(`/api/likes/${slug}`, {
      method: 'GET',
      handler: () => ({ totalLikes: 5, userLikes: 2, remainingLikes: 8, maxLikes: 10 }),
    });
    registerEndpoint(`/api/likes/${slug}`, {
      method: 'POST',
      handler: () => {
        throw createError({ statusCode: 503, statusMessage: 'Database unavailable' });
      },
    });

    const wrapper = await mountSuspended(Likes, { props: { slug } });
    await flushPromises();
    expect(wrapper.text()).toContain('5');

    const likeButton = wrapper.find('button[aria-label*="Like this post"]');
    await likeButton.trigger('click');
    expect(wrapper.text()).toContain('6');

    await flushPromises();

    expect(wrapper.text()).toContain('5');
    expect(wrapper.text()).toContain('2 · 8 left');
    expect(wrapper.text()).toContain('temporarily unavailable');
  });

  test('a rapid burst of clicks never issues more adds than the cap allows', async () => {
    const state = mockLikesApi('mashed-post', { totalLikes: 0, userLikes: 0, remainingLikes: 10, maxLikes: 10 });
    const wrapper = await mountSuspended(Likes, { props: { slug: 'mashed-post' } });
    await flushPromises();

    const likeButton = wrapper.find('button[aria-label*="Like this post"]');

    // Mash it 25 times without awaiting the network in between -- this is the case a
    // per-click "is the server-confirmed count under 10?" check would get wrong, because
    // no request has settled yet when click 11 fires.
    for (let i = 0; i < 25; i += 1) {
      await likeButton.trigger('click');
    }
    await drainQueue(state);

    expect(state.postCount).toBeLessThanOrEqual(10);
    expect(state.userLikes).toBe(10);
    expect(wrapper.text()).toContain('10');
    expect(wrapper.text()).toContain('Max 10');
    expect(likeButton.attributes('disabled')).toBeDefined();
  });

  test('add() is refused at the cap even when invoked directly, not just visually disabled', async () => {
    const state = mockLikesApi('guarded-post', { totalLikes: 20, userLikes: 10, remainingLikes: 0, maxLikes: 10 });
    const wrapper = await mountSuspended(Likes, { props: { slug: 'guarded-post' } });
    await flushPromises();

    // defineExpose({ addLike }) keeps this stable across Vue Test Utils versions.
    wrapper.vm.addLike();
    await drainQueue(state);

    expect(state.postCount).toBe(0);
    expect(wrapper.text()).toContain('Max 10');
  });

  test('undoing at the cap frees exactly one like back up', async () => {
    mockLikesApi('undo-post', { totalLikes: 20, userLikes: 10, remainingLikes: 0, maxLikes: 10 });
    const wrapper = await mountSuspended(Likes, { props: { slug: 'undo-post' } });
    await flushPromises();

    await wrapper.find('button[aria-label*="Remove one like"]').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('9 · 1 left');
    expect(wrapper.find('button[aria-label*="Like this post"]').attributes('disabled')).toBeUndefined();
  });

  test('shows a first-like prompt only when the post has zero likes', async () => {
    mockLikesApi('fresh-post', { totalLikes: 0, userLikes: 0, remainingLikes: 10, maxLikes: 10 });
    const fresh = await mountSuspended(Likes, { props: { slug: 'fresh-post' } });
    await flushPromises();
    expect(fresh.text()).toContain('Be the first');

    mockLikesApi('popular-post', { totalLikes: 4, userLikes: 0, remainingLikes: 10, maxLikes: 10 });
    const popular = await mountSuspended(Likes, { props: { slug: 'popular-post' } });
    await flushPromises();
    expect(popular.text()).toContain('Tap to like');
    expect(popular.text()).not.toContain('Be the first');
  });
});
