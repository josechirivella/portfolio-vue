import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Contact from '@/components/Contact.vue';

describe('Contact', () => {
  let wrapper;

  beforeAll(async () => {
    wrapper = await mountSuspended(Contact);
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

  describe('Form functionality', () => {
    test('should update name input value', async () => {
      const nameInput = wrapper.find('#name');
      await nameInput.setValue('John Doe');
      expect(wrapper.vm.name.value).toBe('John Doe');
    });

    test('should update email input value', async () => {
      const emailInput = wrapper.find('#email');
      await emailInput.setValue('john@example.com');
      expect(wrapper.vm.email.value).toBe('john@example.com');
    });

    test('should update message textarea value', async () => {
      const messageTextarea = wrapper.find('#message');
      await messageTextarea.setValue('Test message');
      expect(wrapper.vm.message.value).toBe('Test message');
    });
  });

  describe('Form submission', () => {
    test('should trigger submit event on form', async () => {
      const form = wrapper.find('form');
      let submitTriggered = false;

      // Listen for submit event
      form.element.addEventListener('submit', (e) => {
        e.preventDefault();
        submitTriggered = true;
      });

      await form.trigger('submit');
      expect(submitTriggered).toBe(true);
    });

    test('should have proper form attributes', () => {
      const nameInput = wrapper.find('#name');
      const emailInput = wrapper.find('#email');
      const messageTextarea = wrapper.find('#message');

      expect(nameInput.attributes('type')).toBe('text');
      expect(nameInput.attributes('autocomplete')).toBe('name');
      expect(nameInput.attributes('placeholder')).toBe('Your name');

      expect(emailInput.attributes('type')).toBe('email');
      expect(emailInput.attributes('autocomplete')).toBe('email');
      expect(emailInput.attributes('placeholder')).toBe('Your email');

      expect(messageTextarea.attributes('placeholder')).toBe(
        'Enter your message',
      );
    });
  });
});
