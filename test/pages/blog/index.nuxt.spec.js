import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, test } from 'vitest';
import { ref } from 'vue';

import BlogIndex from '@/pages/blog/index.vue';

const mockPending = ref(false);
const mockError = ref(null);
const mockPosts = ref([]);

mockNuxtImport('useAsyncData', () => {
  return () => ({
    data: mockPosts,
    pending: mockPending,
    error: mockError,
  });
});

describe('Blog Index Page', () => {
  const createWrapper = async (customOptions = {}) => {
    return await mountSuspended(BlogIndex, customOptions);
  };

  beforeEach(() => {
    mockPending.value = false;
    mockError.value = null;
    mockPosts.value = [];
  });

  test('should render blog index page', async () => {
    const wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
  });

  test('should display intro content', async () => {
    const wrapper = await createWrapper();
    expect(wrapper.find('h1').text()).toBe("Hi! I'm Jose");
    expect(wrapper.text()).toContain('Software Engineer, over 10 years of experience');
    expect(wrapper.text()).toContain('thoughts and rants');
  });

  test('should have proper page layout structure', async () => {
    const wrapper = await createWrapper();
    const container = wrapper.find('.max-w-2xl.mx-auto');
    expect(container.exists()).toBe(true);

    const postsContainer = wrapper.find('.pages--container');
    expect(postsContainer.exists()).toBe(true);
    expect(postsContainer.classes()).toContain('grid');
    expect(postsContainer.classes()).toContain('grid-cols-1');
    expect(postsContainer.classes()).toContain('gap-4');
  });

  describe('Loading state', () => {
    test('should render skeleton cards when pending', async () => {
      mockPending.value = true;
      const wrapper = await createWrapper();
      const skeletons = wrapper.findAllComponents({ name: 'Skeleton' });
      expect(skeletons.length).toBeGreaterThan(0);
    });

    test('should not render post links while pending', async () => {
      mockPending.value = true;
      const wrapper = await createWrapper();
      const links = wrapper.findAll('a[href]');
      expect(links.length).toBe(0);
    });
  });

  describe('Error state', () => {
    test('should show error message when an error occurs', async () => {
      mockError.value = new Error('Network error');
      const wrapper = await createWrapper();
      const message = wrapper.findComponent({ name: 'Message' });
      expect(message.exists()).toBe(true);
    });

    test('should not show error message when there is no error', async () => {
      const wrapper = await createWrapper();
      const message = wrapper.findComponent({ name: 'Message' });
      expect(message.exists()).toBe(false);
    });
  });

  describe('Post rendering', () => {
    test('should render post cards when posts are available', async () => {
      mockPosts.value = [
        {
          id: '1',
          path: '/blog/test-post',
          title: 'Test Post',
          description: 'Test description',
          image: '/test-image.jpg',
          tags: ['vue'],
        },
      ];
      const wrapper = await createWrapper();
      expect(wrapper.text()).toContain('Test Post');
      expect(wrapper.text()).toContain('Test description');
    });

    test('should render tag chips for posts with tags', async () => {
      mockPosts.value = [
        {
          id: '1',
          path: '/blog/test-post',
          title: 'Test Post',
          description: 'Test description',
          tags: ['vue', 'nuxt'],
        },
      ];
      const wrapper = await createWrapper();
      expect(wrapper.text()).toContain('vue');
      expect(wrapper.text()).toContain('nuxt');
    });
  });
});
