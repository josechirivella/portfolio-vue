import { shallowMount } from "@vue/test-utils";
import { beforeAll, describe, expect, test } from "vitest";
import Tags from "@/components/blog/Tags.vue";

describe("Tags", () => {
  let wrapper;
  const mockTags = ["vue", "javascript", "testing"];

  beforeAll(() => {
    wrapper = shallowMount(Tags, {
      props: {
        tags: mockTags,
      },
    });
  });

  test("should render component", () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  describe("Tags rendering", () => {
    test("should render the correct number of tags", () => {
      const tagElements = wrapper.findAll(".inline-block");
      expect(tagElements.length).toBe(mockTags.length);
    });

    test("should render the correct tag text", () => {
      const tagElements = wrapper.findAll(".inline-block");

      mockTags.forEach((tag, index) => {
        expect(tagElements[index].text()).toBe(`#${tag}`);
      });
    });
  });

  describe("Props", () => {
    test("should receive tags prop correctly", () => {
      expect(wrapper.props("tags")).toEqual(mockTags);
    });

    test("should update when tags prop changes", async () => {
      const newTags = ["nuxt", "typescript"];

      await wrapper.setProps({
        tags: newTags,
      });

      const tagElements = wrapper.findAll(".inline-block");
      expect(tagElements.length).toBe(newTags.length);

      newTags.forEach((tag, index) => {
        expect(tagElements[index].text()).toBe(`#${tag}`);
      });
    });
  });
});
