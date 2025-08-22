import { beforeAll, describe, expect, test, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import ReadProgress from '~/app/components/blog/ReadProgress.vue';

// Mock window methods and properties
Object.defineProperty(window, 'addEventListener', { value: vi.fn() });
Object.defineProperty(window, 'removeEventListener', { value: vi.fn() });

// Mock document properties for calculating scroll progress
Object.defineProperty(document.body, 'clientHeight', {
  value: 1000,
  configurable: true,
});
Object.defineProperty(document.documentElement, 'clientHeight', {
  value: 500,
  configurable: true,
});

describe('ReadProgress', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallowMount(ReadProgress, {});
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  describe('Props', () => {
    test('should have default props', () => {
      expect(wrapper.props('color')).toBe('var(--p-primary-color)');
      expect(wrapper.props('height')).toBe('4px');
      expect(wrapper.props('opacity')).toBe(1);
      expect(wrapper.props('shadow')).toBe(true);
    });

    test('should apply custom props', async () => {
      await wrapper.setProps({
        color: 'red',
        height: '8px',
        opacity: 0.5,
        shadow: false,
      });

      expect(wrapper.props('color')).toBe('red');
      expect(wrapper.props('height')).toBe('8px');
      expect(wrapper.props('opacity')).toBe(0.5);
      expect(wrapper.props('shadow')).toBe(false);
    });
  });

  describe('Read progress calculation', () => {
    test('currentScrollPosition should calculate correct percentage', () => {
      // Mock document dimensions for test
      // When scrollY is 0, progress should be 0%
      expect(wrapper.vm.currentScrollPosition(0)).toBe(0);

      // When scrollY is halfway, progress should be 50%
      expect(wrapper.vm.currentScrollPosition(250)).toBe(50);

      // When scrollY is at max, progress should be 100%
      expect(wrapper.vm.currentScrollPosition(500)).toBe(100);
    });

    test('updateReadProgress should update readProgress value', async () => {
      // Initial value
      expect(wrapper.vm.readProgress).toBe(0);

      // Mock scrollY by spying on the property
      const scrollYSpy = vi
        .spyOn(window, 'scrollY', 'get')
        .mockReturnValue(250);
      await wrapper.vm.updateReadProgress();

      // Check that readProgress was updated
      expect(wrapper.vm.readProgress).toBe(50);

      scrollYSpy.mockRestore();
    });
  });

  describe('Lifecycle hooks', () => {
    test('should add event listener on mount', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.vm.updateReadProgress,
      );
    });

    test('should remove event listener before unmount', () => {
      wrapper.unmount();
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        wrapper.vm.updateReadProgress,
      );
    });
  });
});
