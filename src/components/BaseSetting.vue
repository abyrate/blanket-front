<template>
    <div class="mb-3">
        <label for="width" class="form-label">Ширина:</label>
        <input id="width" v-model="mainStore.width" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="height" class="form-label">Высота:</label>
        <input id="height" v-model="mainStore.height" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="colors" class="form-label">Количество цветов:</label>
        <input id="colors" v-model="mainStore.numColors" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="seedPalette" class="form-label">Сид палитры:</label>
        <input id="seedPalette" v-model="mainStore.seedPalette" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="seedCombination" class="form-label">Сид комбинации:</label>
        <div class="input-group mb-3">
            <div class="input-group-text">
                <input v-model="mainStore.fixedCombinationSeed" class="form-check-input mt-0" type="checkbox">
            </div>
            <input v-model="mainStore.combinationSeed" type="text" class="form-control" :disabled="mainStore.fixedCombinationSeed">
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store'

const mainStore = useMainStore()
</script>

<style lang="scss" scoped>

</style>
