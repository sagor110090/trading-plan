import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xcuubslgdlitnnkgbnza.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjdXVic2xnZGxpdG5ua2dibnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MjgyMTEsImV4cCI6MjA3NDEwNDIxMX0.bEh9_6uT8Mj0RZWcBeG17wC59DvLC8RKAmm7MzuAbvg'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        authLoading: false,
        authError: '',
        authEmail: '',
        authPassword: '',
        supabase: null,
        session: null,
        isInitialized: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        userId: (state) => state.user?.id
    },

    actions: {
        async init() {
            this.isInitialized = false
            
            // Initialize Supabase client
            this.supabase = createClient(supabaseUrl, supabaseKey)
            
            // Check for existing session
            const { data: { session }, error } = await this.supabase.auth.getSession()
            
            if (error) {
                console.error('Error getting session:', error)
                this.isInitialized = true
                return
            }
            
            this.session = session
            this.user = session?.user || null
            
            // Set up auth listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.session = session
                this.user = session?.user || null
                
                if (event === 'SIGNED_OUT') {
                    // Clear any stored data on sign out
                    localStorage.removeItem('cryptoData')
                }
            })
            
            this.isInitialized = true
        },

        async handleAuth() {
            if (!this.supabase) {
                this.authError = 'Supabase not initialized. Please check your configuration.'
                return
            }

            this.authLoading = true
            this.authError = ''

            try {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: this.authEmail,
                    password: this.authPassword
                })

                if (error) throw error
                
                this.session = data.session
                this.user = data.user
                this.authEmail = ''
                this.authPassword = ''
            } catch (error) {
                this.authError = error.message
            } finally {
                this.authLoading = false
            }
        },

        async signUp() {
            if (!this.supabase) {
                this.authError = 'Supabase not initialized. Please check your configuration.'
                return
            }

            this.authLoading = true
            this.authError = ''

            try {
                const { data, error } = await this.supabase.auth.signUp({
                    email: this.authEmail,
                    password: this.authPassword
                })

                if (error) throw error
                
                this.authError = 'Account created! Please check your email to verify your account.'
            } catch (error) {
                this.authError = error.message
            } finally {
                this.authLoading = false
            }
        },

        async signOut() {
            if (!this.supabase) return

            await this.supabase.auth.signOut()
            this.user = null
            this.session = null
            localStorage.removeItem('cryptoData')
        },

        // Demo mode for testing without real Supabase
        async useDemoMode() {
            this.authLoading = true
            this.authError = ''

            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                this.user = {
                    id: 'demo-user-' + Date.now(),
                    email: this.authEmail || 'demo@example.com',
                    name: (this.authEmail || 'demo').split('@')[0]
                }
                
                this.session = {
                    access_token: 'demo-token',
                    user: this.user
                }
                
                this.authEmail = ''
                this.authPassword = ''
                this.isInitialized = true
            } catch (error) {
                this.authError = error.message
            } finally {
                this.authLoading = false
            }
        }
    }
})