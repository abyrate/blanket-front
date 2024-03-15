import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('main', () => {
    const width = ref(2)
    const height = ref(3)
    const numColors = ref(3)
    const seedPalette = ref(Math.floor(Math.random() * 10000))
    const fixedCombinationSeed = ref(false)
    const combinationSeed = ref(Math.floor(Math.random() * 10000))
    const pixelsPerColor = ref({}) // Объект для хранения количества пикселей для каждого цвета
    const colors = ref([])

    return {
        width,
        height,
        numColors,
        seedPalette,
        fixedCombinationSeed,
        combinationSeed,
        pixelsPerColor,
        colors,
    }
})
