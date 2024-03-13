import routes from '@/routes'
import { createRouter, createWebHistory } from 'vue-router'
import useMainStore from '@/store'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(async(to, from, next) => {
    const mainStore = useMainStore()
    if (process.env.NODE_ENV === 'production') {
        document?.ym(mainStore.ymCounter, 'hit', document.URL)
    }
})

export default router
