import { beforeAll, describe, expect, test, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Nav from '~/components/Nav.vue';

// Mock the useRoute composable
const mockRoute = {
  name: 'index',
};

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockRoute),
}));

describe('Nav', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallowMount(Nav, {
      global: {
        stubs: {
          NuxtLink: true,
          Icon: true,
        },
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  describe('Navigation items', () => {
    test('should have the correct number of navigation items', () => {
      expect(wrapper.vm.navItems.length).toBe(4);
    });

    test('should have the correct navigation item names', () => {
      const navItemNames = wrapper.vm.navItems.map((item) => item.name);
      expect(navItemNames).toContain('Home');
      expect(navItemNames).toContain('About');
      expect(navItemNames).toContain('Blog');
      expect(navItemNames).toContain('Resume');
    });
  });

  describe('Toggle navbar', () => {
    test('toggleNavbar should toggle showMenu value', async () => {
      // Initial state
      expect(wrapper.vm.showMenu).toBe(false);

      // Toggle
      await wrapper.vm.toggleNavbar();
      expect(wrapper.vm.showMenu).toBe(true);

      // Toggle again
      await wrapper.vm.toggleNavbar();
      expect(wrapper.vm.showMenu).toBe(false);
    });
  });

  describe('inBlog function', () => {
    test('should return false when route name is not blog-slug', () => {
      mockRoute.name = 'index';
      expect(wrapper.vm.inBlog()).toBe(false);
    });

    test('should return true when route name is blog-slug', () => {
      mockRoute.name = 'blog-slug';
      expect(wrapper.vm.inBlog()).toBe(true);
    });
  });
});
