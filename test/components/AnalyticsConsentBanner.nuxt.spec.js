import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';

import AnalyticsConsentBanner from '@/components/AnalyticsConsentBanner.vue';

const accept = vi.fn();
const decline = vi.fn();
const hydrate = vi.fn();
const showBanner = ref(true);

mockNuxtImport('useAnalyticsConsent', () => {
  return () => ({
    showBanner,
    accept,
    decline,
    hydrate,
  });
});

describe('AnalyticsConsentBanner', () => {
  beforeEach(() => {
    accept.mockClear();
    decline.mockClear();
    hydrate.mockClear();
    showBanner.value = true;
  });

  test('renders consent copy and actions when pending', async () => {
    const wrapper = await mountSuspended(AnalyticsConsentBanner);

    expect(hydrate).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Analytics');
    expect(wrapper.text()).toContain('PostHog');
    expect(wrapper.find('.analytics-consent__btn--solid').text()).toBe('Accept');
    expect(wrapper.find('.analytics-consent__btn--ghost').text()).toBe('Decline');
  });

  test('accept and decline call consent handlers', async () => {
    const wrapper = await mountSuspended(AnalyticsConsentBanner);

    await wrapper.find('.analytics-consent__btn--solid').trigger('click');
    expect(accept).toHaveBeenCalledTimes(1);

    await wrapper.find('.analytics-consent__btn--ghost').trigger('click');
    expect(decline).toHaveBeenCalledTimes(1);
  });

  test('hides when consent is already decided', async () => {
    showBanner.value = false;
    const wrapper = await mountSuspended(AnalyticsConsentBanner);
    expect(wrapper.find('.analytics-consent').exists()).toBe(false);
  });
});
