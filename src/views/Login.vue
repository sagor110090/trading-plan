<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <!-- Login Container -->
    <div class="w-full max-w-md">
      <!-- Logo and Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <i class="fas fa-chart-line text-white text-3xl"></i>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Crypto Analyzer
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">Professional Trading Platform</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Advanced market analysis & AI-powered insights</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Card Header -->
        <div class="px-8 pt-8 pb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-500 dark:text-gray-400">Secure</span>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">Sign in to access your trading dashboard</p>
        </div>

        <!-- Error Message -->
        <div v-if="authError" class="mx-8 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg">
          <div class="flex items-start">
            <i class="fas fa-exclamation-circle mt-0.5 mr-3 text-red-600 dark:text-red-400"></i>
            <div>
              <p class="font-medium text-sm">Authentication Error</p>
              <p class="text-sm mt-1">{{ authError }}</p>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleAuth" class="px-8 pb-8">
          <!-- Email Field -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                type="email"
                v-model="authEmail"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="you@example.com"
                required
                autocomplete="email"
              >
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                type="password"
                v-model="authPassword"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              >
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded">
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <span v-if="authLoading" class="flex items-center justify-center">
              <i class="fas fa-spinner animate-spin mr-2"></i>
              Signing In...
            </span>
            <span v-else class="flex items-center justify-center">
              <i class="fas fa-sign-in-alt mr-2"></i>
              Sign In
            </span>
          </button>

                  </form>

        <!-- Card Footer -->
        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <a href="mailto:mehedihasansagor.cse@gmail.com" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors">
              Contact admin
            </a>
          </p>
        </div>
      </div>

      <!-- Security & Trust Indicators -->
      <div class="mt-8 text-center">
        <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center">
            <i class="fas fa-shield-alt mr-1"></i>
            <span>256-bit SSL</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-lock mr-1"></i>
            <span>Encrypted</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-user-shield mr-1"></i>
            <span>Private</span>
          </div>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-4">
          © 2024 Crypto Analyzer. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { watch, computed, onMounted } from 'vue'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    // Use storeToRefs or computed properties for reactivity
    const user = computed(() => authStore.user)
    const authLoading = computed(() => authStore.authLoading)
    const authError = computed(() => authStore.authError)
    const authEmail = computed({
      get: () => authStore.authEmail,
      set: (value) => authStore.authEmail = value
    })
    const authPassword = computed({
      get: () => authStore.authPassword,
      set: (value) => authStore.authPassword = value
    })
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    // Clear any existing errors on component mount
    onMounted(() => {
      authStore.authError = null
    })

    // Watch for authentication changes
    watch(isAuthenticated, (isAuth) => {
      if (isAuth) {
        router.push('/')
      }
    })

    // Enhanced authentication handler with better error handling
    const handleAuth = async () => {
      try {
        // Clear previous errors
        authStore.authError = null
        
        // Basic client-side validation
        if (!authEmail.value || !authPassword.value) {
          authStore.authError = 'Please fill in all fields'
          return
        }

        if (!authEmail.value.includes('@')) {
          authStore.authError = 'Please enter a valid email address'
          return
        }

        // Call authentication
        await authStore.handleAuth()
      } catch (error) {
        console.error('Authentication error:', error)
        authStore.authError = 'An unexpected error occurred. Please try again.'
      }
    }

    // Handle Enter key press for better UX
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !authLoading.value) {
        handleAuth()
      }
    }

    return {
      user,
      authLoading,
      authError,
      authEmail,
      authPassword,
      isAuthenticated,
      handleAuth,
      handleKeyPress
    }
  }
}
</script>