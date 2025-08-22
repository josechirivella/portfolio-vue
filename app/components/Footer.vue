<template>
  <footer>
    <div class="copyright text-center p-4">
      &copy; {{ year }} Jose Chirivella. All rights reserved.
    </div>
  </footer>
</template>

<script lang="ts" setup>
const year = ref(new Date().getFullYear());
</script>
