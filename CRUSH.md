# Trading Plan - Development Guide

## Build & Development Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines

### Vue.js Patterns
- Use Composition API with `<script>` setup (not Options API)
- Import stores using `useXStore()` pattern from Pinia
- Use computed properties for reactive store data
- Keep template logic minimal, move complex logic to stores/composables

### Imports & Structure
- Use `@/` alias for src imports (configured in vite.config.js)
- Group imports: Vue core, third-party, local components, stores
- Component imports: PascalCase for component names
- Store imports: camelCase for store functions

### Styling
- Use Tailwind CSS classes exclusively
- Dark mode support: use `dark:` prefix variants
- Responsive design: mobile-first approach with `md:`, `lg:` breakpoints
- Transition animations: use `transition-all duration-300` for smooth UI

### State Management
- Use Pinia stores for all shared state
- Store structure: state, getters, actions
- Async operations: always include loading states and error handling
- Demo mode: include fallback/demo functionality for testing

### Naming Conventions
- Components: PascalCase (e.g., `ApiKeyManager.vue`)
- Store files: camelCase.js (e.g., `authStore.js`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case for custom styles

### Error Handling
- Always include try/catch for async operations
- Display user-friendly error messages
- Include loading states for all async operations
- Log errors to console for debugging