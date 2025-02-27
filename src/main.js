import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Подключаем стили Bulma и Remixicon
import 'bulma/css/bulma.min.css'
import 'remixicon/fonts/remixicon.css'

// Создаем экземпляр Pinia
const pinia = createPinia()

// Создаем роутер (здесь нужно будет добавить ваши маршруты)
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/help',
            component: () => import('./views/Help.vue')
        }
    ]
})

router.afterEach(async (to, from, next) => {
    if (process.env.NODE_ENV === 'production' && document?.ym) {
        document?.ym(document.ymCounter, 'hit', document.URL)
    }
})

const app = createApp(App)

// Подключаем плагины
app.use(pinia)
app.use(router)

app.mount('#app')
