<script setup>
    import { ref, watch, computed } from 'vue'
    import { useMainStore } from '@/store'
    import Preview from '@/components/Preview.vue'
    import PrintTemplate from '@/components/PrintTemplate.vue'
    import DonateButton from '@/components/DonateButton.vue'

    const store = useMainStore()

    const colorNames = ref({})
    const loadingColors = ref({})
    const printTemplateRef = ref(null)
    const isGenerating = ref(false)
    const activeView = ref('graphic') // 'graphic' или 'numeric'

    // Проверяем, загружены ли все цвета
    const isAllColorsLoaded = computed(() => {
        return store.patches.every(patch => colorNames.value[patch.color])
    })

    // Проверяем, можно ли генерировать PDF
    const canGeneratePdf = computed(() => {
        return store.generated && isAllColorsLoaded.value && !isGenerating.value
    })

    // Определяем, находимся ли мы на мобильном устройстве
    const isMobile = computed(() => {
        return window.innerWidth < 768
    })

    // Следим за изменением размера окна
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768
    })

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
                const response = await fetch('https://api.лоскутное-одеяло.рф/color/name', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        hex: color.slice(1)
                    })
                })
                const data = await response.json()
                name = data.name
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

    async function generatePDF() {
        if (!printTemplateRef.value || !canGeneratePdf.value) return

        try {
            isGenerating.value = true
            const html = printTemplateRef.value.getHTML()
            const response = await fetch('https://api.лоскутное-одеяло.рф/pdf/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html })
            })

            if (!response.ok) throw new Error('Ошибка при генерации PDF')

            const pdfBlob = await response.blob()
            return pdfBlob
        } catch (error) {
            console.error('Ошибка при генерации PDF:', error)
            throw error
        } finally {
            isGenerating.value = false
        }
    }

    async function handlePrint() {
        try {
            const pdfBlob = await generatePDF()
            const pdfUrl = URL.createObjectURL(pdfBlob)

            // Открываем PDF в новом окне для печати
            const printWindow = window.open(pdfUrl)
            printWindow.onload = () => {
                printWindow.print()
                URL.revokeObjectURL(pdfUrl)
            }
        } catch (error) {
            alert('Ошибка при подготовке к печати')
        }
    }

    async function handleDownload() {
        try {
            const pdfBlob = await generatePDF()
            const downloadUrl = URL.createObjectURL(pdfBlob)

            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'blanket.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100)
        } catch (error) {
            alert('Ошибка при скачивании PDF')
        }
    }
</script>

<template>
    <div class="box">
        <h2 class="title is-5">Предпросмотр</h2>

        <!-- Переключатель видов схемы -->
        <div v-if="store.generated" class="mb-4">
            <!-- Мобильная версия -->
            <button v-if="isMobile" class="button is-fullwidth" @click="activeView = activeView === 'graphic' ? 'numeric' : 'graphic'">
                <span class="icon">
                    <i :class="activeView === 'graphic' ? 'ri-table-line' : 'ri-image-line'"></i>
                </span>
                <span>{{ activeView === 'graphic' ? 'Показать числовую схему' : 'Показать графическую схему' }}</span>
            </button>

            <!-- Десктопная версия -->
            <div v-else class="tabs">
                <ul>
                    <li :class="{ 'is-active': activeView === 'graphic' }">
                        <a @click="activeView = 'graphic'">
                            <span class="icon"><i class="ri-image-line"></i></span>
                            <span>Графическая схема</span>
                        </a>
                    </li>
                    <li :class="{ 'is-active': activeView === 'numeric' }">
                        <a @click="activeView = 'numeric'">
                            <span class="icon"><i class="ri-table-line"></i></span>
                            <span>Числовая схема</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Контейнер для схем с анимацией -->
        <div class="preview-container">
            <!-- Графическая схема -->
            <div v-show="activeView === 'graphic'" :class="{ 'is-hidden-mobile': activeView === 'numeric' }">
                <Preview />
            </div>

            <!-- Числовая схема -->
            <div v-show="activeView === 'numeric'" :class="{ 'is-hidden-mobile': activeView === 'graphic' }">
                <div class="numeric-preview" v-if="store.generated">
                    <table class="table is-bordered numeric-table">
                        <tbody>
                            <tr v-for="(row, y) in store.quiltPattern" :key="y">
                                <td v-for="(patchIndex, x) in row" :key="x" class="has-text-centered">
                                    {{ patchIndex + 1 }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

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
    <div class="field is-grouped">
        <div class="control">
            <button type="button" class="button is-primary" @click="handlePrint" :disabled="!canGeneratePdf" :class="{ 'is-loading': isGenerating }">
                <span class="icon">
                    <i class="ri-printer-line"></i>
                </span>
                <span>Распечатать</span>
            </button>
        </div>
        <div class="control">
            <button type="button" class="button is-info" @click="handleDownload" :disabled="!canGeneratePdf" :class="{ 'is-loading': isGenerating }">
                <span class="icon">
                    <i class="ri-download-2-line"></i>
                </span>
                <span>Сохранить в PDF</span>
            </button>
        </div>
    </div>

    <DonateButton class="is-hidden-desktop is-hidden-tablet is-fullwidth" />

    <!-- Скрытый компонент для генерации PDF -->
    <PrintTemplate ref="printTemplateRef" :patches="store.patches" :color-names="colorNames" :width="store.width" :height="store.height" :variant="store.variant" :combination-seed="store.combinationSeed" :quilt-pattern="store.quiltPattern" />
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

    .preview-container {
        position: relative;
        min-height: 200px;
    }

    .numeric-preview {
        overflow-x: auto;
    }

    .numeric-table td {
        width: 40px;
        height: 40px;
        padding: 0;
        line-height: 40px;
        font-weight: bold;
    }

    @media screen and (max-width: 768px) {
        .numeric-table td {
            width: 32px;
            height: 32px;
            line-height: 32px;
            font-size: 0.9rem;
        }
    }

    /* Анимация переключения видов на мобильных устройствах */
    @media screen and (max-width: 768px) {
        .preview-container>div {
            transition: opacity 0.3s ease-in-out;
        }

        .is-hidden-mobile {
            opacity: 0;
            position: absolute;
            pointer-events: none;
        }
    }
</style>
