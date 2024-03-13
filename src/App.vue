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
</template>

<script setup>
import BaseSetting from '@/components/BaseSetting.vue'
import ColorsInput from '@/components/ColorsInput.vue'
import ResultPalette from '@/components/ResultPalette.vue'
import useMainStore from '@/store'

if (process.env.NODE_ENV === 'production') {
    const mainStore = useMainStore()

    document?.ym(mainStore.ymCounter, 'init', {
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
