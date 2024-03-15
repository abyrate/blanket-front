<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="icon.svg" alt="Bootstrap" width="30" height="24">
            </a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                @click="toggleMenu"
            >
                <span class="navbar-toggler-icon" />
            </button>
            <div id="navbarSupportedContent" :class="{'show': isShowingMenu}" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{name: 'index'}" active-class="active" @click="closeMenu">
                            Генератор
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{name: 'about'}" active-class="active" @click="closeMenu">
                            Что это
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container-fluid" @click="closeMenu">
        <router-view />
    </div>
    <div class="sticky-bottom text-end">
        <div class="pb-3 pe-4">
            <a target="_blank" class="btn btn-outline-primary d-print-none" href="https://pay.cloudtips.ru/p/99b3202e" @click="donateAction">Поддержать автора</a>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isShowingMenu = ref(false)

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

function toggleMenu() {
    isShowingMenu.value = !isShowingMenu.value
}

function closeMenu() {
    isShowingMenu.value = false
}
</script>
