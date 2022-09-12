<template>
  <div id='contactForm' class='border border-gray-300 rounded-lg p-4 w-1/4'>
    <form class='card flex flex-col' @submit='submitForm'>
      <input id="name" v-model.lazy.trim="name" autocomplete="name" class="mb-4 p-2" placeholder="Your name"
             type="text">
      <input id="email" v-model.lazy.trim="email" autocomplete="email" class="mb-4 p-2" placeholder="Your email"
             type="email">
      <textarea id="message" v-model.lazy="message" class="p-2" placeholder="Enter your message">
      </textarea>
      <button>
        Submit
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: ''
    };
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      const { name, email, message } = this;
      console.log({ name, email, message });
    }
  }
};
</script>
