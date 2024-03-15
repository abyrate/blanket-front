<template>
    <div class="mb-3">
        <label for="width" class="form-label">Ширина:</label>
        <input id="width" v-model="mainStore.width" min="0" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="height" class="form-label">Высота:</label>
        <input id="height" v-model="mainStore.height" min="0" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <label for="colors" class="form-label">Количество цветов:</label>
        <input id="colors" v-model="mainStore.numColors" min="0" class="form-control" type="number">
    </div>
    <div class="mb-3">
        <div class="form-check">
            <input id="flexCheckDefault" v-model="showSeeds" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="flexCheckDefault">
                Настроить варианты
            </label>
        </div>
    </div>
    <div v-if="showSeeds" class="mb-3">
        <label for="seedPalette" class="form-label">Вариант палитры:</label>
        <input id="seedPalette" v-model="mainStore.seedPalette" min="0" class="form-control" type="number">
    </div>
    <div v-if="showSeeds" class="mb-3">
        <label for="seedCombination" class="form-label">Вариант комбинации:</label>
        <div class="input-group mb-3">
            <div class="input-group-text">
                <input v-model="mainStore.fixedCombinationSeed" class="form-check-input mt-0" type="checkbox">
            </div>
            <input v-model="mainStore.combinationSeed" min="0" type="text" class="form-control" :disabled="mainStore.fixedCombinationSeed">
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from '@/store'
import { ref } from 'vue'

const mainStore = useMainStore()

const showSeeds = ref(false)
</script>

<style lang="scss" scoped>

</style>
