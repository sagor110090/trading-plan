<template>
  <div
    v-if="showStatus"
    :class="[
      'fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform',
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    ]"
  >
    <div class="flex items-center space-x-2">
      <i :class="['fas', isOnline ? 'fa-wifi' : 'fa-wifi-slash']"></i>
      <span class="text-sm font-medium">
        {{ isOnline ? 'Online' : 'Offline' }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ConnectionStatus',
  setup() {
    const isOnline = ref(navigator.onLine)
    const showStatus = ref(false)
    let statusTimeout = null

    const updateStatus = (online) => {
      isOnline.value = online
      showStatus.value = true
      
      // Hide status after 3 seconds
      if (statusTimeout) {
        clearTimeout(statusTimeout)
      }
      
      statusTimeout = setTimeout(() => {
        showStatus.value = false
      }, 3000)
    }

    const handleOnline = () => updateStatus(true)
    const handleOffline = () => updateStatus(false)

    onMounted(() => {
      // Show initial status briefly
      showStatus.value = true
      setTimeout(() => {
        showStatus.value = false
      }, 2000)

      // Listen for service worker messages
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CONNECTION_STATUS') {
            updateStatus(event.data.online)
          }
        })
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    })

    onUnmounted(() => {
      if (statusTimeout) {
        clearTimeout(statusTimeout)
      }
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    })

    return {
      isOnline,
      showStatus
    }
  }
}
</script>