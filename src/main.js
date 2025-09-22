import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store
const authStore = useAuthStore(pinia)
authStore.init()

// Initialize API key store
import { useApiKeyStore } from '@/stores/apiKey'
const apiKeyStore = useApiKeyStore(pinia)
apiKeyStore.init()

app.mount('#app')