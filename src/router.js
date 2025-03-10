import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('./views/Home.vue'),
        meta: {
            title: 'Генератор лоскутного одеяла',
            keywords: 'генератор схем лоскутного одеяла, пэчворк схемы, лоскутное шитьё, схема одеяла из лоскутов, пэчворк для начинающих, как сшить лоскутное одеяло, квилтинг, лоскутное одеяло своими руками, схема пэчворка, узоры для лоскутного шитья',
            description: 'Бесплатный онлайн генератор схем для лоскутного одеяла (пэчворк). Создавайте уникальные узоры, сохраняйте и распечатывайте схемы. Удобный инструмент для начинающих и опытных мастеров лоскутного шитья.'
        }
    },
    {
        path: '/help',
        component: () => import('./views/Help.vue'),
        meta: {
            title: 'Помощь | Генератор лоскутного одеяла',
            keywords: 'как пользоваться генератором схем, инструкция пэчворк, помощь лоскутное шитьё, руководство пэчворк, пэчворк для начинающих инструкция, как создать схему лоскутного одеяла',
            description: 'Подробная инструкция по использованию генератора схем для лоскутного одеяла. Пошаговое руководство по созданию, сохранению и печати схем для пэчворка.'
        }
    },
    {
        path: '/about',
        redirect: '/help'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Создаем роутер (здесь нужно будет добавить ваши маршруты)
router.afterEach(async (to, from) => {
    // Обновляем мета-теги
    if (to.meta.title) {
        document.title = to.meta.title
    }

    // Обновляем keywords
    const keywordsTag = document.querySelector('meta[name="keywords"]')
    if (keywordsTag && to.meta.keywords) {
        keywordsTag.setAttribute('content', to.meta.keywords)
    }

    // Обновляем description
    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag && to.meta.description) {
        descriptionTag.setAttribute('content', to.meta.description)
    }

    // Отправляем данные в Яндекс.Метрику
    if (process.env.NODE_ENV === 'production' && document?.ym) {
        document?.ym(document.ymCounter, 'hit', document.URL)
    }
})

export default router
