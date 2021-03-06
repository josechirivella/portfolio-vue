import { shallowMount } from '@vue/test-utils';
import BtnIcons from '~/components/BtnIcons';

describe('BtnIcons', () => {
  let wrapper;
  let icon;
  beforeAll(() => {
    icon = 'times';
    wrapper = shallowMount(BtnIcons, {
      props: {
        icon,
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
  });
});
