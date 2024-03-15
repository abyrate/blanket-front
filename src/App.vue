<template>
    <div class="row mt-4">
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
    <div class="position-absolute bottom-0 end-0 m-4">
        <a target="_blank" class="btn btn-outline-primary" href="https://pay.cloudtips.ru/p/99b3202e">Поддержать автора</a>
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
</script>

<style>
canvas {
  border: 1px solid #000;
  margin-top: 10px;
}
</style>
