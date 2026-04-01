import { mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import ReadProgress from '@/components/blog/ReadProgress.vue';

Object.defineProperty(window, 'addEventListener', { value: vi.fn() });
Object.defineProperty(window, 'removeEventListener', { value: vi.fn() });
Object.defineProperty(document.body, 'clientHeight', { value: 1000, configurable: true });
Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true });

describe('ReadProgress', () => {
  let wrapper;

  beforeAll(async () => {
    wrapper = await mountSuspended(ReadProgress, {});
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

    test('should apply with-shadow class when shadow prop is true', async () => {
      await wrapper.setProps({ shadow: true });
      expect(wrapper.find('.read-progress-bar').classes()).toContain('with-shadow');
    });

    test('should not apply with-shadow class when shadow prop is false', async () => {
      await wrapper.setProps({ shadow: false });
      expect(wrapper.find('.read-progress-bar').classes()).not.toContain('with-shadow');
    });
  });

  describe('Lifecycle hooks', () => {
    test('should register scroll listener on mount', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    });

    test('should remove scroll listener before unmount', () => {
      wrapper.unmount();
      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
