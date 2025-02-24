<script setup>
    import { ref, watch, nextTick } from 'vue'
    import { useMainStore } from '@/store'

    const store = useMainStore()
    const canvas = ref(null)
    const scale = ref(30)

    // Функция отрисовки паттерна
    function drawPattern() {
        if (!canvas.value) return

        const context = canvas.value.getContext('2d')
        context.clearRect(0, 0, canvas.value.width, canvas.value.height)

        // Проходим по всему паттерну и отрисовываем квадраты
        for (let y = 0; y < store.height; y++) {
            for (let x = 0; x < store.width; x++) {
                const patchIndex = store.quiltPattern[y][x]
                if (patchIndex !== null) {
                    const color = store.patches[patchIndex].color
                    context.fillStyle = color
                    context.fillRect(x * scale.value, y * scale.value, scale.value, scale.value)
                }
            }
        }
    }

    // Отслеживаем изменения паттерна и состояния генерации
    watch(
        () => store.generated,
        async (newValue) => {
            if (newValue) {
                // Ждем обновления DOM перед отрисовкой
                await nextTick()
                drawPattern()
            }
        }
    )

    // Отдельно отслеживаем изменения паттерна и патчей
    watch(
        [
            () => store.quiltPattern,
            () => store.patches
        ],
        async () => {
            if (store.generated) {
                await nextTick()
                drawPattern()
            }
        },
        { deep: true }
    )

    // Отслеживаем изменения размеров
    watch(
        [
            () => store.width,
            () => store.height
        ],
        async () => {
            if (canvas.value) {
                canvas.value.width = store.width * scale.value
                canvas.value.height = store.height * scale.value
                if (store.generated) {
                    await nextTick()
                    drawPattern()
                }
            }
        }
    )
</script>

<template>
    <figure class="image">
        <canvas v-if="store.generated" ref="canvas" class="img-thumbnail me-4" :width="store.width * scale" :height="store.height * scale" />
        <p v-else>Предпросмотр одеяла</p>
    </figure>
</template>

<style scoped>
    .image {
        width: 300px;
        height: auto;
        min-height: 100px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
    }

    canvas {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>