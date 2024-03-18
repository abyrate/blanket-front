<template>
    <div class="row">
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

</script>

<style>
canvas {
  border: 1px solid #000;
  margin-top: 10px;
}
</style>
