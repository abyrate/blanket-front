import Index from '@/pages/Index.vue'
import About from '@/pages/About.vue'

export default [
    {
        path: '',
        component: Index,
        name: 'index',
    },
    {
        path: '/about',
        component: About,
        name: 'about',
    },
]
