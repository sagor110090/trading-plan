<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">API Key Management</h3>
      <button
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- DeepSeek API Key Status -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium text-gray-900 dark:text-white">DeepSeek API Key</span>
        <span
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="hasDeepseekKey ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
        >
          {{ hasDeepseekKey ? 'Configured' : 'Not Configured' }}
        </span>
      </div>

      <div v-if="hasDeepseekKey" class="flex items-center space-x-2">
        <input
          type="password"
          :value="deepseekApiKey"
          readonly
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
        <button
          @click="deleteApiKey"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Remove
        </button>
      </div>

      <div v-else class="space-y-3">
        <input
          v-model="newApiKey"
          type="password"
          placeholder="Enter your DeepSeek API key (sk-...)"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
        <button
          @click="saveApiKey"
          :disabled="!newApiKey || loading"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <i class="fas fa-spinner animate-spin mr-2"></i>
            Saving...
          </span>
          <span v-else>Save API Key</span>
        </button>
      </div>

      <div v-if="error" class="mt-3 p-3 bg-red-100 border border-red-400 dark:bg-red-900/30 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors">
        <p class="text-sm">{{ error }}</p>
      </div>

      <div v-if="success" class="mt-3 p-3 bg-green-100 border border-green-400 dark:bg-green-900/30 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg transition-colors">
        <p class="text-sm">{{ success }}</p>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg transition-colors">
      <h4 class="font-medium text-blue-900 dark:text-blue-300 mb-2">How to get your DeepSeek API key:</h4>
      <ol class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>1. Go to <a href="https://platform.deepseek.com" target="_blank" class="underline text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">platform.deepseek.com</a></li>
        <li>2. Sign up for an account</li>
        <li>3. Go to API Keys section</li>
        <li>4. Create a new API key</li>
        <li>5. Copy the key and paste it above</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { useApiKeyStore } from '@/stores/apiKey'
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'ApiKeyManager',
  setup() {
    const apiKeyStore = useApiKeyStore()
    const newApiKey = ref('')
    const error = ref('')
    const success = ref('')

    const hasDeepseekKey = computed(() => apiKeyStore.hasDeepseekKey)
    const deepseekApiKey = computed(() => apiKeyStore.deepseekApiKey)
    const loading = computed(() => apiKeyStore.loading)

    const saveApiKey = async () => {
      if (!newApiKey.value.trim()) {
        error.value = 'Please enter an API key'
        return
      }

      if (!apiKeyStore.validateApiKey('deepseek', newApiKey.value)) {
        error.value = 'Invalid DeepSeek API key format. Keys should start with "sk-"'
        return
      }

      error.value = ''
      success.value = ''

      const successFlag = await apiKeyStore.saveDeepseekApiKey(newApiKey.value)

      if (successFlag) {
        success.value = 'API key saved successfully!'
        newApiKey.value = ''
      } else {
        error.value = apiKeyStore.error || 'Failed to save API key'
      }
    }

    const deleteApiKey = async () => {
      error.value = ''
      success.value = ''

      const successFlag = await apiKeyStore.deleteDeepseekApiKey()

      if (successFlag) {
        success.value = 'API key removed successfully!'
      } else {
        error.value = apiKeyStore.error || 'Failed to remove API key'
      }
    }

    // Initialize the API key store when component mounts
    onMounted(() => {
      apiKeyStore.init()
    })

    return {
      hasDeepseekKey,
      deepseekApiKey,
      loading,
      newApiKey,
      error,
      success,
      saveApiKey,
      deleteApiKey
    }
  }
}
</script>
