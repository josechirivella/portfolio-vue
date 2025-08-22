import { beforeAll, describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Btn from '@/components/Btn.vue';

describe('Btn', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Btn, {
      props: {
        classList: 'howdy',
      },
    });
  });
  test('should render', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
  test('should render btn with class', async () => {
    await wrapper.setProps({ classList: 'btn-primary' });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
