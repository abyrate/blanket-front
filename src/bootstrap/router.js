import routes from '@/routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(async(to, from, next) => {
    if (process.env.NODE_ENV === 'production') {
        document?.ym(process.env.VUE_APP_YM_COUNTER, 'hit', document.URL)
    }
})

export default router
