import routes from '@/routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(async(to, from, next) => {
    document?.ym(96722734, 'hit', document.URL)
})

export default router
