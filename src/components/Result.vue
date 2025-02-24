<script setup>
    import { ref, watch } from 'vue'
    import { useMainStore } from '@/store'
    import Preview from './Preview.vue'

    const store = useMainStore()

    const colorNames = ref({})
    const loadingColors = ref({})

    // Функция для очистки неиспользуемых цветов
    function cleanupColorNames() {
        const currentColors = store.patches.map(patch => patch.color)
        Object.keys(colorNames.value).forEach(color => {
            if (!currentColors.includes(color)) {
                delete colorNames.value[color]
            }
        })
    }

    async function getColorName(color) {
        if (!colorNames.value[color] && !loadingColors.value[color]) {
            loadingColors.value[color] = true
            let name = 'Красный'

            try {
                const response = await fetch(`https://www.thecolorapi.com/id?hex=${color.slice(1)}`)
                const data = await response.json()

                const colorsResponse = await fetch(`/colors.json`)
                const jsonData = await colorsResponse.json()

                name = jsonData.find(item => item.Hex === data.name.closest_named_hex)?.Name || data.name.value

                colorNames.value[color] = name
            } catch (error) {
                console.error('Ошибка при получении названия цвета:', error)
                colorNames.value[color] = 'Ошибка загрузки'
            } finally {
                loadingColors.value[color] = false
            }
        }
        return colorNames.value[color]
    }

    // Используем debounce для предотвращения частых запросов
    let colorUpdateTimeout = null
    function debouncedColorUpdate(color) {
        if (colorUpdateTimeout) {
            clearTimeout(colorUpdateTimeout)
        }
        colorUpdateTimeout = setTimeout(() => {
            getColorName(color)
            cleanupColorNames() // Очищаем неиспользуемые цвета
        }, 500) // Задержка 500мс
    }

    // Следим за изменениями цветов в патчах
    watch(
        () => store.patches.map(patch => patch.color),
        (newColors) => {
            newColors.forEach(color => {
                if (!colorNames.value[color]) {
                    debouncedColorUpdate(color)
                }
            })
        },
        { immediate: true, deep: true }
    )
</script>

<template>
    <div class="box">
        <h2 class="title is-5">Предпросмотр</h2>
        <!-- Превью (placeholder) -->
        <Preview />

        <!-- Легенда цветов -->
        <h3 class="title is-6 mt-5 mb-2">Легенда цветов</h3>
        <table class="table is-fullwidth is-bordered">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Цвет</th>
                    <th>Кол-во лоскутов</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(patch, index) in store.patches" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="vertical-center">
                            <span class="color-swatch" :title="patch.color" :style="{ backgroundColor: patch.color }"></span>
                            <span v-if="colorNames[patch.color]">{{ colorNames[patch.color] }}</span>
                            <span v-else>
                                <span @vue:mounted="debouncedColorUpdate(patch.color)">Загрузка...</span>
                            </span>
                        </div>
                    </td>
                    <td>{{ patch.count }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Дополнительные кнопки (печать, экспорт) -->
    <!-- <div class="field is-grouped">
        <div class="control">
            <button type="button" class="button is-primary">
                <span class="icon">
                    <i class="ri-printer-line"></i>
                </span>
                <span>Распечатать</span>
            </button>
        </div>
        <div class="control">
            <button type="button" class="button is-info">
                <span class="icon">
                    <i class="ri-download-2-line"></i>
                </span>
                <span>Сохранить в PDF</span>
            </button>
        </div>
    </div> -->
</template>

<style scoped>
    .vertical-center {
        display: flex;
        align-items: center;
    }

    .color-swatch {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        display: inline-block;
        margin-right: 5px;
    }
</style>