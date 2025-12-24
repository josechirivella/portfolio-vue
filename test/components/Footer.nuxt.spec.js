import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Footer from '@/components/Footer';

describe('Footer', () => {
  let wrapper;
  beforeAll(async () => {
    wrapper = await mountSuspended(Footer);
  });
  test('should render', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
  test('should set the current year', () => {
    const year = new Date().getFullYear();
    expect(wrapper.text()).toContain(year.toString());
  });
});
