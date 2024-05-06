<template>
  <nav class="bg-[#141618] w-full sticky top-0">
    <div class="container mx-auto p-4 lg:flex">
      <div
        class="w-full relative flex justify-between items-center lg:w-auto lg:static lg:block lg:justify-start"
      >
        <NuxtLink
          class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white"
          to="/"
        >
          Jose Chirivella
        </NuxtLink>
        <button
          class="text-white cursor-pointer text-xl leading-none px-3 py-1 rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          @click="toggleNavbar()"
        >
          <Icon name="ci:hamburger-md" color="white" />
        </button>
      </div>
      <div
        :class="{ hidden: !showMenu, flex: showMenu }"
        class="lg:flex lg:flex-grow items-center"
      >
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li v-for="item in navItems" :key="item.name" class="nav-item">
            <NuxtLink
              class="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75"
              :to="item.link"
              :target="item.target"
            >
              <i
                class="text-lg leading-lg text-white opacity-75"
              /><span class="ml-2">{{ item.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface INavItems {
  name: string;
  link: string;
  target?: string;
}
const showMenu = ref(false);
const navItems: Array<INavItems> = [
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
</script>
