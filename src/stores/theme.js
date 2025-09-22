import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: ref(false),
        theme: ref('light')
    }),

    getters: {
        currentTheme: (state) => state.theme,
        isDarkMode: (state) => state.isDark,
        
        // CSS classes for theme
        themeClass: (state) => state.isDark ? 'dark' : 'light',
        
        // Theme-specific colors
        bgColor: (state) => state.isDark ? 'bg-gray-900' : 'bg-gray-50',
        textColor: (state) => state.isDark ? 'text-gray-100' : 'text-gray-900',
        cardBg: (state) => state.isDark ? 'bg-gray-800' : 'bg-white',
        borderColor: (state) => state.isDark ? 'border-gray-700' : 'border-gray-200'
    },

    actions: {
        init() {
            // Check localStorage for saved preference
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme) {
                this.setTheme(savedTheme)
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                this.setTheme(prefersDark ? 'dark' : 'light')
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light')
                }
            })
        },

        setTheme(theme) {
            this.theme = theme
            this.isDark = theme === 'dark'
            
            // Save to localStorage
            localStorage.setItem('theme', theme)
            
            // Apply theme to document
            this.applyTheme()
        },

        toggleTheme() {
            const newTheme = this.isDark ? 'light' : 'dark'
            this.setTheme(newTheme)
        },

        applyTheme() {
            // Remove existing theme classes
            document.documentElement.classList.remove('light', 'dark')
            
            // Add current theme class
            document.documentElement.classList.add(this.theme)
            
            // Update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector('meta[name="theme-color"]')
            if (metaThemeColor) {
                metaThemeColor.content = this.isDark ? '#111827' : '#f9fafb'
            }
        }
    }
})