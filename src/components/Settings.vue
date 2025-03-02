<script setup>
    import { computed, onMounted } from 'vue'
    import { useMainStore } from '@/store'
    const store = useMainStore()
    import PatchInput from '@/components/PatchInput.vue'

    const totalPatches = computed(() => {
        return store.patches.reduce((total, patch) => total + patch.count, 0)
    })

    const isError = computed(() => {
        return totalPatches.value !== store.width * store.height
    })

    // Функция сохранения конфигурации в файл
    function saveConfig() {
        const config = {
            width: store.width,
            height: store.height,
            patches: store.patches,
            fixedCombinationSeed: store.fixedCombinationSeed,
            combinationSeed: store.combinationSeed
        }

        const blob = new Blob([JSON.stringify(config)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'quilt_config.quilt'
        link.click()
        URL.revokeObjectURL(url)
    }

    // Функция проверки валидности конфигурации
    function validateConfig(width, height, patches) {
        const totalPatches = patches.reduce((total, patch) => total + patch.count, 0)
        return totalPatches === width * height
    }

    // Функция загрузки конфигурации из файла
    function loadConfig(event) {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result)

                // Проверяем валидность конфигурации
                if (!validateConfig(config.width, config.height, config.patches)) {
                    alert('Ошибка: количество лоскутов не соответствует размерам одеяла')
                    return
                }

                // Запоминаем оригинальное значение фиксации
                const originalFixed = config.fixedCombinationSeed

                // Временно включаем фиксацию seed
                store.fixedCombinationSeed = true

                // Устанавливаем seed до других параметров
                store.combinationSeed = config.combinationSeed

                // Устанавливаем остальные параметры
                store.width = config.width
                store.height = config.height
                store.patches = config.patches

                // Генерируем схему
                store.generate()

                // Восстанавливаем оригинальное значение фиксации
                store.fixedCombinationSeed = originalFixed
            } catch (error) {
                alert('Ошибка при чтении файла конфигурации')
            }
        }
        reader.readAsText(file)
    }

    // Функция применения конфигурации из URL
    function applyConfigFromUrl() {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('w')) return

        try {
            // Получаем параметры
            const width = parseInt(params.get('w'))
            const height = parseInt(params.get('h'))
            const colors = params.get('colors')?.split(',') || []
            const counts = params.get('counts')?.split(',').map(Number) || []

            // Создаем patches из цветов и количеств
            const patches = colors.map((color, index) => ({
                color,
                count: counts[index] || 1
            }))

            // Проверяем валидность конфигурации
            if (!validateConfig(width, height, patches)) {
                console.error('Ошибка: количество лоскутов не соответствует размерам одеяла')
                return
            }

            // Временно включаем фиксацию seed
            store.fixedCombinationSeed = true

            // Устанавливаем параметры
            store.width = width
            store.height = height
            store.combinationSeed = parseInt(params.get('seed'))
            store.patches = patches

            // Генерируем схему
            store.generate()

            // Восстанавливаем значение фиксации
            store.fixedCombinationSeed = params.get('fixed') === '1'

            // Очищаем URL после применения
            window.history.replaceState({}, '', window.location.pathname)
        } catch (error) {
            console.error('Ошибка при применении конфигурации из URL:', error)
        }
    }

    // Проверяем URL при загрузке компонента
    onMounted(() => {
        applyConfigFromUrl()
    })

    // Функция генерации ссылки
    async function getShareLink() {
        const params = new URLSearchParams({
            w: store.width,
            h: store.height,
            colors: store.patches.map(p => p.color).join(','),
            counts: store.patches.map(p => p.count).join(','),
            seed: store.combinationSeed,
            fixed: store.fixedCombinationSeed ? '1' : '0'
        })
        const url = `${window.location.origin}/?${params.toString()}`

        try {
            await navigator?.clipboard?.writeText(url)
            alert('Ссылка скопирована в буфер обмена')
        } catch (error) {
            // Если API буфера обмена недоступно, показываем ссылку
            alert('Ссылка на конфигурацию:\n' + url)
        }
    }
</script>

<template>
    <div class="box">
        <h2 class="title is-5">Параметры одеяла</h2>
        <form>
            <!-- Ширина и высота в одной строке -->
            <div class="columns mb-5">
                <div class="column">
                    <div class="field">
                        <label class="label">Ширина (лоскутов)</label>
                        <div class="control">
                            <input class="input" type="number" min="1" placeholder="Например, 5" v-model="store.width">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label">Высота (лоскутов)</label>
                        <div class="control">
                            <input class="input" type="number" min="1" placeholder="Например, 7" v-model="store.height">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Распределение лоскутов по цветам с выбором цвета -->
            <div class="field mb-5">
                <label class="label">Распределение лоскутов по цветам</label>
                <PatchInput v-for="(patch, index) in store.patches" :key="index" :index="index" :patch="patch" @removePatch="store.removePatch(index)" :hasDelete="store.patches.length > 1" />
                <button type="button" class="button is-link is-fullwidth" @click="store.addPatch">Добавить цвет</button>
            </div>

            <!-- Вариант комбинации (seed) -->
            <div class="field mb-5">
                <label class="label">Вариант комбинации (seed)</label>
                <div class="field has-addons">
                    <div class="control">
                        <label class="button">
                            <input class="mr-2" type="checkbox" v-model="store.fixedCombinationSeed">
                            Не менять
                        </label>
                    </div>
                    <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Например, 12345" :disabled="store.fixedCombinationSeed" v-model="store.combinationSeed">
                    </div>
                </div>
            </div>

            <!-- Предупреждение об ошибках (пример) -->
            <article class="message is-warning" v-if="isError">
                <div class="message-body">
                    Общее количество лоскутов всех цветов ({{ totalPatches }}) не совпадает с шириной × высотой ({{ store.width * store.height }}).
                </div>
            </article>

            <!-- Кнопки управления -->
            <div class="field is-grouped">
                <div class="control is-expanded">
                    <button type="button" class="button is-link is-fullwidth" :disabled="isError" @click="store.generate()">
                        <span class="icon">
                            <i class="ri-refresh-line"></i>
                        </span>
                        <span>Сгенерировать</span>
                    </button>
                </div>
                <div class="control">
                    <button type="button" class="button is-light" @click="store.reset" aria-label="Сбросить настройки">
                        <span class="icon">
                            <i class="ri-delete-back-2-line"></i>
                        </span>
                        <span class="is-hidden-mobile">Сбросить</span>
                    </button>
                </div>
            </div>

            <!-- Блок сохранения и загрузки -->
            <div class="mt-5 pt-5 is-bordered-top">
                <p class="subtitle is-6 mb-3">Сохранение и загрузка</p>
                <div class="field is-grouped is-grouped-multiline">
                    <div class="control">
                        <button type="button" class="button" @click="saveConfig" :disabled="!store.generated">
                            <span class="icon">
                                <i class="ri-save-line"></i>
                            </span>
                            <span>Сохранить</span>
                        </button>
                    </div>
                    <div class="control">
                        <label class="button">
                            <span class="icon">
                                <i class="ri-folder-open-line"></i>
                            </span>
                            <span>Загрузить</span>
                            <input type="file" accept=".quilt" style="display: none;" @change="loadConfig">
                        </label>
                    </div>
                    <div class="control">
                        <button type="button" class="button" @click="getShareLink" :disabled="!store.generated">
                            <span class="icon">
                                <i class="ri-share-line"></i>
                            </span>
                            <span>Ссылка</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .is-bordered-top {
        border-top: 1px solid #dbdbdb;
    }
</style>
