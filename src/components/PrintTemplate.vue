<script setup>
    import { ref, onMounted } from 'vue'

    const props = defineProps({
        patches: {
            type: Array,
            required: true
        },
        colorNames: {
            type: Object,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        variant: {
            type: String,
            required: true
        },
        combinationSeed: {
            type: Number,
            required: true
        }
    })

    const templateRef = ref(null)
    const previewImage = ref('')

    onMounted(() => {
        updatePreviewImage()
    })

    function updatePreviewImage() {
        const canvas = document.querySelector('canvas')
        if (canvas) {
            previewImage.value = canvas.toDataURL('image/png')
        } else {
            // Если canvas не найден, пробуем еще раз через 100мс
            setTimeout(updatePreviewImage, 100)
        }
    }

    // Метод для получения HTML разметки
    function getHTML() {
        // Генерируем строки таблицы
        const tableRows = props.patches.map((patch, index) => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 40px;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="display: inline-block; min-width: 20px; width: 20px; height: 20px; background-color: ${patch.color}; margin-right: 10px; border: 1px solid #ddd;"></div>
                        <span style="white-space: normal;">${props.colorNames[patch.color]}</span>
                    </div>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 80px;">${patch.count}</td>
            </tr>
        `).join('')

        return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Схема лоскутного одеяла</title>
    <style>
        * {
            font-family: "DejaVu Sans", sans-serif;
        }
        body {
            font-size: 14px;
            line-height: 1.4;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
        }
        h2 {
            font-size: 18px;
            font-weight: bold;
        }
        .info-block {
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .preview-image {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        th:nth-child(1), td:nth-child(1) {
            width: 40px;
        }
        th:nth-child(2), td:nth-child(2) {
            width: auto;
        }
        th:nth-child(3), td:nth-child(3) {
            width: 80px;
        }
    </style>
</head>
<body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Схема лоскутного одеяла</h1>

        <!-- Информация о размерах и варианте -->
        <div class="info-block">
            <h2>Параметры схемы</h2>
            <p><strong>Размеры:</strong> ${props.width}x${props.height} лоскутов</p>
            <p><strong>Вариант комбинации:</strong> ${props.combinationSeed}</p>
        </div>

        <!-- Превью схемы -->
        <div style="text-align: center;">
            <h2>Схема</h2>
            ${previewImage.value ? `<img src="${previewImage.value}" alt="Схема одеяла" class="preview-image">` : '<p>Схема недоступна</p>'}
        </div>

        <!-- Легенда цветов -->
        <div style="margin-top: 30px;">
            <h2 style="color: #444;">Легенда цветов</h2>
            <table>
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">№</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Цвет</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Кол-во</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>

        <!-- Подвал -->
        <div class="footer">
            <p>Дата создания: ${new Date().toLocaleDateString('ru-RU')}</p>
            <p>Схема сгенерирована на сайте <a style="text-decoration: none;" href="https://лоскутное-одеяло.рф">лоскутное-одеяло.рф</a></p>
        </div>
    </div>
</body>
</html>`
    }

    defineExpose({ getHTML })
</script>

<template>
    <div ref="templateRef" style="display: none;"></div>
</template>
