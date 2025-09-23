<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-3 sm:py-0">
          <div class="flex items-center justify-between w-full sm:w-auto sm:justify-start">
            <div class="flex items-center space-x-3">
              <img
                src="/icons/logo.png"
                alt="Crypto Analyzer Logo"
                class="h-6 w-6 sm:h-8 sm:w-8 rounded-lg flex-shrink-0"
              >
              <div class="min-w-0 flex-1">
                <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Crypto Analyzer
                </h1>
                <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Professional trading analysis</p>
              </div>
            </div>

            <!-- Mobile/Tablet Menu Button -->
            <div class="lg:hidden">
              <button
                @click="showMobileMenu = !showMobileMenu"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <i class="fas fa-bars text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-2 mt-3 sm:mt-0">
            <button
              @click="askAIForDecision"
              class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium shadow-sm"
            >
              <i class="fas fa-robot mr-2"></i>
              AI Analysis
            </button>
            <button
              @click="$router.push('/api-history')"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
            >
              <i class="fas fa-history mr-2"></i>
              AI History
            </button>
            <button
              @click="showApiModal = true"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
            >
              <i class="fas fa-key mr-2"></i>
              API Keys
            </button>
            <button
              @click="$router.push('/calculator')"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
            >
              <i class="fas fa-calculator mr-2"></i>
              Calculator
            </button>
            <button
              @click="refreshData"
              :disabled="!hasData"
              class="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
              title="Refresh data"
            >
              <i v-if="isLoading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-sync mr-2"></i>
              Refresh
            </button>
            <button
              @click="updateData"
              :disabled="isLoading"
              class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
              title="Update data"
            >
              <i v-if="isLoading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-download mr-2"></i>
              Update
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
        </div>
      </div>

      <!-- Mobile/Tablet Menu -->
      <div
        v-if="showMobileMenu"
        class="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="px-4 py-3 space-y-2">
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="askAIForDecision(); showMobileMenu = false"
              class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-robot mr-1"></i>
              AI Analysis
            </button>
            <button
              @click="showApiModal = true; showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-key mr-1"></i>
              API Keys
            </button>
            <button
              @click="$router.push('/calculator'); showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-calculator mr-1"></i>
              Calculator
            </button>
            <button
              @click="$router.push('/api-history'); showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-history mr-1"></i>
              AI History
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2">
            <button
              @click="refreshData(); showMobileMenu = false"
              :disabled="!hasData"
              class="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-sync mr-1"></i>
              Refresh
            </button>
            <button
              @click="updateData(); showMobileMenu = false"
              :disabled="isLoading"
              class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm font-medium"
            >
              <i v-if="isLoading" class="fas fa-spinner animate-spin mr-1"></i>
              <i v-else class="fas fa-download mr-1"></i>
              Update
            </button>
          </div>
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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Symbol Selection -->
      <div class="mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trading Pair Analysis</h2>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <input
              v-model="symbol"
              @keyup.enter="updateData"
              type="text"
              placeholder="Enter trading pair (e.g., BTCUSDT)"
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            >
            <button
              @click="updateData"
              :disabled="isLoading"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-medium"
            >
              <i v-if="isLoading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-chart-line mr-2"></i>
              Analyze
            </button>
          </div>

          <!-- Quick Pairs -->
          <div class="mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular pairs:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="pair in quickPairs"
                :key="pair"
                @click="symbol = pair; updateData()"
                class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
              >
                {{ pair }}
              </button>
            </div>
          </div>

          <!-- Popular Cryptos -->
          <div class="mt-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick select cryptocurrencies:</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="crypto in popularCryptos"
                :key="crypto.symbol"
                class="p-3 rounded-lg cursor-pointer transition-all hover:scale-105 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                :style="{ background: crypto.color }"
                @click="symbol = crypto.symbol + 'USDT'; updateData()"
              >
                <h3 class="text-white font-bold text-sm">{{ crypto.symbol }}</h3>
                <p class="text-white/80 text-xs">{{ crypto.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeframe Selection -->
      <div class="mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Analysis Timeframes</h2>
            <button
              @click="selectAllTimeframes"
              class="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
            >
              <i class="fas fa-check-double mr-1"></i>
              Select All
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <label
              v-for="tf in availableTimeframes"
              :key="tf.interval"
              class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              :class="{'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600': selectedTimeframes.includes(tf.interval)}"
            >
              <input
                type="checkbox"
                v-model="selectedTimeframes"
                :value="tf.interval"
                @change="updateTimeframes"
                class="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              >
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-white text-sm">{{ tf.label }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ tf.description }}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="showError"
        class="mb-6 p-4 bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg transition-all duration-300"
      >
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle mr-3 text-red-600"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Timeframe Data Display -->
      <div v-if="hasData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tf in timeframes"
          :key="tf.name"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ tf.name }}</h3>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': tf.status === 'live',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': tf.status === 'updating'
                }"
              >
                {{ tf.status }}
              </span>
            </div>
          </div>

          <div class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">${{ tf.price.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Signal</p>
                <span
                  class="font-medium text-sm"
                  :class="{
                    'text-green-600 dark:text-green-400': tf.signal === 'Bullish',
                    'text-red-600 dark:text-red-400': tf.signal === 'Bearish',
                    'text-yellow-600 dark:text-yellow-400': tf.signal === 'Reversal'
                  }"
                >
                  <i v-if="tf.signal === 'Bullish'" class="fas fa-arrow-up mr-1"></i>
                  <i v-else-if="tf.signal === 'Bearish'" class="fas fa-arrow-down mr-1"></i>
                  <i v-else-if="tf.signal === 'Reversal'" class="fas fa-exchange-alt mr-1"></i>
                  <i v-else class="fas fa-chart-line mr-1"></i>
                  {{ tf.signal }}
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">RSI</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ tf.rsi?.toFixed(2) || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">MACD</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ tf.macd?.toFixed(4) || 'N/A' }}</p>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">Volume</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatNumber(tf.volume) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading && !hasData"
        class="text-center py-12"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <i class="fas fa-spinner animate-spin text-2xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fetching Market Data</h3>
        <p class="text-gray-500 dark:text-gray-400">Analyzing trading pairs and indicators...</p>
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
