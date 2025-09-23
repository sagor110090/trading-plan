<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-3 sm:py-0">
          <div class="flex items-center justify-between w-full sm:w-auto sm:justify-start">
            <div class="flex items-center space-x-3">
              <button
                @click="$router.back()"
                class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex-shrink-0"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <img 
                src="/icons/logo.png" 
                alt="Crypto Analyzer Logo" 
                class="h-6 w-6 sm:h-8 sm:w-8 rounded-lg flex-shrink-0"
              >
              <div class="min-w-0 flex-1">
                <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Trading Calculator
                </h1>
                <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Professional trade analysis</p>
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
              @click="$router.push('/')"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
            >
              <i class="fas fa-home mr-2"></i>
              Home
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
              @click="$router.push('/'); showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-home mr-1"></i>
              Home
            </button>
            <button
              @click="$router.push('/api-history'); showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-history mr-1"></i>
              AI History
            </button>
            <button
              @click="showApiModal = true; showMobileMenu = false"
              class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
            >
              <i class="fas fa-key mr-1"></i>
              API Keys
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
            <h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-calculator mr-2 text-blue-600"></i>
              Trade Parameters
            </h2>
            
            <!-- Entry Price -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Price (USDT)
              </label>
              <input
                v-model.number="entryPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter entry price"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
            </div>

            <!-- Leverage -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Leverage (x)
              </label>
              <input
                v-model.number="leverage"
                type="number"
                step="1"
                min="1"
                max="125"
                placeholder="Enter leverage"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
              <div class="mt-2">
                <input
                  v-model="leverage"
                  type="range"
                  min="1"
                  max="125"
                  class="w-full"
                >
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1x</span>
                  <span>{{ leverage }}x</span>
                  <span>125x</span>
                </div>
              </div>
            </div>

            <!-- Position Size -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position Size (USDT)
              </label>
              <input
                v-model.number="positionSize"
                type="number"
                step="1"
                min="1"
                placeholder="Enter position size"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
            </div>

            <!-- Stop Loss -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stop Loss (USDT)
              </label>
              <input
                v-model.number="stopLoss"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter stop loss price"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
            </div>

            <!-- Take Profit -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Take Profit (USDT)
              </label>
              <input
                v-model.number="takeProfit"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter take profit price"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
            </div>

            <!-- Trade Direction -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trade Direction
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  @click="direction = 'long'"
                  :class="[
                    'px-4 py-2 rounded-lg transition-all',
                    direction === 'long'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  ]"
                >
                  <i class="fas fa-arrow-up mr-2"></i>
                  Long
                </button>
                <button
                  @click="direction = 'short'"
                  :class="[
                    'px-4 py-2 rounded-lg transition-all',
                    direction === 'short'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  ]"
                >
                  <i class="fas fa-arrow-down mr-2"></i>
                  Short
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Liquidation Price</h3>
                <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
                </div>
              </div>
              <p class="text-2xl font-bold" :class="liquidationPriceColor">
                {{ formatCurrency(liquidationPrice) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Distance from entry: {{ formatPercentage(liquidationDistance) }}
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Initial Margin</h3>
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <i class="fas fa-wallet text-blue-600 dark:text-blue-400"></i>
                </div>
              </div>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ formatCurrency(initialMargin) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ leverage }}x leverage
              </p>
            </div>
          </div>

          <!-- P&L Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
            <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-chart-line mr-2 text-green-600"></i>
              Profit & Loss Analysis
            </h3>
            
            <!-- Take Profit P&L -->
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors duration-300">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-green-800 dark:text-green-400">Take Profit</h4>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ takeProfit ? formatPercentage(takeProfitPercentage) : 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-700 dark:text-green-300">Profit:</span>
                <span class="text-xl font-bold text-green-600 dark:text-green-400">
                  {{ formatCurrency(takeProfitPNL) }}
                </span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-green-700 dark:text-green-300">ROI:</span>
                <span class="text-lg font-semibold text-green-600 dark:text-green-400">
                  {{ takeProfitROIPercentage }}
                </span>
              </div>
            </div>

            <!-- Stop Loss P&L -->
            <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-300">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-red-800 dark:text-red-400">Stop Loss</h4>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ stopLoss ? formatPercentage(stopLossPercentage) : 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-red-700 dark:text-red-300">Loss:</span>
                <span class="text-xl font-bold text-red-600 dark:text-red-400">
                  {{ formatCurrency(stopLossPNL) }}
                </span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-red-700 dark:text-red-300">ROI:</span>
                <span class="text-lg font-semibold text-red-600 dark:text-red-400">
                  {{ stopLossROIPercentage }}
                </span>
              </div>
            </div>

            <!-- Risk/Reward Ratio -->
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-300">
              <div class="flex justify-between items-center">
                <h4 class="font-semibold text-blue-800 dark:text-blue-400">Risk/Reward Ratio</h4>
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ riskRewardRatio }}
                </span>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Reward per unit of risk
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <i class="fas fa-info-circle mr-2 text-blue-600"></i>
              Position Details
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Position Size:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(positionSize) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Notional Value:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(notionalValue) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Maintenance Margin:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(maintenanceMargin) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Available Balance:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(availableBalance) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

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
import { useThemeStore } from '@/stores/theme'
import ApiKeyManager from '@/components/ApiKeyManager.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Calculator',
  components: {
    ApiKeyManager
  },
  setup() {
    const authStore = useAuthStore()
    const themeStore = useThemeStore()
    const router = useRouter()

    // Form inputs
    const entryPrice = ref(50000)
    const leverage = ref(10)
    const positionSize = ref(1000)
    const stopLoss = ref(48000)
    const takeProfit = ref(52000)
    const direction = ref('long')
    
    // Mobile menu state
    const showMobileMenu = ref(false)
    
    // API Key modal state
    const showApiModal = ref(false)

    // Auth initialization
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
    })

    // Calculations
    const initialMargin = computed(() => positionSize.value / leverage.value)
    const notionalValue = computed(() => positionSize.value * leverage.value)
    const maintenanceMargin = computed(() => notionalValue.value * 0.004) // 0.4% maintenance margin
    const availableBalance = computed(() => positionSize.value)

    // Liquidation price calculation
    const liquidationPrice = computed(() => {
      if (!entryPrice.value || !leverage.value) return 0
      
      if (direction.value === 'long') {
        return entryPrice.value * (1 - (1 - 0.004) / leverage.value)
      } else {
        return entryPrice.value * (1 + (1 - 0.004) / leverage.value)
      }
    })

    const liquidationDistance = computed(() => {
      if (!entryPrice.value || !liquidationPrice.value) return 0
      return Math.abs((liquidationPrice.value - entryPrice.value) / entryPrice.value * 100)
    })

    const liquidationPriceColor = computed(() => {
      if (liquidationDistance.value < 5) return 'text-red-600 dark:text-red-400'
      if (liquidationDistance.value < 10) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-green-600 dark:text-green-400'
    })

    // P&L calculations
    const takeProfitPercentage = computed(() => {
      if (!entryPrice.value || !takeProfit.value) return 0
      const percentage = ((takeProfit.value - entryPrice.value) / entryPrice.value) * 100
      return direction.value === 'long' ? percentage : -percentage
    })

    const stopLossPercentage = computed(() => {
      if (!entryPrice.value || !stopLoss.value) return 0
      const percentage = ((stopLoss.value - entryPrice.value) / entryPrice.value) * 100
      return direction.value === 'long' ? percentage : -percentage
    })

    const takeProfitPNL = computed(() => {
      return (takeProfitPercentage.value / 100) * notionalValue.value
    })

    const stopLossPNL = computed(() => {
      return (stopLossPercentage.value / 100) * notionalValue.value
    })

    const takeProfitROIPercentage = computed(() => {
      if (!initialMargin.value) return '0%'
      return `${((takeProfitPNL.value / initialMargin.value) * 100).toFixed(2)}%`
    })

    const stopLossROIPercentage = computed(() => {
      if (!initialMargin.value) return '0%'
      return `${((stopLossPNL.value / initialMargin.value) * 100).toFixed(2)}%`
    })

    const riskRewardRatio = computed(() => {
      const risk = Math.abs(stopLossPNL.value)
      const reward = Math.abs(takeProfitPNL.value)
      
      if (risk === 0) return '∞'
      return `${(reward / risk).toFixed(2)}:1`
    })

    // Utility functions
    const formatCurrency = (value) => {
      if (!value || isNaN(value)) return '$0.00'
      return `$${value.toFixed(2)}`
    }

    const formatPercentage = (value) => {
      if (!value || isNaN(value)) return '0%'
      return `${value.toFixed(2)}%`
    }

    const signOut = () => {
      authStore.signOut()
      router.push('/login')
    }

    return {
      // Form inputs
      entryPrice,
      leverage,
      positionSize,
      stopLoss,
      takeProfit,
      direction,
      
      // Mobile menu
      showMobileMenu,
      
      // API Key modal
      showApiModal,
      
      // Calculations
      initialMargin,
      notionalValue,
      maintenanceMargin,
      availableBalance,
      liquidationPrice,
      liquidationDistance,
      liquidationPriceColor,
      takeProfitPercentage,
      stopLossPercentage,
      takeProfitPNL,
      stopLossPNL,
      takeProfitROIPercentage,
      stopLossROIPercentage,
      riskRewardRatio,
      
      // Utilities
      formatCurrency,
      formatPercentage,
      
      // Stores
      themeStore,
      signOut
    }
  }
}
</script>