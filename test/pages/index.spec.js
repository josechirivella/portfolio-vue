import { shallowMount } from "@vue/test-utils";
import { beforeAll, describe, expect, test } from "vitest";
import Index from "@/pages";

describe("Index", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallowMount(Index);
  });
  test("should render", () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
