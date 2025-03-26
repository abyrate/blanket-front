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
    const usedPatches = ref([])

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

    function generate(options = {}) {
        generated.value = false

        if (process.env.NODE_ENV === 'production' && document?.ym) {
            document?.ym(document?.ymCounter, 'reachGoal', 'generate')
        }

        if (!options.skipSeedGeneration && !fixedCombinationSeed.value) {
            combinationSeed.value = Math.floor(Math.random() * 10000)
        }

        const totalArea = width.value * height.value
        const totalPatches = patches.value.reduce((sum, patch) => sum + patch.count, 0)

        const coords = []
        for (let x = 0; x < width.value; x++) {
            for (let y = 0; y < height.value; y++) {
                coords.push([x, y])
            }
        }

        const shuffledCoords = shuffleArrayWithSeed([...coords], combinationSeed.value)

        quiltPattern.value = Array(height.value).fill(null)
            .map(() => Array(width.value).fill(null))

        usedPatches.value = Array(patches.value.length).fill(0)

        let coordIndex = 0
        for (let patchIndex = 0; patchIndex < patches.value.length && coordIndex < totalArea; patchIndex++) {
            const [x, y] = shuffledCoords[coordIndex]
            quiltPattern.value[y][x] = patchIndex
            usedPatches.value[patchIndex]++
            coordIndex++
        }

        if (coordIndex < totalArea) {
            const remainingArea = totalArea - coordIndex
            const remainingCoords = shuffledCoords.slice(coordIndex)

            const remainingPatches = patches.value.map((patch, index) => ({
                index,
                count: Math.max(0, patch.count - 1)
            }))

            const totalRemaining = remainingPatches.reduce((sum, p) => sum + p.count, 0)
            const scale = totalRemaining > 0 ? remainingArea / totalRemaining : 1

            let usedArea = 0
            for (const patch of remainingPatches) {
                const scaledCount = Math.round(patch.count * scale)
                for (let i = 0; i < scaledCount && usedArea < remainingArea; i++) {
                    const [x, y] = remainingCoords[usedArea]
                    quiltPattern.value[y][x] = patch.index
                    usedPatches.value[patch.index]++
                    usedArea++
                }
            }

            while (usedArea < remainingArea) {
                const [x, y] = remainingCoords[usedArea]
                const patchIndex = Math.floor(seedrandom(combinationSeed.value + usedArea)() * patches.value.length)
                quiltPattern.value[y][x] = patchIndex
                usedPatches.value[patchIndex]++
                usedArea++
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
        usedPatches,
        addPatch,
        removePatch,
        reset,
        generate,
        generated,
        randomColor,
    }
})
