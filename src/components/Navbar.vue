<script setup>
    import { ref } from 'vue'
    const isMenuOpen = ref(false)

    defineExpose({
        closeMenu
    })

    function toggleMenu() {
        isMenuOpen.value = !isMenuOpen.value
    }

    function closeMenu() {
        isMenuOpen.value = false
    }

    function donateAction() {
        if (process.env.NODE_ENV === 'production') {
            document?.ym(document?.ymCounter, 'reachGoal', 'donate')
        }
    }
</script>

<template>
    <nav class="navbar has-shadow is-fixed-top is-light" role="navigation" aria-label="main navigation" @click="closeMenu">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img src="/icon.svg" alt="Logo">
                <span class="is-size-5 is-hidden-desktop">Лоскутное одеяло</span>
            </a>

            <a role="button" class="navbar-burger" :class="{ 'is-active': isMenuOpen }" aria-label="menu" aria-expanded="false" @click.stop="toggleMenu">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
            <div class="navbar-start">
                <router-link to="/" class="navbar-item is-tab" exactActiveClass="is-active">Главная</router-link>
                <router-link to="/help" class="navbar-item is-tab" exactActiveClass="is-active">Помощь</router-link>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a target="_blank" class="button is-link is-outlined" href="https://pay.cloudtips.ru/p/59ff4cbb" @click="">Поддержать автора</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>