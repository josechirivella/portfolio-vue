import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BtnIcons from '@/components/BtnIcons';

describe('BtnIcons', () => {
  let wrapper;
  let link;
  let icon;
  beforeAll(async () => {
    icon = 'times';
    link = 'https://www.google.com';
    wrapper = await mountSuspended(BtnIcons, {
      props: {
        link,
        icon,
      },
      global: {
        stubs: {
          Icon: true,
        },
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  test('should render component with link', async () => {
    link = 'https://www.facebook.com';
    icon = 'times';
    await wrapper.setProps({ link });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
