<template>
  <div id='contactForm'>
    <form class='card' @submit='submitForm'>
      <input id='name' autocomplete='name' type='text' @input='contactForm.name'>
      <input id='email' autocomplete='email' type='email' @input='contactForm.email'>
      <textarea id='message' @input='contactForm.message'>
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
      contactForm: {
        name: String,
        email: String,
        message: String
      }
    };
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      console.log('form', e);
    }
  }
};
</script>
