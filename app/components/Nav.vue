<template>
  <nav class="w-full sticky top-0">
    <div class="container mx-auto p-4 lg:flex">
      <div
        class="w-full relative flex justify-between items-center lg:w-auto lg:static lg:block lg:justify-start"
      >
        <NuxtLink
          class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap"
          to="/"
        >
          Jose Chirivella
        </NuxtLink>
        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          @click="toggleNavbar()"
        >
          <Icon color="white" name="ci:hamburger-md" />
        </button>
      </div>
      <div
        :class="{ hidden: !showMenu, flex: showMenu }"
        class="lg:flex lg:flex-grow items-center"
      >
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li v-for="item in navItems" :key="item.name" class="nav-item">
            <NuxtLink
              :class="{
                'router-link-active': inBlog() && item.name === 'Blog',
              }"
              :target="item.target"
              :to="item.link"
              class="px-3 py-2 flex items-center text-lg font-bold leading-snug"
              @click="toggleNavbar()"
            >
              <i class="text-lg leading-lg opacity-75" /><span class="ml-2">{{
                item.name
              }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface INavItems {
  name: string;
  link: string;
  target?: string;
}

const route = useRoute();
const showMenu = ref(false);
const navItems: Array<INavItems> = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Blog",
    link: "/blog",
  },
  {
    name: "Resume",
    link: "https://storage.googleapis.com/portfolio-assets/resume/ResumeJose.pdf",
    target: "_blank",
  },
];

function toggleNavbar() {
  showMenu.value = !showMenu.value;
}

function inBlog(): boolean {
  return route.name === "blog";
}
</script>

<style lang="scss">
.nav-item {
  .router-link-active span {
    //@apply text-white;
  }
}
</style>
