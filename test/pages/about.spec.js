import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import About from '@/pages/about.vue';

describe('About Page', () => {
  let wrapper;

  beforeAll(async () => {
    wrapper = await mountSuspended(About);
  });

  test('should render about page content', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find('h1').text()).toBe("Hi, I'm Jose!");
  });

  test('should contain key information about Jose', () => {
    const text = wrapper.text();
    expect(text).toContain('Senior Software Engineer');
    expect(text).toContain('10 years of experience');
    expect(text).toContain('Venezuela');
    expect(text).toContain('The Iron Yard');
    expect(text).toContain('Cisco Systems');
  });

  test('should contain technology information', () => {
    const text = wrapper.text();
    expect(text).toContain('Vue and Angular');
    expect(text).toContain('Rails');
    expect(text).toContain('Laravel');
    expect(text).toContain('NodeJS');
  });

  test('should contain site technology stack information', () => {
    const text = wrapper.text();
    expect(text).toContain('Nuxt');
    expect(text).toContain('TailwindCSS');
    expect(text).toContain('PrimeVue');
    expect(text).toContain('Vercel');
  });

  test('should have external link to pnpm', () => {
    const pnpmLink = wrapper.find('a[href="https://pnpm.io/"]');
    expect(pnpmLink.exists()).toBe(true);
    expect(pnpmLink.text()).toBe('pnpm');
    expect(pnpmLink.attributes('target')).toBe('_blank');
  });

  test('should have proper prose styling classes', () => {
    const mainDiv = wrapper.find('div');
    expect(mainDiv.classes()).toContain('prose');
    expect(mainDiv.classes()).toContain('dark:prose-invert');
    expect(mainDiv.classes()).toContain('lg:prose-xl');
    expect(mainDiv.classes()).toContain('mx-auto');
  });
});
