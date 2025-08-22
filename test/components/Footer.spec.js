import { beforeAll, describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Footer from '@/components/Footer';

describe('Footer', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Footer, {
      data() {
        return {
          year: new Date().getFullYear(),
        };
      },
    });
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
