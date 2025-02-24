<script setup>
  import Navbar from './components/Navbar.vue'
  import { ref } from 'vue'

  const navbarRef = ref(null)

  function handleClick() {
    navbarRef.value?.closeMenu()
  }
</script>

<template>
  <Navbar ref="navbarRef" />

  <div class="container px-3 py-4" @click="handleClick">
    <router-view />
  </div>
</template>

<style scoped>
  .container {
    min-height: 100vh;
  }
</style>
