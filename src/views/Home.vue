<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <img
              src="/icons/logo.png"
              alt="Crypto Analyzer Logo"
              class="h-8 w-8 mr-3 rounded-lg"
            >
            <h1 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Crypto Analyzer</h1>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              @click="askAIForDecision"
              class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm lg:text-base"
            >
              <i class="fas fa-robot mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">AI Analysis</span>
            </button>
            <button
              @click="showApiModal = true"
              class="bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base"
            >
              <i class="fas fa-key mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">API Keys</span>
            </button>
            <button
              @click="$router.push('/calculator')"
              class="bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base"
            >
              <i class="fas fa-calculator mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">Calculator</span>
            </button>
            <button
              @click="$router.push('/api-history')"
              class="bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base"
            >
              <i class="fas fa-history mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">AI History</span>
            </button>
            <button
              @click="refreshData"
              :disabled="!hasData"
              class="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm lg:text-base"
              title="Refresh data without reloading cards"
            >
              <i class="fas fa-sync mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">Refresh</span>
            </button>
            <button
              @click="updateData"
              :disabled="isLoading"
              class="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm lg:text-base"
              title="Reload all data and cards"
            >
              <i v-if="isLoading" class="fas fa-spinner animate-spin mr-1 lg:mr-2"></i>
              <i v-else class="fas fa-download mr-1 lg:mr-2"></i>
              <span class="hidden lg:inline">Update Data</span>
            </button>
            <button
              @click="themeStore.toggleTheme"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <i :class="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
            <button
              @click="signOut"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              title="Sign Out"
            >
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="px-4 py-3 space-y-2">
          <button
            @click="askAIForDecision(); showMobileMenu = false"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center text-sm"
          >
            <i class="fas fa-robot mr-2"></i>
            AI Analysis
          </button>
          <button
            @click="showApiModal = true; showMobileMenu = false"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm"
          >
            <i class="fas fa-key mr-2"></i>
            API Keys
          </button>
          <button
            @click="$router.push('/calculator'); showMobileMenu = false"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm"
          >
            <i class="fas fa-calculator mr-2"></i>
            Calculator
          </button>
          <button
            @click="$router.push('/api-history'); showMobileMenu = false"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm"
          >
            <i class="fas fa-history mr-2"></i>
            AI History
          </button>
          <button
            @click="refreshData(); showMobileMenu = false"
            :disabled="!hasData"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm"
          >
            <i class="fas fa-sync mr-2"></i>
            Refresh Data
          </button>
          <button
            @click="updateData(); showMobileMenu = false"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm"
          >
            <i v-if="isLoading" class="fas fa-spinner animate-spin mr-2"></i>
            <i v-else class="fas fa-download mr-2"></i>
            Update Data
          </button>
          <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2">
              <button
                @click="themeStore.toggleTheme"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              >
                <i :class="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ themeStore.isDark ? 'Dark' : 'Light' }}
              </span>
            </div>
            <button
              @click="signOut(); showMobileMenu = false"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center"
              title="Sign Out"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              <span class="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Symbol Selection -->
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <input
            v-model="symbol"
            @keyup.enter="updateData"
            type="text"
            placeholder="Enter trading pair (e.g., BTCUSDT)"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
          <button
            @click="updateData"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Analyze
          </button>
        </div>

        <!-- Quick Pairs -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="pair in quickPairs"
            :key="pair"
            @click="symbol = pair; updateData()"
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            {{ pair }}
          </button>
        </div>

        <!-- Popular Cryptos -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="crypto in popularCryptos"
            :key="crypto.symbol"
            class="p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
            :style="{ background: crypto.color }"
            @click="symbol = crypto.symbol + 'USDT'; updateData()"
          >
            <h3 class="text-white font-bold">{{ crypto.symbol }}</h3>
            <p class="text-white/80 text-sm">{{ crypto.name }}</p>
          </div>
        </div>
      </div>

      <!-- Timeframe Selection -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Timeframes</h2>
          <button
            @click="selectAllTimeframes"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <label
            v-for="tf in availableTimeframes"
            :key="tf.interval"
            class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <input
              type="checkbox"
              v-model="selectedTimeframes"
              :value="tf.interval"
              @change="updateTimeframes"
              class="mr-2"
            >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ tf.label }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ tf.description }}</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="showError"
        class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 rounded-lg transition-colors duration-300"
      >
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Timeframe Data Display -->
      <div v-if="hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tf in timeframes"
          :key="tf.name"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ tf.name }}</h3>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': tf.status === 'live',
                'bg-yellow-100 text-yellow-800': tf.status === 'updating'
              }"
            >
              {{ tf.status }}
            </span>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Price:</span>
              <span class="font-medium text-gray-900 dark:text-white">${{ tf.price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Signal:</span>
              <span
                class="font-medium"
                :class="{
                  'text-green-600': tf.signal === 'Bullish',
                  'text-red-600': tf.signal === 'Bearish',
                  'text-yellow-600': tf.signal === 'Reversal'
                }"
              >
                <i v-if="tf.signal === 'Bullish'" class="fas fa-arrow-up"></i>
                <i v-else-if="tf.signal === 'Bearish'" class="fas fa-arrow-down"></i>
                <i v-else-if="tf.signal === 'Reversal'" class="fas fa-exchange-alt"></i>
                <i v-else class="fas fa-chart-line"></i>
                {{ tf.signal }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">RSI:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ tf.rsi?.toFixed(2) || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">MACD:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ tf.macd?.toFixed(4) || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Volume:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(tf.volume) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="text-center py-12"
      >
        <i class="fas fa-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Fetching market data...</p>
      </div>
    </main>

    <!-- AI Analysis Modal -->
    <AIAnalysisModal
      v-model="showAIModal"
      :analysis="aiAnalysis"
      :loading="isAILoading"
      :error="aiError"
      title="AI Trading Analysis"
    />

    <!-- API Key Modal -->
    <div
      v-if="showApiModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <ApiKeyManager @close="showApiModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useCryptoStore } from '@/stores/crypto'
import { useApiKeyStore } from '@/stores/apiKey'
import { useThemeStore } from '@/stores/theme'
import ApiKeyManager from '@/components/ApiKeyManager.vue'
import AIAnalysisModal from '@/components/AIAnalysisModal.vue'
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  components: {
    ApiKeyManager,
    AIAnalysisModal
  },
  setup() {
    const authStore = useAuthStore()
    const cryptoStore = useCryptoStore()
    const themeStore = useThemeStore()
    const router = useRouter()

    // Auth store reactive properties
    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    // Crypto store reactive properties
    const symbol = computed({
      get: () => cryptoStore.symbol,
      set: (value) => cryptoStore.symbol = value
    })
    const timeframes = computed(() => cryptoStore.timeframes)
    const isLoading = computed(() => cryptoStore.isLoading)
    const hasData = computed(() => cryptoStore.hasData)
    const showError = computed(() => cryptoStore.showError)
    const errorMessage = computed(() => cryptoStore.errorMessage)
    const isAILoading = computed(() => cryptoStore.isAILoading)
    const showAIModal = computed({
      get: () => cryptoStore.showAIModal,
      set: (value) => cryptoStore.showAIModal = value
    })
    const aiAnalysis = computed(() => cryptoStore.aiAnalysis)
    const aiError = computed(() => cryptoStore.aiError)
    const availableTimeframes = computed(() => cryptoStore.availableTimeframes)
    const selectedTimeframes = computed({
      get: () => cryptoStore.selectedTimeframes,
      set: (value) => cryptoStore.selectedTimeframes = value
    })
    const popularCryptos = computed(() => cryptoStore.popularCryptos)
    const quickPairs = computed(() => cryptoStore.quickPairs)

    // API Key modal state
    const showApiModal = ref(false)

    // Mobile menu state
    const showMobileMenu = ref(false)

    onMounted(async () => {
      // Wait for auth to be initialized
      if (!authStore.isInitialized) {
        await authStore.init()
      }

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }

      // Initialize crypto store
      cryptoStore.init()
    })

    return {
      // Auth properties
      user,
      isAuthenticated,
      signOut: authStore.signOut,

      // Auth store
      authStore,

      // Theme store
      themeStore,

      // Crypto properties and methods
      symbol,
      timeframes,
      isLoading,
      hasData,
      showError,
      errorMessage,
      isAILoading,
      showAIModal,
      aiAnalysis,
      aiError,
      availableTimeframes,
      selectedTimeframes,
      popularCryptos,
      quickPairs,

      // Crypto methods
      updateData: cryptoStore.updateData,
      refreshData: cryptoStore.refreshData,
      askAIForDecision: cryptoStore.askAIForDecision,
      selectAllTimeframes: cryptoStore.selectAllTimeframes,
      updateTimeframes: cryptoStore.updateTimeframes,
      formatNumber: cryptoStore.formatNumber,
      getTradeDirection: cryptoStore.getTradeDirection,
      getSignalColor: cryptoStore.getSignalColor,
      getSignalIcon: cryptoStore.getSignalIcon,
      calculateRiskPercentage: cryptoStore.calculateRiskPercentage,
      calculateTargetPercentage: cryptoStore.calculateTargetPercentage,

      // API Key modal
      showApiModal,

      // Mobile menu
      showMobileMenu
    }
  }
}
</script>
