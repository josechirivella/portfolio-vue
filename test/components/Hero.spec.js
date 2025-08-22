import { beforeAll, describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Hero from '~/app/components/Hero.vue';

describe('Hero', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Hero, {});
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
  describe('BtnIcons', () => {
    test('icons length should be greater than 0', () => {
      expect(wrapper.vm.icons).not.toHaveLength(0);
      expect(wrapper.vm.icons).toHaveLength(6);
    });
  });
  describe('Hero content', () => {
    test('name should be present', () => {
      expect(wrapper.find('.hero__name').exists()).toBe(true);
      expect(wrapper.find('.hero__name').text()).toEqual('Jose Chirivella');
    });
    test('title should be present', () => {
      expect(wrapper.find('.hero__title').exists()).toBe(true);
      expect(wrapper.find('.hero__title').text()).toEqual('Software Engineer');
    });
  });
});
