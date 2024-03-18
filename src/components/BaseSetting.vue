<template>
    <div class="mb-3">
        <label for="width" class="form-label">Лоскутов в ширину:</label>
        <input id="width" v-model="mainStore.width" min="1" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="height" class="form-label">Лоскутов в высоту:</label>
        <input id="height" v-model="mainStore.height" min="1" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="colors" class="form-label">Количество цветов:</label>
        <input id="colors" v-model="mainStore.numColors" min="1" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <div class="form-check">
            <input id="flexCheckDefault" v-model="showSeeds" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="flexCheckDefault">
                Настроить вариативность
            </label>
        </div>
    </div>
    <div v-if="showSeeds" class="mb-3">
        <label for="seedPalette" class="form-label">Вариант палитры:</label>
        <input id="seedPalette" v-model="mainStore.seedPalette" min="0" class="form-control" type="number">
    </div>
    <div v-if="showSeeds" class="mb-3">
        <label for="seedCombination" class="form-label">Вариант комбинации:</label>
        <div class="input-group">
            <button id="button-addon1" class="btn btn-outline-secondary" type="button" @click="toggleFixedCombinationSeed">{{ mainStore.fixedCombinationSeed ? 'Случайно' : 'Зафиксировать' }}</button>
            <input v-model="mainStore.combinationSeed" min="0" type="text" class="form-control" :disabled="mainStore.fixedCombinationSeed">
        </div>
        <div id="emailHelp" class="form-text">
            {{ mainStore.fixedCombinationSeed ? 'Вариант зафиксирован' : 'Случайный вариант' }}
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store'
import { ref } from 'vue'

const mainStore = useMainStore()

const showSeeds = ref(false)

function toggleFixedCombinationSeed() {
    mainStore.fixedCombinationSeed = !mainStore.fixedCombinationSeed
}
</script>

<style lang="scss" scoped>

</style>
