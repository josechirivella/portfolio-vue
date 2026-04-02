import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, test } from "vitest";
import { ref } from "vue";

import BlogSlug from "@/pages/blog/[...slug].vue";

const mockPost = ref(null);

mockNuxtImport("useAsyncData", () => {
  return () => ({
    data: mockPost,
  });
});

const mockDefaultPost = {
  title: "Test Post",
  description: "Test description",
  date: "2024-01-01",
  image: "/test-image.jpg",
  imageAlt: "Test image",
  body: {
    toc: { links: [] },
  },
};

describe("Blog Slug Page", () => {
  const defaultMountOptions = {
    route: {
      path: "/blog/test-post",
    },
    global: {
      stubs: {
        BlogReadProgress: true,
        LazyBlogToc: true,
        ContentRenderer: true,
        ScrollTop: true,
        NuxtImg: true,
      },
    },
  };

  const createWrapper = async (customOptions = {}) => {
    const mergedOptions = {
      ...defaultMountOptions,
      ...customOptions,
      route: {
        ...defaultMountOptions.route,
        ...customOptions.route,
      },
      global: {
        ...defaultMountOptions.global,
        ...customOptions.global,
      },
    };
    return await mountSuspended(BlogSlug, mergedOptions);
  };

  beforeEach(() => {
    mockPost.value = { ...mockDefaultPost };
  });

  test("should render component without errors", async () => {
    const wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
  });

  test("should handle component structure properly", async () => {
    const wrapper = await createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test("should have conditional rendering based on post existence", async () => {
    const wrapper = await createWrapper();
    const html = wrapper.html();
    expect(typeof html).toBe("string");
    expect(html).toContain("Test Post");
  });

  test("should use proper Nuxt composables", async () => {
    const wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$route).toBeDefined();
  });

  describe("Error handling", () => {
    test("should throw 404 when post is not found", async () => {
      mockPost.value = null;
      await expect(createWrapper()).rejects.toThrow("Page not found");
    });
  });
});
