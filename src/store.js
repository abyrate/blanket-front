import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('main', () => {
    const width = ref(1)
    const height = ref(1)
    const numColors = ref(1)
    const seedPalette = ref(Math.floor(Math.random() * 10000))
    const fixedCombinationSeed = ref(false)
    const combinationSeed = ref(Math.floor(Math.random() * 10000))
    const pixelsPerColor = ref({}) // Объект для хранения количества пикселей для каждого цвета
    const colors = ref([])
    const ymCounter = 96722734

    return {
        width,
        height,
        numColors,
        seedPalette,
        fixedCombinationSeed,
        combinationSeed,
        pixelsPerColor,
        colors,
        ymCounter,
    }
})
