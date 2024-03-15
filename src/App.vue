<template>
    <div class="row mt-4 mb-5">
        <div class="col-sm-4 d-print-none">
            <BaseSetting />
        </div>
        <div class="col-sm-4 d-print-none">
            <ColorsInput />
        </div>
        <div class="col-sm-4">
            <ResultPalette />
        </div>
    </div>
    <div class="fixed-bottom text-end">
        <div class="pb-3 pe-4">
            <a target="_blank" class="btn btn-outline-primary d-print-none" href="https://pay.cloudtips.ru/p/99b3202e" @click="donateAction">Поддержать автора</a>
        </div>
    </div>
</template>

<script setup>
import BaseSetting from '@/components/BaseSetting.vue'
import ColorsInput from '@/components/ColorsInput.vue'
import ResultPalette from '@/components/ResultPalette.vue'

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
</script>

<style>
canvas {
  border: 1px solid #000;
  margin-top: 10px;
}
</style>
