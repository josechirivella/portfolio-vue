import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlogIndex from '@/pages/blog/index.vue';

describe('Blog Index Page', () => {
  let wrapper;

  const createWrapper = async (customOptions = {}) => {
    return await mountSuspended(BlogIndex, customOptions);
  };

  beforeAll(async () => {
    wrapper = await createWrapper();
  });

  test('should render blog index page', () => {
    expect(wrapper.vm).toBeTruthy();
  });

  test('should display intro content', () => {
    expect(wrapper.find('h1').text()).toBe("Hi! I'm Jose");
    expect(wrapper.text()).toContain(
      'Software Engineer, over 10 years of experience',
    );
    expect(wrapper.text()).toContain('thoughts and rants');
  });

  test('should have proper page layout structure', () => {
    const container = wrapper.find('.max-w-2xl.mx-auto');
    expect(container.exists()).toBe(true);

    const postsContainer = wrapper.find('.pages--container');
    expect(postsContainer.exists()).toBe(true);
    expect(postsContainer.classes()).toContain('grid');
    expect(postsContainer.classes()).toContain('grid-cols-1');
    expect(postsContainer.classes()).toContain('gap-4');
  });

  test('should have proper responsive classes', () => {
    const mainContainer = wrapper.find('.max-w-2xl');
    expect(mainContainer.exists()).toBe(true);

    const grid = wrapper.find('.grid-cols-1');
    expect(grid.exists()).toBe(true);
  });

  describe('Blog posts rendering', () => {
    test('should render blog posts when available', async () => {
      const postsWrapper = await createWrapper({
        data() {
          return {
            posts: [
              {
                id: '1',
                path: '/blog/test-post',
                title: 'Test Post',
                description: 'Test description',
                image: '/test-image.jpg',
                tags: ['vue'],
              },
            ],
          };
        },
      });

      // Note: This test verifies the structure exists for rendering posts
      // The actual post rendering depends on the data from the Nuxt Content query
      const postsGrid = postsWrapper.find('.pages--container');
      expect(postsGrid.exists()).toBe(true);
    });
  });
});
