import { shallowMount } from '@vue/test-utils';
import BtnIcons from '~/components/BtnIcons';

describe('BtnIcons', () => {
  let wrapper;
  let link;
  let icon;
  beforeAll(() => {
    icon = 'times';
    link = 'https://www.google.com';
    wrapper = shallowMount(BtnIcons, {
      props: {
        link,
        icon,
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  test('should render component with link', () => {
    link = 'https://www.facebook.com';
    icon = 'times';
    wrapper.setProps({ link });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
