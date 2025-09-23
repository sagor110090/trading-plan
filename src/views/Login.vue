<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
      <!-- Login Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-xl">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2">Crypto Analyzer</h1>
          <p class="text-blue-100">Professional Trading Platform</p>
        </div>
      </div>

      <!-- Login Content -->
      <div class="p-8">
        <!-- Error Message -->
        <div v-if="authError" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>{{ authError }}</span>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleAuth">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              v-model="authEmail"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter your email"
              required
            >
          </div>

          <div class="mb-8">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="authPassword"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter your password"
              required
            >
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg font-semibold"
          >
            <span v-if="authLoading" class="flex items-center justify-center">
              <i class="fas fa-spinner animate-spin mr-2"></i>
              Signing In...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { watch, computed } from 'vue'

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

    // Watch for authentication changes
    watch(isAuthenticated, (isAuth) => {
      if (isAuth) {
        router.push('/')
      }
    })

    const handleAuth = () => {
      authStore.handleAuth()
    }

    return {
      user,
      authLoading,
      authError,
      authEmail,
      authPassword,
      isAuthenticated,
      handleAuth
    }
  }
}
</script>