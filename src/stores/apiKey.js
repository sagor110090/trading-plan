import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useApiKeyStore = defineStore('apiKey', {
    state: () => ({
        apiKeys: {},
        loading: false,
        error: '',
        deepseekApiKey: null
    }),

    getters: {
        hasDeepseekKey: (state) => !!state.deepseekApiKey,
        apiKeyStatus: (state) => {
            return {
                deepseek: state.deepseekApiKey ? 'configured' : 'not_configured'
            }
        }
    },

    actions: {
        async init() {
            const authStore = useAuthStore()
            
            // Load API keys from Supabase if authenticated
            if (authStore.isAuthenticated && authStore.supabase) {
                await this.loadApiKeys()
            } else {
                // Load from localStorage for demo mode
                this.loadLocalKeys()
            }
        },

        async loadApiKeys() {
            const authStore = useAuthStore()
            
            if (!authStore.supabase || !authStore.userId) {
                console.warn('Cannot load API keys: Not authenticated')
                return
            }

            this.loading = true
            this.error = ''

            try {
                const { data, error } = await authStore.supabase
                    .from('user_api_keys')
                    .select('*')
                    .eq('user_id', authStore.userId)

                if (error) throw error

                // Store API keys
                this.apiKeys = {}
                data.forEach(key => {
                    this.apiKeys[key.provider] = key.encrypted_api_key
                })

                // Set DeepSeek key
                this.deepseekApiKey = this.apiKeys['deepseek'] || null

                console.log('API keys loaded successfully')
            } catch (error) {
                console.error('Error loading API keys:', error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        loadLocalKeys() {
            // Load from localStorage for demo mode
            const savedKeys = localStorage.getItem('apiKeys')
            if (savedKeys) {
                try {
                    this.apiKeys = JSON.parse(savedKeys)
                    this.deepseekApiKey = this.apiKeys['deepseek'] || null
                    console.log('Local API keys loaded')
                } catch (e) {
                    console.warn('Invalid saved API keys:', e)
                }
            }
        },

        async saveApiKey(provider, apiKey) {
            const authStore = useAuthStore()
            
            this.loading = true
            this.error = ''

            try {
                if (authStore.isAuthenticated && authStore.supabase) {
                    // Save to Supabase
                    const { data, error } = await authStore.supabase
                        .from('user_api_keys')
                        .upsert({
                            user_id: authStore.userId,
                            provider: provider,
                            encrypted_api_key: apiKey.trim()
                        }, {
                            onConflict: 'user_id,provider'
                        })

                    if (error) throw error
                } else {
                    // Save to localStorage for demo mode
                    this.apiKeys[provider] = apiKey
                    localStorage.setItem('apiKeys', JSON.stringify(this.apiKeys))
                }

                // Refresh keys from database to ensure consistency
                if (authStore.isAuthenticated && authStore.supabase) {
                    await this.loadApiKeys()
                    console.log('Refreshed API keys from database:', this.deepseekApiKey)
                } else {
                    // Update local state for demo mode
                    this.apiKeys[provider] = apiKey
                    
                    if (provider === 'deepseek') {
                        this.deepseekApiKey = apiKey
                    }
                }

                console.log(`${provider} API key saved successfully. Current state:`, this.deepseekApiKey)
                return true
            } catch (error) {
                console.error(`Error saving ${provider} API key:`, error)
                this.error = error.message
                return false
            } finally {
                this.loading = false
            }
        },

        async deleteApiKey(provider) {
            const authStore = useAuthStore()
            
            this.loading = true
            this.error = ''

            try {
                if (authStore.isAuthenticated && authStore.supabase) {
                    // Delete from Supabase
                    const { error } = await authStore.supabase
                        .from('user_api_keys')
                        .delete()
                        .eq('user_id', authStore.userId)
                        .eq('provider', provider)

                    if (error) throw error
                } else {
                    // Delete from localStorage for demo mode
                    delete this.apiKeys[provider]
                    localStorage.setItem('apiKeys', JSON.stringify(this.apiKeys))
                }

                // Update local state
                delete this.apiKeys[provider]
                
                if (provider === 'deepseek') {
                    this.deepseekApiKey = null
                }

                console.log(`${provider} API key deleted successfully`)
                return true
            } catch (error) {
                console.error(`Error deleting ${provider} API key:`, error)
                this.error = error.message
                return false
            } finally {
                this.loading = false
            }
        },

        // Convenience methods
        async saveDeepseekApiKey(apiKey) {
            return await this.saveApiKey('deepseek', apiKey)
        },

        async deleteDeepseekApiKey() {
            return await this.deleteApiKey('deepseek')
        },

        // Validate API key format
        validateApiKey(provider, apiKey) {
            switch (provider) {
                case 'deepseek':
                    return apiKey.startsWith('sk-') && apiKey.length > 20
                case 'openai':
                    return apiKey.startsWith('sk-') && apiKey.length > 20
                default:
                    return apiKey.length > 10
            }
        },

        // Clear all keys (for logout)
        clearKeys() {
            this.apiKeys = {}
            this.deepseekApiKey = null
            localStorage.removeItem('apiKeys')
        }
    }
})