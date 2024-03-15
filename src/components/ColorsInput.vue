<template>
    <div v-for="colorIndex in mainStore.numColors" :key="colorIndex" class="mb-3">
        <label :for="'pixelsPerColor-' + colorIndex" class="form-label">Количество лоскутов {{ colorIndex }} цвета:</label>
        <input :id="'pixelsPerColor-' + colorIndex" v-model="mainStore.pixelsPerColor[colorIndex]" min="0" class="form-control" type="number">
    </div>
</template>

<script setup>
import { useMainStore } from '@/store'

const mainStore = useMainStore()
</script>

<style lang="scss" scoped>

</style>
