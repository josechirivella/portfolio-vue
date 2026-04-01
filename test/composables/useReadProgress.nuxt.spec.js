import { defineComponent, h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useReadProgress } from '@/composables/useReadProgress';

Object.defineProperty(document.body, 'clientHeight', { value: 1000, configurable: true });
Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true });

const TestComponent = defineComponent({
  setup() {
    return useReadProgress();
  },
  render: () => h('div'),
});

describe('useReadProgress', () => {
  let addEventSpy;
  let removeEventSpy;
  let rafCallback;

  beforeEach(() => {
    rafCallback = null;
    addEventSpy = vi.spyOn(window, 'addEventListener');
    removeEventSpy = vi.spyOn(window, 'removeEventListener');
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should initialize readProgress to 0', async () => {
    const wrapper = await mountSuspended(TestComponent);
    expect(wrapper.vm.readProgress).toBe(0);
  });

  test('should register scroll listener with passive option on mount', async () => {
    await mountSuspended(TestComponent);
    expect(addEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
  });

  test('should remove scroll listener on unmount', async () => {
    const wrapper = await mountSuspended(TestComponent);
    wrapper.unmount();
    expect(removeEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  test('should update readProgress correctly after RAF flush', async () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(250);
    const wrapper = await mountSuspended(TestComponent);

    const scrollHandler = addEventSpy.mock.calls.find((c) => c[0] === 'scroll')[1];
    scrollHandler();

    expect(wrapper.vm.readProgress).toBe(0); // not yet flushed

    rafCallback();
    expect(wrapper.vm.readProgress).toBe(50); // 250 / (1000 - 500) * 100
  });

  test('should throttle multiple scroll events to a single RAF', async () => {
    await mountSuspended(TestComponent);
    const rafSpy = window.requestAnimationFrame;

    const scrollHandler = addEventSpy.mock.calls.find((c) => c[0] === 'scroll')[1];
    scrollHandler();
    scrollHandler();
    scrollHandler();

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  test('should cancel pending RAF on unmount', async () => {
    const cancelSpy = window.cancelAnimationFrame;
    const wrapper = await mountSuspended(TestComponent);

    const scrollHandler = addEventSpy.mock.calls.find((c) => c[0] === 'scroll')[1];
    scrollHandler(); // queues a RAF with id=1

    wrapper.unmount();
    expect(cancelSpy).toHaveBeenCalledWith(1);
  });
});
