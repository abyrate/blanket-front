<template>
    <nav class="navbar has-shadow is-fixed-top is-light is-flex" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img src="/icon.svg" alt="Logo">
            </a>
        </div>
        <div class="navbar-menu is-active">
            <div class="navbar-start is-flex is-flex-direction-row is-align-items-center">
                <router-link to="/" class="navbar-item" exactActiveClass="has-text-grey">Главная</router-link>
                <router-link to="/help" class="navbar-item" exactActiveClass="has-text-grey">Помощь</router-link>
            </div>
            <div class="navbar-end is-hidden-mobile">
                <div class="navbar-item">
                    <div class="buttons">
                        <DonateButton class="is-hidden-mobile" />
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import DonateButton from '@/components/DonateButton.vue';
</script>

<style scoped>
    @media screen and (max-width: 1024px) {
        .navbar-menu {
            display: flex !important;
            align-items: stretch;
            box-shadow: none;
            flex-grow: 1;
            flex-shrink: 0;
        }
    }

    .navbar,
    .navbar-end,
    .navbar-menu,
    .navbar-start {
        align-items: stretch;
        display: flex;
    }

    .navbar-end {
        justify-content: flex-end;
        margin-inline-start: auto;
    }
</style>
