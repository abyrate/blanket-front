<template>
    <nav class="navbar navbar-expand bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="icon.svg" alt="Bootstrap" width="30" height="24">
            </a>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'index'}" active-class="active">
                        Генератор
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{name: 'about'}" active-class="active">
                        Что это?
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container-fluid pb-2" @click="closeMenu">
        <router-view />
        <div class="my-4 d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none">
            <a target="_blank" class="btn btn-outline-primary d-print-none" href="https://pay.cloudtips.ru/p/99b3202e" @click="donateAction">Поддержать автора</a>
        </div>
    </div>
    <div class="position-absolute bottom-0 end-0 m-4 text-end d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block">
        <a target="_blank" class="btn btn-outline-primary d-print-none" href="https://pay.cloudtips.ru/p/99b3202e" @click="donateAction">Поддержать автора</a>
    </div>
</template>

<script setup>
// import { ref } from 'vue'

// const isShowingMenu = ref(false)

if (process.env.NODE_ENV === 'production') {
    document?.ym(process.env.VUE_APP_YM_COUNTER, 'init', {
        defer: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
    })
}

function donateAction() {
    if (process.env.NODE_ENV === 'production') {
        document?.ym(process.env.VUE_APP_YM_COUNTER, 'reachGoal', 'donate')
    }
}

// function toggleMenu() {
//     isShowingMenu.value = !isShowingMenu.value
// }

// function closeMenu() {
//     isShowingMenu.value = false
// }
</script>
