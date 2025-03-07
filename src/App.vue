<script setup>
    import Navbar from './components/Navbar.vue'
    import { onBeforeMount, ref } from 'vue'
    import yMetrika from './bootstrap/y.metrika'

    const navbarRef = ref(null)

    function handleClick() {
        navbarRef.value?.closeMenu()
    }

    onBeforeMount(() => {
        yMetrika()
    })
</script>

<template>
    <Navbar ref="navbarRef" />

    <div class="container px-3 py-4" @click="handleClick">
        <router-view />
    </div>
</template>

<style scoped></style>
