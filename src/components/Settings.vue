<script setup>
    import { computed } from 'vue'
    import { useMainStore } from '@/store'
    const store = useMainStore()
    import PatchInput from '@/components/PatchInput.vue'

    const totalPatches = computed(() => {
        return store.patches.reduce((total, patch) => total + patch.count, 0)
    })

    const isError = computed(() => {
        return totalPatches.value !== store.width * store.height
    })
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
                    <button type="button" class="button is-light" @click="store.reset">
                        <span class="icon">
                            <i class="ri-delete-back-2-line"></i>
                        </span>
                        <span class="is-hidden-mobile">Сбросить</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
