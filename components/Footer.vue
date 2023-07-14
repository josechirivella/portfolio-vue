<template>
  <footer>
    <div class="copyright text-center p-4">
      &copy; {{ year }} Jose Chirivella. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = ref(new Date().getFullYear());
</script>
