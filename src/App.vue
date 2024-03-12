<template>
    <div class="row mt-4">
        <div class="col">
            <div class="mb-3">
                <label for="width" class="form-label">Ширина:</label>
                <input id="width" v-model="width" class="form-control" type="number">
            </div>
            <div class="mb-3">
                <label for="height" class="form-label">Высота:</label>
                <input id="height" v-model="height" class="form-control" type="number">
            </div>
            <div class="mb-3">
                <label for="colors" class="form-label">Количество цветов:</label>
                <input id="colors" v-model="numColors" class="form-control" type="number">
            </div>
            <!-- <div class="mb-3">
                <label for="seed" class="form-label">Сид:</label>
                <input id="seed" v-model="seed" class="form-control" type="number">
            </div> -->
            <div v-if="width * height !== compared" class="alert alert-warning" role="alert">
                Количество ячеек ({{ width * height }}) не совпадает с количеством цветов ({{ compared }})
            </div>
        </div>
        <div class="col">
            <div v-for="colorIndex in numColors" :key="colorIndex" class="mb-3">
                <label :for="'pixelsPerColor-' + colorIndex" class="form-label">Количество пикселей {{ colorIndex }} цвета:</label>
                <input :id="'pixelsPerColor-' + colorIndex" v-model="pixelsPerColor[colorIndex]" class="form-control" type="number">
            </div>
        </div>
        <div class="col">
            <canvas ref="canvas" class="img-thumbnail" :width="width * scale" :height="height * scale" />
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr v-for="y in height" :key="y">
                        <td v-for="x in width" :key="x">
                            {{ table?.[x-1]?.[y-1] + 1 }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="m-4 fixed-bottom">
        <button class="btn btn-primary" :disabled="width * height !== compared" @click="generateImage">Сгенерировать</button>
    </div>
</template>

<script setup>
import seedrandom from 'seedrandom'
import { computed, ref } from 'vue'

const width = ref(1)
const height = ref(1)
const numColors = ref(1)
const pixelsPerColor = ref({}) // Объект для хранения количества пикселей для каждого цвета

const colors = ref([])
// const seed = ref(Math.floor(Math.random() * numColors.value))
const scale = ref(20)
const canvas = ref()
const table = ref({})

function createPalette() {
    // Сбрасываем массив цветов
    colors.value = []
    let color

    while (colors.value.length < numColors.value) {
        color = generateColor()

        if (colors.value.indexOf(color) === -1) {
            colors.value.push(color)
        }
    }
}

function generateImage() {
    createPalette()
    const context = canvas.value.getContext('2d')

    // Очищаем канвас
    context.clearRect(0, 0, canvas.value.width, canvas.value.height)
    const coords = []

    for (let x = 0; x < width.value; x++) {
        for (let y = 0; y < height.value; y++) {
            coords.push(x + '-' + y)
        }
    }

    for (const pixelsPerColorIndex in pixelsPerColor.value) {
        for (let colorCount = 0; colorCount < pixelsPerColor.value[pixelsPerColorIndex]; colorCount++) {
            const color = colors.value[pixelsPerColorIndex - 1]

            if (coords.length) {
                const coordsIndex = Math.floor(Math.random() * coords.length)

                console.log(coords[coordsIndex], coordsIndex, coords.length)
                const coord = coords[coordsIndex].split('-')
                const x = coord[0]
                const y = coord[1]

                coords.splice(coordsIndex, 1)

                // console.log(x, y, color)

                context.fillStyle = `rgb(${color})`
                context.fillRect(x * scale.value, y * scale.value, scale.value, scale.value)

                if (!table.value?.[x]) {
                    table.value[x] = {}
                }

                table.value[x][y] = colors.value.indexOf(color)
            }
        }
    }
    // for (let x = 0; x < width.value; x++) {
    //     for (let y = 0; y < height.value; y++) {
    //         let color

    //         do {
    //             const colorIndex = getRandom(1, numColors.value)

    //             if (colors.value?.[colorIndex] && pixelsPerColorCounter[colorIndex] > 0) {
    //                 color = colors.value[colorIndex]
    //                 pixelsPerColorCounter[colorIndex]--
    //             }
    //         } while (!color)

    //         context.fillStyle = `rgb(${color})`
    //         context.fillRect(x * scale.value, y * scale.value, scale.value, scale.value)

    //         if (!table.value?.[x]) {
    //             table.value[x] = {}
    //         }

    //         table.value[x][y] = colors.value.indexOf(color)
    //     }
    // }
    // console.log(table.value, colors.value)
}
function generateColor() {
    const rng = seedrandom(Math.floor(Math.random() * numColors.value))

    return [
        Math.round(rng() * 255),
        Math.round(rng() * 255),
        Math.round(rng() * 255),
    ].join(',')
}

// function getRandom(min, max) {
//     return Math.floor(Math.random() * (max - min) + min)
// }

const compared = computed(() => {
    let total = 0

    for (const countIndex in pixelsPerColor.value) {
        total = total + pixelsPerColor.value[countIndex]
    }
    return total
})
</script>

<style>
canvas {
  border: 1px solid #000;
  margin-top: 10px;
}
</style>
