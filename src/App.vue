<template>
  <div class="font-sans">
    <!-- Loading state while auth is initializing -->
    <div
      v-if="!authStore.isInitialized"
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300"
    >
      <div class="text-center">
        <div class="mb-4">
          <i class="fas fa-spinner animate-spin text-4xl text-blue-600"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Loading application...</p>
      </div>
    </div>
    
    <!-- Main App Content -->
    <router-view v-else />
    
    <!-- Connection Status Component -->
    <ConnectionStatus />
    
    <!-- PWA Install Prompt (if needed) -->
    <div
      v-if="showInstallPrompt"
      class="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">Install App</h3>
        <button
          @click="showInstallPrompt = false"
          class="text-white hover:text-gray-200"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <p class="text-sm mb-3">Install Crypto Analyzer on your device for quick access</p>
      <div class="flex space-x-2">
        <button
          @click="installPWA"
          class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Install
        </button>
        <button
          @click="showInstallPrompt = false"
          class="bg-transparent border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-blue-600"
        >
          Later
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'

export default {
  name: 'App',
  components: {
    ConnectionStatus
  },
  setup() {
    const authStore = useAuthStore()
    const showInstallPrompt = ref(false)
    let deferredPrompt = null

    const installPWA = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        deferredPrompt = null
        showInstallPrompt.value = false
      }
    }

    onMounted(() => {
      // Ensure auth store is initialized
      if (!authStore.isInitialized) {
        authStore.init()
      }

      // PWA Install Prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        // Show prompt after 2 seconds
        setTimeout(() => {
          showInstallPrompt.value = true
        }, 2000)
      })

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed')
        showInstallPrompt.value = false
        deferredPrompt = null
      })

      // Handle service worker updates
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker controller changed')
          // You could show a "New version available" prompt here
        })
      }
    })

    return {
      authStore,
      showInstallPrompt,
      installPWA
    }
  }
}
</script>