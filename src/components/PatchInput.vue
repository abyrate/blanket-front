<script setup>
    const props = defineProps({
        patch: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        hasDelete: {
            type: Boolean,
            default: false,
        },
    })

    const emit = defineEmits(['removePatch'])
</script>

<template>
    <div class="field has-addons">
        <div class="control">
            <input class="input color-picker" type="color" v-model="patch.color">
        </div>
        <div class="control is-expanded">
            <input class="input" type="number" v-model="patch.count" placeholder="Цвет 1: количество лоскутов">
        </div>
        <div class="control">
            <button type="button" class="button is-danger" @click="emit('removePatch', index)" :disabled="!hasDelete">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    </div>
</template>

<style scoped>
    .color-picker {
        width: 44px;
    }
</style>
