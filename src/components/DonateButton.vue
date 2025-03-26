<script setup>
    function donateAction() {
        if (process.env.NODE_ENV === 'production' && document?.ym) {
            document?.ym(document?.ymCounter, 'reachGoal', 'donate')
        }
    }
</script>

<template>
    <a target="_blank" class="button is-link is-outlined" @click="donateAction" href="https://pay.cloudtips.ru/p/59ff4cbb">
        Поддержать автора
    </a>
</template>
