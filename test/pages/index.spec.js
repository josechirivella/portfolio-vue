import { shallowMount } from '@vue/test-utils';
import Index from '~/pages';

describe('Index', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Index);
  });
  test('should render', () => {
    expect(wrapper.vm).toBeTruthy();
  });
});
