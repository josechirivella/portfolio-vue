import { beforeAll, describe, expect, test, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Contact from '~/components/Contact.vue';

describe.skip('Contact', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Contact, {
      data() {
        return {
          name: '',
          email: '',
          message: '',
        };
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  describe('Form elements', () => {
    test('form should exist', () => {
      expect(wrapper.find('form').exists()).toBe(true);
    });

    test('name input should exist', () => {
      expect(wrapper.find('#name').exists()).toBe(true);
    });

    test('email input should exist', () => {
      expect(wrapper.find('#email').exists()).toBe(true);
    });

    test('message textarea should exist', () => {
      expect(wrapper.find('#message').exists()).toBe(true);
    });

    test('submit button should exist', () => {
      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.find('button').text()).toBe('Submit');
    });
  });

  describe('Form submission', () => {
    test('submitForm should be called when form is submitted', async () => {
      const form = wrapper.find('form');
      const submitFormSpy = vi.spyOn(wrapper.vm, 'submitForm');

      await form.trigger('submit');

      expect(submitFormSpy).toHaveBeenCalled();
    });
  });
});
