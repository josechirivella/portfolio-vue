<template>
  <footer>
    <div class='copyright text-center p-4'>
      &copy; {{ year }} Jose Chirivella. All rights reserved.
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>
