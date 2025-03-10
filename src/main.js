import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// Подключаем стили Bulma и Remixicon
import 'bulma/css/bulma.min.css'
import 'remixicon/fonts/remixicon.css'

// Создаем экземпляр Pinia
const pinia = createPinia()

const app = createApp(App)


// Подключаем плагины
app.use(pinia)
app.use(router)

app.mount('#app')
