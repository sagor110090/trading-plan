<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('update:modelValue', false)"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors duration-300" @click.stop>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
            <p v-if="subtitle" class="text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
          </div>
          <button
            @click="$emit('update:modelValue', false)"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <i class="fas fa-robot animate-pulse-slow text-4xl text-purple-600 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">{{ loadingText }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
        </div>

        <!-- Analysis Content -->
        <div v-else-if="analysis" class="space-y-6">
          <!-- Recommendation Header -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg transition-colors duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Recommendation</h3>
              <span v-if="analysis.confidence" class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                {{ getConfidenceLevel(analysis.confidence) }}
              </span>
            </div>
            <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ analysis.recommendation }}</p>
            <div v-if="analysis.symbol" class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span><i class="fas fa-chart-line mr-1"></i> {{ analysis.symbol }}</span>
              <span v-if="analysis.current_price"><i class="fas fa-dollar-sign mr-1"></i> ${{ analysis.current_price.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Strategy Section -->
          <div v-if="analysis.strategy" class="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <i class="fas fa-chess-knight mr-2 text-blue-600 dark:text-blue-400"></i>
              Trading Strategy
            </h3>
            <div v-if="useSignalDisplay" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Signal</h4>
                <div class="flex items-center space-x-2">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getSignalColor() === 'green' ? 'bg-green-600' : 'bg-red-600'"
                  >
                    <i :class="['fas', getSignalIcon(), 'text-white text-sm']"></i>
                  </div>
                  <span
                    :class="['font-bold', getSignalColor() === 'green' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']"
                  >
                    {{ getSignalColor() === 'green' ? 'BUY SIGNAL' : 'SELL SIGNAL' }}
                  </span>
                </div>
              </div>
              <div v-if="analysis.current_price">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Current Price</h4>
                <p class="font-medium text-gray-900 dark:text-white">${{ analysis.current_price.toFixed(2) }}</p>
              </div>
              <div v-if="showRiskTarget">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Risk</h4>
                <p class="font-medium text-gray-900 dark:text-white">{{ calculateRiskPercentage() }}%</p>
              </div>
              <div v-if="showRiskTarget">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Target</h4>
                <p class="font-medium text-gray-900 dark:text-white">{{ calculateTargetPercentage() }}%</p>
              </div>
            </div>
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ analysis.strategy }}</p>
            </div>
          </div>

          <!-- Market Analysis -->
          <div class="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <i class="fas fa-chart-area mr-2 text-green-600 dark:text-green-400"></i>
              Market Analysis
            </h3>
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ analysis.analysis }}</p>
            </div>
          </div>

          <!-- Timeframe Analysis -->
          <div v-if="analysis.timeframe_analysis && analysis.timeframe_analysis.length > 0" class="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <i class="fas fa-clock mr-2 text-purple-600 dark:text-purple-400"></i>
              Timeframe Analysis
            </h3>
            <div class="space-y-4">
              <div
                v-for="tf in analysis.timeframe_analysis"
                :key="tf.timeframe"
                class="border-l-4 border-blue-500 dark:border-blue-400 pl-4"
              >
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ tf.timeframe }}</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ tf.summary }}</p>
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div v-if="analysis.risks" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold mb-4 text-red-800 dark:text-red-400 flex items-center">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              Risk Assessment
            </h3>
            <div class="prose prose-sm max-w-none">
              <p class="text-red-700 dark:text-red-300 whitespace-pre-line">{{ analysis.risks }}</p>
            </div>
          </div>

          <!-- Technical Details -->
          <div v-if="showTechnicalDetails" class="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-6 transition-colors duration-300">
            <h3 class="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <i class="fas fa-cog mr-2 text-gray-600 dark:text-gray-400"></i>
              Technical Details
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="analysis.created_at">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Analysis Time</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(analysis.created_at) }}</p>
              </div>
              <div v-if="analysis.confidence">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Confidence Level</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ getConfidenceLevel(analysis.confidence) }}</p>
              </div>
              <div v-if="analysis.strategy">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Strategy Type</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ getStrategyType(analysis.strategy) }}</p>
              </div>
              <div v-if="analysis.timeframes">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Timeframes Analyzed</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ analysis.timeframes.length }} timeframes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AIAnalysisModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    analysis: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'AI Analysis Details'
    },
    subtitle: {
      type: String,
      default: ''
    },
    loadingText: {
      type: String,
      default: 'Analyzing market data...'
    },
    useSignalDisplay: {
      type: Boolean,
      default: false
    },
    showRiskTarget: {
      type: Boolean,
      default: false
    },
    showTechnicalDetails: {
      type: Boolean,
      default: true
    },
    // Optional function props for complex logic
    getSignalColor: {
      type: Function,
      default: () => 'green'
    },
    getSignalIcon: {
      type: Function,
      default: () => 'fa-arrow-up'
    },
    calculateRiskPercentage: {
      type: Function,
      default: () => '2.5'
    },
    calculateTargetPercentage: {
      type: Function,
      default: () => '5.0'
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const getConfidenceLevel = (confidence) => {
      return confidence || 'Medium'
    }

    const getStrategyType = (strategy) => {
      if (!strategy) return 'Unknown'
      if (strategy.toLowerCase().includes('momentum')) return 'Momentum'
      if (strategy.toLowerCase().includes('trend')) return 'Trend Following'
      if (strategy.toLowerCase().includes('mean')) return 'Mean Reversion'
      if (strategy.toLowerCase().includes('breakout')) return 'Breakout'
      if (strategy.toLowerCase().includes('support')) return 'Support/Resistance'
      if (strategy.toLowerCase().includes('rsi')) return 'RSI Strategy'
      if (strategy.toLowerCase().includes('macd')) return 'MACD Strategy'
      if (strategy.length > 20) return strategy.substring(0, 20) + '...'
      return strategy
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      getConfidenceLevel,
      getStrategyType,
      formatDate
    }
  }
}
</script>