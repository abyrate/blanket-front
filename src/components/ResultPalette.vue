<template>
    <div class="d-none d-print-block">
        <div>
            <strong>Ширина</strong>: {{ mainStore.width }}
        </div>
        <div>
            <strong>Высота</strong>: {{ mainStore.height }}
        </div>
        <div>
            <strong>Вариант палитры</strong>: {{ mainStore.seedPalette }}
        </div>
        <div>
            <strong>Вариант комбинации</strong>: {{ mainStore.combinationSeed }}
        </div>
        <div>
            <strong>Количество цветов</strong>: {{ mainStore.numColors }}
        </div>
        <!-- <div class="mb-3">
            <div v-for="(pixelPerColor, index) in mainStore.pixelsPerColor" :key="index" class="d-print-inline-block m-1">
                <table class="table table-sm table-bordered table-condensed">
                    <tbody>
                        <tr>
                            <th scope="row" class="px-3">Цвет</th>
                            <td class="px-3 text-center">{{ index }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="px-3">Пикселей</th>
                            <td class="px-3 text-center">{{ pixelPerColor }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> -->
    </div>

    <div class="d-print-flex align-items-start">
        <canvas ref="canvas" class="img-thumbnail me-4" :width="mainStore.width * scale" :height="mainStore.height * scale" />
        <table class="table table-bordered table-sm table-condensed mt-3">
            <tbody>
                <tr v-for="y in mainStore.height" :key="y">
                    <td v-for="x in mainStore.width" :key="x" class="px-3 text-center">
                        {{ table?.[x-1]?.[y-1] ? (table?.[x-1]?.[y-1] + 1) : '1' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="mainStore.width * mainStore.height !== compared" class="alert alert-warning d-print-none" role="alert">
        Количество ячеек ({{ mainStore.width * mainStore.height }}) не совпадает с количеством цветов ({{ compared }})
    </div>
    <div class="my-4 d-print-none">
        <button class="btn btn-primary" :disabled="mainStore.width * mainStore.height !== compared" @click="generateImage">Сгенерировать</button>
        <button type="button" class="btn btn-outline-secondary ms-2" @click="print">Распечатать</button>
    </div>
</template>

<script setup>
import seedrandom from 'seedrandom'
import convert from 'color-convert'

import { computed, ref } from 'vue'
import { useMainStore } from '@/store'

const mainStore = useMainStore()

const canvas = ref()
const table = ref({})
const scale = ref(30)

function generateImage() {
    if (!mainStore.fixedCombinationSeed) {
        mainStore.combinationSeed = Math.floor(Math.random() * 10000)
    }

    createPalette()
    const context = canvas.value.getContext('2d')

    // Очищаем канвас
    const coords = []

    for (let x = 0; x < mainStore.width; x++) {
        for (let y = 0; y < mainStore.height; y++) {
            coords.push([x, y])
        }
    }

    const testCoords = shuffleArrayWithSeed(coords, mainStore.combinationSeed)

    for (const pixelsPerColorIndex in mainStore.pixelsPerColor) {
        for (let colorCount = 0; colorCount < mainStore.pixelsPerColor[pixelsPerColorIndex]; colorCount++) {
            const color = mainStore.colors[pixelsPerColorIndex - 1]

            if (coords.length) {
                const coordsIndex = testCoords.length - 1
                const x = coords[coordsIndex][0]
                const y = coords[coordsIndex][1]

                coords.splice(coordsIndex, 1)

                context.fillStyle = `rgb(${color})`
                context.fillRect(x * scale.value, y * scale.value, scale.value, scale.value)

                if (!table.value?.[x]) {
                    table.value[x] = {}
                }

                table.value[x][y] = mainStore.colors.indexOf(color)
            }
        }
    }
}

function createPalette() {
    const rng = seedrandom(mainStore.seedPalette)
    // Сбрасываем массив цветов
    mainStore.colors = []

    const baseHue = Math.round(rng() * 360)

    for (let i = 0; i < mainStore.numColors; i++) {
        const hueShift = (360 / mainStore.numColors) * i
        const hue = (baseHue + hueShift) % 360
        const color = convert.hsl.rgb(hue, 70, 80)
        mainStore.colors.push(color)
    }
}

const compared = computed(() => {
    let total = 0

    for (const countIndex in mainStore.pixelsPerColor) {
        total = total + mainStore.pixelsPerColor[countIndex]
    }
    return total
})

function print() {
    window.print()
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
</script>

<style scoped>
canvas {
  border: 1px solid #000;
  margin-top: 10px;
}
.table-condensed {
    width: auto;
}
</style>
