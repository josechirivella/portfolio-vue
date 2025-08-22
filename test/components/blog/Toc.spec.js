import { beforeAll, describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Toc from '@/components/blog/Toc.vue';

describe('Toc', () => {
  let wrapper;
  const mockToc = {
    links: [
      {
        id: 'section-1',
        text: 'Section 1',
        children: [
          {
            id: 'subsection-1-1',
            text: 'Subsection 1.1',
          },
          {
            id: 'subsection-1-2',
            text: 'Subsection 1.2',
          },
        ],
      },
      {
        id: 'section-2',
        text: 'Section 2',
        children: null,
      },
    ],
  };

  beforeAll(() => {
    wrapper = shallowMount(Toc, {
      props: {
        toc: mockToc,
      },
    });
  });

  test('should render component', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  describe('Table of contents rendering', () => {
    test('should render the title', () => {
      const title = wrapper.find('h2');
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe('Table of contents');
    });

    test('should render the correct number of top-level links', () => {
      const topLevelLinks = wrapper.findAll('ul > li:first-child > a');
      expect(topLevelLinks.length).toBe(mockToc.links.length);
    });

    test.skip('should render the correct top-level link text and href', () => {
      const topLevelLinks = wrapper.findAll('ul > li:first-child > a');

      mockToc.links.forEach((link, index) => {
        expect(topLevelLinks[index].text()).toBe(link.text);
        expect(topLevelLinks[index].attributes('href')).toBe(`#${link.id}`);
      });
    });

    test('should render nested children for links that have them', () => {
      // First link has children
      const firstLinkChildren = wrapper.findAll(
        'ul > li:first-child > ul > li',
      );
      expect(firstLinkChildren.length).toBe(mockToc.links[0].children.length);

      mockToc.links[0].children.forEach((child, index) => {
        const childLink = firstLinkChildren[index].find('a');
        expect(childLink.text()).toBe(child.text);
        expect(childLink.attributes('href')).toBe(`#${child.id}`);
      });
    });

    test("should not render nested children for links that don't have them", () => {
      // Second link doesn't have children
      const secondLinkChildren = wrapper.findAll('ul > li:nth-child(2) > ul');
      expect(secondLinkChildren.length).toBe(0);
    });
  });

  describe('Props', () => {
    test('should receive toc prop correctly', () => {
      expect(wrapper.props('toc')).toEqual(mockToc);
    });
  });
});
