import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Nav from '@/components/Nav.vue';

describe('Nav', () => {
  let wrapper;

  const createWrapper = async () => {
    return await mountSuspended(Nav, {
      global: {
        stubs: {
          Icon: true,
        },
      },
    });
  };

  beforeAll(async () => {
    wrapper = await createWrapper();
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
      expect(wrapper.vm.showMenu.value).toBe(false);

      // Toggle
      await wrapper.vm.toggleNavbar();
      expect(wrapper.vm.showMenu.value).toBe(true);

      // Toggle again
      await wrapper.vm.toggleNavbar();
      expect(wrapper.vm.showMenu.value).toBe(false);
    });
  });

  describe('inBlog function', () => {
    const createRouteWrapper = async (routeName) => {
      return await mountSuspended(Nav, {
        route: { name: routeName },
        global: {
          stubs: {
            Icon: true,
          },
        },
      });
    };

    test('should return false when route name is not blog', async () => {
      const testWrapper = await createRouteWrapper('index');
      expect(testWrapper.vm.inBlog()).toBe(false);
    });

    test('should return true when route name is blog', async () => {
      const testWrapper = await createRouteWrapper('blog');
      expect(testWrapper.vm.inBlog()).toBe(true);
    });
  });
});
