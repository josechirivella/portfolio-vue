import { shallowMount } from '@vue/test-utils';
import Footer from '~/components/Footer';

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
  });
  test('should set the current year', () => {
    expect(wrapper.text()).toContain('2021');
  });
});
