<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.back()"
              class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <img 
              src="/icons/logo.png" 
              alt="Crypto Analyzer Logo" 
              class="h-8 w-8 mr-3 rounded-lg"
            >
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Analysis History
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Your trading analysis records</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ analyses.length }} {{ analyses.length === 1 ? 'analysis' : 'analyses' }}
            </div>
            <button
              @click="themeStore.toggleTheme"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <i :class="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
            <button
              @click="loadAnalyses"
              :disabled="loading"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-sync mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div v-if="analyses.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Analyses</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analyses.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <i class="fas fa-brain text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Symbols Tracked</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ uniqueSymbols }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <i class="fas fa-chart-line text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Latest Analysis</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ latestAnalysisDate }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <i class="fas fa-clock text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Avg Confidence</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ avgConfidence }}</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <i class="fas fa-percentage text-orange-600 dark:text-orange-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle mr-3 text-red-600"></i>
          <span class="text-red-800">{{ error }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-3 text-green-600"></i>
          <span class="text-green-800">{{ success }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && analyses.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <i class="fas fa-spinner animate-spin text-2xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading AI Analyses</h3>
        <p class="text-gray-500 dark:text-gray-400">Fetching your trading analysis history...</p>
      </div>

      <!-- Auth Initializing State -->
      <div v-if="!authInitialized && !loading && !error" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
          <i class="fas fa-shield-alt text-2xl text-purple-600 dark:text-purple-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Initializing Authentication</h3>
        <p class="text-gray-500 dark:text-gray-400">Setting up secure connection...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && analyses.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <i class="fas fa-brain text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No AI Analyses Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Start by performing your first AI analysis on the home page.</p>
        <button
          @click="$router.push('/')"
          class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <i class="fas fa-plus mr-2"></i>
          Create First Analysis
        </button>
      </div>

      <!-- AI Analyses Grid -->
      <div v-if="analyses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="analysis in analyses"
          :key="analysis.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <span class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {{ analysis.symbol }}
                  </span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ getShortRecommendation(analysis.recommendation) }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(analysis.created_at) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  {{ getConfidenceLevel(analysis.confidence) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Card Content -->
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">${{ analysis.current_price?.toFixed(2) || 'N/A' }}</p>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Strategy</p>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getStrategyType(analysis.strategy) }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div>
                <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Market Analysis</h4>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">{{ analysis.analysis }}</p>
              </div>
              
              <div>
                <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Risk Assessment</h4>
                <p class="text-sm text-red-600 dark:text-red-400 leading-relaxed line-clamp-2">{{ analysis.risks }}</p>
              </div>
            </div>
          </div>
          
          <!-- Card Footer -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fas fa-chart-line text-gray-400 dark:text-gray-500 text-xs"></i>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ analysis.timeframes?.length || 0 }} timeframes analyzed</span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewAnalysis(analysis)"
                  class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="View Full Analysis"
                >
                  <i class="fas fa-eye text-sm"></i>
                </button>
                <button
                  @click="confirmDelete(analysis)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete Analysis"
                >
                  <i class="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 transition-colors duration-300">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Delete AI Analysis</h3>
              <button
                @click="showDeleteModal = false"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this AI analysis for {{ analysisToDelete?.symbol }}? This action cannot be undone.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="deleteAnalysis"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Analysis Detail Modal -->
      <AIAnalysisModal
        v-model="showDetailModal"
        :analysis="selectedAnalysis"
        :subtitle="selectedAnalysis ? `${selectedAnalysis.symbol} - ${formatDate(selectedAnalysis.created_at)}` : ''"
        title="AI Analysis Details"
      />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AIAnalysisModal from '@/components/AIAnalysisModal.vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

export default {
  name: 'ApiHistory',
  components: {
    AIAnalysisModal
  },
  setup() {
    const authStore = useAuthStore()
    const themeStore = useThemeStore()
    const analyses = ref([])
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const showDeleteModal = ref(false)
    const analysisToDelete = ref(null)
    const showDetailModal = ref(false)
    const selectedAnalysis = ref(null)
    const authInitialized = ref(false)

    // Computed properties for stats
    const uniqueSymbols = computed(() => {
      const symbols = [...new Set(analyses.value.map(a => a.symbol))]
      return symbols.length
    })

    const latestAnalysisDate = computed(() => {
      if (analyses.value.length === 0) return 'N/A'
      const latest = analyses.value[0]
      return formatDate(latest.created_at)
    })

    const avgConfidence = computed(() => {
      if (analyses.value.length === 0) return 'N/A'
      
      const confidenceMap = {
        'Very High': 95,
        'High': 80,
        'Medium': 65,
        'Low': 50
      }
      
      const total = analyses.value.reduce((sum, analysis) => {
        return sum + (confidenceMap[analysis.confidence] || 65)
      }, 0)
      
      const avg = total / analyses.value.length
      
      if (avg >= 85) return 'Very High'
      if (avg >= 70) return 'High'
      if (avg >= 55) return 'Medium'
      return 'Low'
    })

    const loadAnalyses = async () => {
      // Wait for auth store to initialize
      if (!authStore.supabase) {
        error.value = 'Authentication service not ready. Please wait...'
        // Retry after a short delay
        setTimeout(() => {
          if (authStore.supabase) {
            loadAnalyses()
          }
        }, 1000)
        return
      }

      // Check if user is authenticated
      if (!authStore.userId) {
        error.value = 'Not authenticated. Please log in first.'
        return
      }

      loading.value = true
      error.value = ''
      success.value = ''

      try {
        const { data, error: supabaseError } = await authStore.supabase
          .from('ai_analyses')
          .select('*')
          .eq('user_id', authStore.userId)
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        analyses.value = data || []
        console.log('Loaded AI analyses:', analyses.value.length)
      } catch (err) {
        console.error('Error loading AI analyses:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (analysis) => {
      analysisToDelete.value = analysis
      showDeleteModal.value = true
    }

    const deleteAnalysis = async () => {
      if (!analysisToDelete.value || !authStore.supabase || !authStore.userId) return

      try {
        const { error: deleteError } = await authStore.supabase
          .from('ai_analyses')
          .delete()
          .eq('id', analysisToDelete.value.id)
          .eq('user_id', authStore.userId)

        if (deleteError) throw deleteError

        // Remove from local array
        analyses.value = analyses.value.filter(analysis => analysis.id !== analysisToDelete.value.id)
        
        success.value = 'AI analysis deleted successfully'
        showDeleteModal.value = false
        analysisToDelete.value = null
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          success.value = ''
        }, 3000)
      } catch (err) {
        console.error('Error deleting AI analysis:', err)
        error.value = err.message
      }
    }

    const viewAnalysis = (analysis) => {
      selectedAnalysis.value = analysis
      showDetailModal.value = true
    }

    const getShortRecommendation = (recommendation) => {
      if (!recommendation) return 'Unknown'
      if (recommendation.toLowerCase().includes('buy')) return 'BUY'
      if (recommendation.toLowerCase().includes('sell')) return 'SELL'
      if (recommendation.toLowerCase().includes('hold')) return 'HOLD'
      if (recommendation.toLowerCase().includes('wait')) return 'WAIT'
      if (recommendation.length > 30) return recommendation.substring(0, 30) + '...'
      return recommendation
    }

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

    // Watch for auth store initialization
    const checkAuthAndLoad = () => {
      if (authStore.supabase && authStore.userId) {
        loadAnalyses()
        authInitialized.value = true
      } else if (authStore.supabase && !authStore.userId) {
        authInitialized.value = true
        error.value = 'Not authenticated. Please log in first.'
      }
    }

    onMounted(async () => {
      // Wait for auth to be initialized
      if (!authStore.isInitialized) {
        await authStore.init()
      }
      
      // Initial check
      checkAuthAndLoad()
      
      // Set up a watcher for auth state changes
      const unwatch = watch(() => authStore.userId, (newUserId) => {
        if (newUserId && authInitialized.value) {
          loadAnalyses()
        }
      })
      
      // Clean up watcher on unmount
      onUnmounted(() => {
        unwatch()
      })
    })

    return {
      analyses,
      loading,
      error,
      success,
      showDeleteModal,
      analysisToDelete,
      showDetailModal,
      selectedAnalysis,
      authInitialized,
      themeStore,
      uniqueSymbols,
      latestAnalysisDate,
      avgConfidence,
      loadAnalyses,
      confirmDelete,
      deleteAnalysis,
      viewAnalysis,
      getShortRecommendation,
      getConfidenceLevel,
      getStrategyType,
      formatDate
    }
  }
}
</script>