<script setup>
    import Settings from '@/components/Settings.vue'
    import Result from '@/components/Result.vue'
</script>

<template>
    <div class="columns is-multiline">
        <!-- Левая колонка: настройки -->
        <div class="column is-12-mobile is-4-desktop">
            <Settings />
        </div>

        <!-- Правая колонка: предпросмотр и легенда -->
        <div class="column is-12-mobile is-8-desktop">
            <Result />
        </div>
    </div>
</template>

<style scoped></style>
