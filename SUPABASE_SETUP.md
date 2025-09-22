# Supabase Configuration Guide

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### 2. Update Configuration
Replace the placeholder values in `src/stores/auth.js`:

```javascript
// Line 4-6
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-supabase-anon-key'
```

### 3. Set Up Database
Run the SQL script in `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `supabase-schema.sql`
5. Run the query

### 4. Test the Integration

#### Option A: Real Supabase Authentication
1. Sign up for a new account
2. Verify your email
3. Login with your credentials
4. The app will store your API keys in Supabase

#### Option B: Demo Mode
1. Click "Try Demo Mode" on the login page
2. Enter any email (or leave empty)
3. API keys will be stored in localStorage (for testing only)

### 5. Add Your DeepSeek API Key
1. Go to [https://platform.deepseek.com](https://platform.deepseek.com)
2. Sign up and get your API key
3. In the app, click "AI Analysis"
4. Enter your DeepSeek API key when prompted
5. The key will be saved securely

## Features

### API Key Management
- **Supabase Users**: API keys are encrypted and stored in your database
- **Demo Mode**: API keys are stored in localStorage (not secure, for testing only)
- **Multiple Providers**: Support for DeepSeek, OpenAI, and other AI providers

### Security
- **Row Level Security**: Only you can access your API keys
- **Encryption**: API keys are stored securely
- **Validation**: API key format validation before saving

### Fallback
- If the real AI API fails, the app falls back to mock analysis
- Graceful error handling for network issues
- Clear error messages for troubleshooting

## Troubleshooting

### Common Issues

1. **"Supabase not initialized"**
   - Check your Supabase URL and key in auth.js
   - Make sure your Supabase project is active

2. **"DeepSeek API key not found"**
   - Enter your API key when prompted
   - Make sure the key format is correct (starts with "sk-")

3. **"Failed to save API key"**
   - Check your internet connection
   - Verify your Supabase project is running
   - Try demo mode for testing

### Testing Demo Mode
If you don't want to set up Supabase, use demo mode:
1. Click "Try Demo Mode" on login
2. Your API keys will be stored in localStorage
3. This is for testing only - not secure for real API keys

## Next Steps

Once set up, you can:
- Use real AI analysis with your DeepSeek API key
- Store multiple API keys for different providers
- Access your API keys from any device with your Supabase account
- Extend the system to support more AI providers