<template>
  <footer>
    <div class='copyright text-center'>
      &copy; {{ year }} Jose Chirivella. All Copyrights reserved.
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
