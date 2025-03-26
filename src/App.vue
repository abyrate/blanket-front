<script setup>
    import Navbar from './components/Navbar.vue'
    import { onBeforeMount } from 'vue'
    import yMetrika from './bootstrap/y.metrika'

    onBeforeMount(() => {
        yMetrika()
    })
</script>

<template>
    <Navbar ref="navbarRef" />

    <div class="container px-3 py-4">
        <router-view />
    </div>
</template>

<style scoped></style>
