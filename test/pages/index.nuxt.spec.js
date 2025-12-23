import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Index from '@/pages/index.vue';

describe('Index', () => {
  let wrapper;
  beforeAll(async () => {
    wrapper = await mountSuspended(Index, {
      global: {
        stubs: {
          Hero: true,
          Contact: true,
        },
      },
    });
  });
  test('should render', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
