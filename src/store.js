import { defineStore } from 'pinia'
import { ref } from 'vue'

import convert from 'color-convert'
import seedrandom from 'seedrandom'

export const useMainStore = defineStore('main', () => {
    const width = ref(2)
    const height = ref(3)
    const fixedCombinationSeed = ref(false)
    const combinationSeed = ref(Math.floor(Math.random() * 10000))
    const patches = ref([])
    const generated = ref(false)
    const quiltPattern = ref([])

    function addPatch() {
        patches.value.push({
            color: randomColor(),
            count: 1,
        })
    }

    addPatch()

    function removePatch(index) {
        patches.value.splice(index, 1)
    }

    function reset() {
        width.value = 2
        height.value = 3

        if (!fixedCombinationSeed.value) {
            combinationSeed.value = Math.floor(Math.random() * 10000)
        }

        patches.value = [{
            color: randomColor(),
            count: 1,
        }]

        generated.value = false
    }

    function generate() {
        generated.value = false

        if (process.env.NODE_ENV === 'production') {
            document?.ym(document?.ymCounter, 'reachGoal', 'generate')
        }

        if (!fixedCombinationSeed.value) {
            combinationSeed.value = Math.floor(Math.random() * 10000)
        }

        const coords = []
        for (let x = 0; x < width.value; x++) {
            for (let y = 0; y < height.value; y++) {
                coords.push([x, y])
            }
        }

        const shuffledCoords = shuffleArrayWithSeed([...coords], combinationSeed.value)

        quiltPattern.value = Array(height.value).fill(null)
            .map(() => Array(width.value).fill(null))

        let coordIndex = 0
        for (let patchIndex = 0; patchIndex < patches.value.length; patchIndex++) {
            const patch = patches.value[patchIndex]
            for (let count = 0; count < patch.count; count++) {
                if (coordIndex < shuffledCoords.length) {
                    const [x, y] = shuffledCoords[coordIndex]
                    quiltPattern.value[y][x] = patchIndex
                    coordIndex++
                }
            }
        }

        generated.value = true
    }

    function shuffleArrayWithSeed(array, seed) {
        const getRandom = (min, max) => {
            const x = Math.sin(seed++) * 10000
            return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
        }

        for (let i = array.length - 1; i > 0; i--) {
            const j = getRandom(0, i);
            [array[i], array[j]] = [array[j], array[i]]
        }

        return array
    }

    function randomColor() {
        const rng = seedrandom()

        const hue = Math.round(rng() * 360)

        return `#${convert.hsl.hex(hue, 70, 80)}`
    }

    return {
        width,
        height,
        fixedCombinationSeed,
        combinationSeed,
        patches,
        quiltPattern,
        addPatch,
        removePatch,
        reset,
        generate,
        generated,
        randomColor,
    }
})
