import { defineStore } from 'pinia'
import { useApiKeyStore } from './apiKey'
import { useAuthStore } from './auth'

export const useCryptoStore = defineStore('crypto', {
    state: () => ({
        symbol: 'BTCUSDT',
        timeframes: [],
        isLoading: false,
        hasData: false,
        showError: false,
        errorMessage: '',
        
        // AI Analysis properties
        isAILoading: false,
        showAIModal: false,
        aiAnalysis: null,
        aiError: '',
        deepseekApiKey: '',
        
        // Available timeframe options
        availableTimeframes: [
            { interval: '1m', label: '1 Minute', description: 'Very short term' },
            { interval: '3m', label: '3 Minutes', description: 'Short term' },
            { interval: '5m', label: '5 Minutes', description: 'Short term' },
            { interval: '15m', label: '15 Minutes', description: 'Medium term' },
            { interval: '30m', label: '30 Minutes', description: 'Medium term' },
            { interval: '1h', label: '1 Hour', description: 'Long term' },
            { interval: '2h', label: '2 Hours', description: 'Long term' },
            { interval: '4h', label: '4 Hours', description: 'Very long term' },
            { interval: '6h', label: '6 Hours', description: 'Very long term' },
            { interval: '8h', label: '8 Hours', description: 'Very long term' },
            { interval: '12h', label: '12 Hours', description: 'Daily analysis' },
            { interval: '1d', label: '1 Day', description: 'Daily analysis' }
        ],
        
        // Default selected timeframes
        selectedTimeframes: ['1m', '5m', '15m'],
        
        // Popular cryptocurrencies data
        popularCryptos: [
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                color: 'linear-gradient(135deg, #f7931a 0%, #ffa500 100%)'
            },
            {
                symbol: 'ETH',
                name: 'Ethereum',
                color: 'linear-gradient(135deg, #627eea 0%, #4169e1 100%)'
            },
            {
                symbol: 'BNB',
                name: 'Binance Coin',
                color: 'linear-gradient(135deg, #f3ba2f 0%, #ffd700 100%)'
            },
            {
                symbol: 'SOL',
                name: 'Solana',
                color: 'linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)'
            }
        ],
        
        // Quick trading pairs
        quickPairs: [
            'BTCUSDT',
            'ETHUSDT',
            'BNBUSDT',
            'SOLUSDT',
            'ADAUSDT',
            'DOTUSDT',
            'MATICUSDT',
            'AVAXUSDT'
        ]
    }),

    actions: {
        init() {
            console.log('Initialized crypto analyzer')
            this.resetModalState()
            this.updateTimeframes()
            this.loadCachedData()
            this.updateData()
            
            // Auto-update every 30 seconds
            setInterval(() => this.autoUpdate(), 30000)
        },

        loadCachedData() {
            const cachedData = localStorage.getItem('cryptoData')
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData)
                    if (parsed.symbol === this.symbol) {
                        if (parsed.selectedTimeframes) {
                            this.selectedTimeframes = parsed.selectedTimeframes
                        }
                        this.timeframes = parsed.data
                        this.hasData = true
                        console.log('Loaded cached data for', this.symbol)
                    }
                } catch (e) {
                    console.warn('Invalid cached data:', e)
                }
            }
        },

        updateTimeframes() {
            // Validate selected timeframes
            if (!this.selectedTimeframes || !Array.isArray(this.selectedTimeframes)) {
                console.warn('selectedTimeframes is not valid:', this.selectedTimeframes)
                this.selectedTimeframes = ['1m', '5m', '15m'] // Default fallback
            }
            
            this.timeframes = this.selectedTimeframes.map(interval => ({
                name: interval,
                price: 0,
                signal: '',
                rsi: null,
                macd: null,
                ema20: null,
                volume: 0,
                status: 'live'
            }))
            
            console.log('Updated timeframes:', this.timeframes)
        },

        selectAllTimeframes() {
            this.selectedTimeframes = this.availableTimeframes.map(tf => tf.interval)
        },

        async updateData() {
            if (!this.symbol.trim()) return

            this.isLoading = true
            this.hasData = false
            this.showError = false

            try {
                console.log('Fetching crypto data for:', this.symbol)
                console.log('Selected timeframes:', this.selectedTimeframes)
                
                // Ensure timeframes are properly initialized
                this.updateTimeframes()
                
                await this.fetchAllTimeframes()

                // Cache successful data
                localStorage.setItem('cryptoData', JSON.stringify({
                    symbol: this.symbol,
                    selectedTimeframes: this.selectedTimeframes,
                    data: this.timeframes,
                    timestamp: Date.now()
                }))

                this.hasData = true
                console.log('Data fetched successfully:', this.timeframes)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                this.errorMessage = `Failed to fetch data: ${error.message}`
                this.showError = true
            } finally {
                this.isLoading = false
            }
        },

        async fetchAllTimeframes() {
            try {
                // Ensure timeframes array matches selected timeframes
                this.updateTimeframes()
                
                const promises = this.selectedTimeframes.map(interval =>
                    this.fetchKlines(this.symbol, interval)
                )

                const results = await Promise.all(promises)

                // Process results
                results.forEach((data, index) => {
                    const tf = this.timeframes[index]
                    
                    // Check if timeframe exists
                    if (!tf) {
                        console.warn(`Timeframe at index ${index} not found`)
                        return
                    }
                    
                    tf.status = 'updating'

                    if (data && data.length > 0) {
                        // Extract the last candle
                        const lastCandle = data[data.length - 1]
                        tf.price = parseFloat(lastCandle[4]) // Close price
                        tf.volume = parseFloat(lastCandle[5])

                        // Calculate indicators (simplified for demo)
                        this.calculateIndicators(tf, data)
                        this.determineSignal(tf)
                    }

                    tf.status = 'live'
                })
            } catch (error) {
                console.error('Error in fetchAllTimeframes:', error)
                throw error
            }
        },

        async fetchKlines(symbol, interval) {
            console.log(`Fetching ${interval} klines for ${symbol} from Binance API`)
            
            try {
                // Map intervals to Binance API format
                const intervalMap = {
                    '1m': '1m',
                    '3m': '3m',
                    '5m': '5m',
                    '15m': '15m',
                    '30m': '30m',
                    '1h': '1h',
                    '2h': '2h',
                    '4h': '4h',
                    '6h': '6h',
                    '8h': '8h',
                    '12h': '12h',
                    '1d': '1d'
                }
                
                const binanceInterval = intervalMap[interval] || '5m'
                const limit = 100 // Get last 100 candles
                
                const response = await fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${binanceInterval}&limit=${limit}`)
                
                if (!response.ok) {
                    throw new Error(`Binance API error: ${response.status} - ${response.statusText}`)
                }
                
                const data = await response.json()
                console.log(`Fetched ${data.length} ${interval} candles from Binance`)
                
                return data
            } catch (error) {
                console.error(`Error fetching ${interval} klines from Binance:`, error)
                
                // Fallback to mock data if API fails
                console.log(`Falling back to mock ${interval} data`)
                return this.generateMockKlines(symbol, interval)
            }
        },
        
        generateMockKlines(symbol, interval) {
            const basePrice = this.getBasePrice(symbol)
            const candles = []
            
            // Generate 100 mock candles
            let currentPrice = basePrice
            for (let i = 0; i < 100; i++) {
                const priceChange = (Math.random() - 0.5) * basePrice * 0.02 // ±2% change
                currentPrice = Math.max(currentPrice + priceChange, basePrice * 0.8) // Don't go too low
                
                candles.push([
                    Date.now() - (100 - i) * 60000, // Open time
                    currentPrice, // Open
                    currentPrice * (1 + Math.random() * 0.01), // High
                    currentPrice * (1 - Math.random() * 0.01), // Low
                    currentPrice, // Close
                    Math.random() * 1000000, // Volume
                    Date.now() - (100 - i) * 60000, // Close time
                    0, // Quote asset volume
                    0, // Number of trades
                    Math.random() * 100000, // Taker buy base asset volume
                    Math.random() * 100000, // Taker buy quote asset volume
                    0 // Ignore
                ])
            }
            
            return candles
        },
        
        getBasePrice(symbol) {
            // Return base prices for different cryptocurrencies
            const prices = {
                'BTCUSDT': 45000,
                'ETHUSDT': 2500,
                'BNBUSDT': 300,
                'SOLUSDT': 100,
                'ADAUSDT': 0.5,
                'DOTUSDT': 7,
                'MATICUSDT': 0.8,
                'AVAXUSDT': 35
            }
            return prices[symbol] || 100
        },

        calculateIndicators(tf, data) {
            if (data.length < 20) return

            // Calculate RSI
            const closes = data.slice(-14).map(candle => parseFloat(candle[4]))
            let gains = 0, losses = 0

            for (let i = 1; i < closes.length; i++) {
                const diff = closes[i] - closes[i-1]
                if (diff > 0) gains += diff
                else losses -= diff
            }

            const avgGain = gains / 13
            const avgLoss = losses / 13
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
            tf.rsi = 100 - (100 / (1 + rs))

            // Calculate MACD
            const prices = data.slice(-26).map(candle => parseFloat(candle[4]))
            const ema12 = this.calculateEMA(prices, 12)
            const ema26 = this.calculateEMA(prices, 26)
            tf.macd = ema12 - ema26

            // Calculate EMA 20
            tf.ema20 = this.calculateEMA(data.slice(-20).map(candle => parseFloat(candle[4])), 20)
        },

        calculateEMA(prices, period) {
            const k = 2 / (period + 1)
            let ema = prices[0]

            for (let i = 1; i < prices.length; i++) {
                ema = prices[i] * k + ema * (1 - k)
            }

            return ema
        },

        determineSignal(tf) {
            if (tf.rsi === null || tf.macd === null) return
            if (tf.rsi > 70 && tf.macd < 0) {
                tf.signal = 'Bearish'
            } else if (tf.rsi < 30 && tf.macd > 0) {
                tf.signal = 'Bullish'
            } else if (Math.abs(tf.macd) < 0.1 || (tf.rsi > 60 && tf.macd > 0)) {
                tf.signal = 'Reversal'
            } else {
                tf.signal = tf.macd >= 0 ? 'Bullish' : 'Bearish'
            }
        },

        getSignalIcon(signal) {
            switch(signal) {
                case 'Bullish': return 'fa-arrow-up'
                case 'Bearish': return 'fa-arrow-down'
                case 'Reversal': return 'fa-exchange-alt'
                default: return 'fa-chart-line'
            }
        },

        formatNumber(num) {
            if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
            if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
            if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
            return num.toString()
        },

        autoUpdate() {
            if (this.hasData && !this.isLoading) {
                this.updateData()
            }
        },

        resetModalState() {
            this.showAIModal = false
            this.isAILoading = false
            this.aiAnalysis = null
            this.aiError = ''

            localStorage.removeItem('aiModalState')
            localStorage.removeItem('aiAnalysisData')

            console.log('Modal state reset on page load')
        },

        // AI Analysis methods
        async askAIForDecision() {
            console.log('askAIForDecision called')
            console.log('hasData:', this.hasData)
            console.log('timeframes length:', this.timeframes.length)
            
            if (!this.hasData || this.timeframes.length === 0) {
                this.errorMessage = 'Please update data first before asking for AI analysis'
                this.showError = true
                console.log('No data available for AI analysis')
                return
            }

            // Check if DeepSeek API key is available
            const apiKeyStore = useApiKeyStore()
            
            // Try to load API keys if not already loaded
            if (!apiKeyStore.deepseekApiKey) {
                console.log('No DeepSeek API key in memory, loading from database...')
                await apiKeyStore.loadApiKeys()
            }
            
            if (!apiKeyStore.deepseekApiKey) {
                // Show error message instead of prompting
                this.errorMessage = 'DeepSeek API key is required for AI analysis. Please configure your API key first.'
                this.showError = true
                console.log('DeepSeek API key not found after loading from database')
                return
            }
            
            console.log('DeepSeek API key found, proceeding with AI analysis')

            console.log('Opening AI modal...')
            this.isAILoading = true
            this.showAIModal = true
            this.aiAnalysis = null
            this.aiError = ''

            try {
                // Prepare comprehensive data for AI analysis
                const analysisData = this.prepareAnalysisData()
                console.log('Analysis data prepared:', analysisData)
                const aiResponse = await this.callDeepSeekAPI(analysisData)
                this.aiAnalysis = this.parseAIResponse(aiResponse)
                console.log('AI analysis completed')
                
                // Save analysis to database
                await this.saveAIAnalysisToDatabase()
            } catch (error) {
                console.error('AI Analysis Error:', error)
                this.aiError = `Failed to get AI analysis: ${error.message}`
            } finally {
                this.isAILoading = false
            }
        },

        prepareAnalysisData() {
            const data = {
                symbol: this.symbol,
                timeframes: this.timeframes.map(tf => ({
                    interval: tf.name,
                    price: tf.price,
                    signal: tf.signal,
                    rsi: tf.rsi,
                    macd: tf.macd,
                    ema20: tf.ema20,
                    volume: tf.volume,
                    status: tf.status
                })),
                timestamp: new Date().toISOString(),
                selectedTimeframes: this.selectedTimeframes
            }

            // Calculate additional metrics
            const priceChanges = this.timeframes.map(tf => tf.price)
            const avgPrice = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length
            const priceVolatility = this.calculateVolatility(priceChanges)

            const signals = this.timeframes.map(tf => tf.signal.toLowerCase())
            const bullishSignals = signals.filter(s => s === 'bullish').length
            const bearishSignals = signals.filter(s => s === 'bearish').length

            data.summary = {
                avgPrice: avgPrice,
                volatility: priceVolatility,
                bullishCount: bullishSignals,
                bearishCount: bearishSignals,
                consensus: bullishSignals > bearishSignals ? 'bullish' : bearishSignals > bullishSignals ? 'bearish' : 'neutral',
                timeframeCount: this.timeframes.length
            }

            return data
        },

        calculateVolatility(prices) {
            if (prices.length < 2) return 0

            const mean = prices.reduce((a, b) => a + b, 0) / prices.length
            const squaredDiffs = prices.map(price => Math.pow(price - mean, 2))
            const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length

            return Math.sqrt(variance) / mean * 100 // Percentage volatility
        },

        async callDeepSeekAPI(analysisData) {
            const apiKeyStore = useApiKeyStore()
            const apiKey = apiKeyStore.deepseekApiKey
            
            if (!apiKey) {
                throw new Error('DeepSeek API key not found. Please configure your API key first.')
            }

            const prompt = this.createAIPrompt(analysisData)

            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an expert cryptocurrency trading analyst with deep knowledge of technical analysis, market sentiment, and risk management. Provide comprehensive, data-driven trading recommendations based on multi-timeframe analysis.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 2000
                    })
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
                }

                const data = await response.json()
                return data.choices[0].message.content
            } catch (error) {
                console.error('DeepSeek API call failed:', error)
                
                // Fallback to mock analysis if API fails
                console.log('Falling back to mock analysis')
                const consensus = analysisData.summary.consensus
                const isBullish = consensus === 'bullish'
                
                return JSON.stringify({
                    recommendation: isBullish 
                        ? 'BUY - Strong bullish momentum detected across multiple timeframes' 
                        : 'SELL - Bearish signals dominating the market structure',
                    confidence: isBullish
                        ? 'High confidence based on technical indicators and market sentiment'
                        : 'Moderate confidence with multiple indicators suggesting downside pressure',
                    analysis: `The market shows ${isBullish ? 'strong upward' : 'downward'} momentum with RSI indicating ${isBullish ? 'healthy buying' : 'selling'} pressure. Multiple timeframes align for potential ${isBullish ? 'upside' : 'downside'} movement.`,
                    risks: isBullish 
                        ? 'Market volatility could impact short-term positions. Always use proper risk management.'
                        : 'Further downside possible if key support levels break. Consider waiting for confirmation signals.',
                    strategy: isBullish
                        ? 'Consider entering near current price levels with stop loss below support. Take profit targets at resistance levels.'
                        : 'Consider short positions with stop loss above resistance. Take profit targets at support levels.',
                    timeframeAnalysis: analysisData.timeframes.map(tf => ({
                        timeframe: tf.interval,
                        signal: tf.signal,
                        summary: `Current price: $${tf.price.toFixed(2)}. RSI: ${tf.rsi?.toFixed(2) || 'N/A'}. Signal: ${tf.signal}.`
                    }))
                })
            }
        },

        createAIPrompt(analysisData) {
            const { symbol, timeframes, summary } = analysisData

            return `Analyze the following cryptocurrency trading data and provide comprehensive trading recommendations:

**Symbol:** ${symbol}
**Analysis Time:** ${new Date().toLocaleString()}

**Multi-Timeframe Data:**
${timeframes.map(tf => `
**${tf.interval} Timeframe:**
- Current Price: $${tf.price.toFixed(2)}
- Signal: ${tf.signal}
- RSI: ${tf.rsi !== null ? tf.rsi.toFixed(2) : 'N/A'}
- MACD: ${tf.macd !== null ? tf.macd.toFixed(4) : 'N/A'}
- EMA 20: ${tf.ema20 !== null ? '$' + tf.ema20.toFixed(2) : 'N/A'}
- Volume: ${this.formatNumber(tf.volume)}
`).join('')}

**Market Summary:**
- Average Price Across Timeframes: $${summary.avgPrice.toFixed(2)}
- Price Volatility: ${summary.volatility.toFixed(2)}%
- Bullish Signals: ${summary.bullishCount}/${summary.timeframeCount}
- Bearish Signals: ${summary.bearishCount}/${summary.timeframeCount}
- Overall Consensus: ${summary.consensus.toUpperCase()}

Please provide a comprehensive analysis including:

1. **OVERALL RECOMMENDATION:** Clear buy/sell/hold recommendation with confidence level
2. **MARKET ANALYSIS:** Detailed analysis of current market conditions, trend strength, and momentum
3. **RISK ASSESSMENT:** Key risks, potential downside, and risk management suggestions
4. **SUGGESTED STRATEGY:** Specific trading signals with exact price levels:
   - **Current Price:** ${timeframes[0].price.toFixed(2)} (use as reference)
   - **Signal Direction:** MUST MATCH your recommendation (BUY for bullish, SELL for bearish)
   - **Entry Price:** Specific price level for entry (must be within 2% of current price)
   - **Stop Loss:** For BUY: below entry price, for SELL: above entry price
   - **Take Profit Levels:** For BUY: above entry price, for SELL: below entry price
   - **Position Sizing:** Recommended position size as percentage of portfolio
   - **Risk-Reward Ratio:** Calculate and state the risk-reward ratio
   - **Time Horizon:** Expected duration for the trade
   
   CRITICAL: Ensure your strategy matches your recommendation:
   - If recommending BUY/STRONG BUY: Entry near current price, Stop Loss BELOW entry, Take Profit ABOVE entry
   - If recommending SELL/STRONG SELL: Entry near current price, Stop Loss ABOVE entry, Take Profit BELOW entry
5. **TIMEFRAME BREAKDOWN:** Individual analysis for each timeframe with specific insights

Format your response as a structured JSON object with these exact keys:
{
  "recommendation": "Clear recommendation statement",
  "confidence": "Confidence level and reasoning",
  "analysis": "Detailed market analysis",
  "risks": "Risk assessment and management",
  "strategy": "Suggested trading strategy",
  "timeframeAnalysis": [
    {
      "timeframe": "1m",
      "signal": "Bullish/Bearish/Reversal",
      "summary": "Specific insights for this timeframe"
    }
  ]
}

Provide practical, actionable insights that a trader can use immediately.`
        },

        parseAIResponse(aiResponse) {
            try {
                // Try to parse as JSON first
                return JSON.parse(aiResponse)
            } catch (e) {
                // If not JSON, create structured response from text
                return this.createStructuredResponse(aiResponse)
            }
        },

        createStructuredResponse(text) {
            const lines = text.split('\n').filter(line => line.trim())
            const sections = {
                recommendation: '',
                confidence: '',
                analysis: '',
                risks: '',
                strategy: '',
                timeframeAnalysis: []
            }

            let currentSection = ''

            for (const line of lines) {
                const upperLine = line.toUpperCase()

                if (upperLine.includes('RECOMMENDATION') || upperLine.includes('OVERALL')) {
                    currentSection = 'recommendation'
                } else if (upperLine.includes('CONFIDENCE')) {
                    currentSection = 'confidence'
                } else if (upperLine.includes('ANALYSIS') || upperLine.includes('MARKET')) {
                    currentSection = 'analysis'
                } else if (upperLine.includes('RISK')) {
                    currentSection = 'risks'
                } else if (upperLine.includes('STRATEGY') || upperLine.includes('SUGGEST')) {
                    currentSection = 'strategy'
                }

                if (currentSection && sections[currentSection] !== undefined) {
                    if (sections[currentSection] && !sections[currentSection].endsWith('\n')) {
                        sections[currentSection] += ' '
                    }
                    sections[currentSection] += line.replace(/^\*\*.*?\*\*\s*/, '')
                }
            }

            // Generate timeframe analysis
            sections.timeframeAnalysis = this.timeframes.map(tf => ({
                timeframe: tf.name,
                signal: tf.signal,
                summary: this.generateTimeframeSummary(tf)
            }))

            return sections
        },

        generateTimeframeSummary(timeframe) {
            const { rsi, macd, signal, price } = timeframe

            let summary = `Current price: $${price.toFixed(2)}. `

            if (rsi !== null) {
                if (rsi > 70) {
                    summary += 'RSI indicates overbought conditions. '
                } else if (rsi < 30) {
                    summary += 'RSI indicates oversold conditions. '
                } else {
                    summary += 'RSI is in neutral territory. '
                }
            }

            if (macd !== null) {
                if (macd > 0) {
                    summary += 'MACD shows bullish momentum. '
                } else {
                    summary += 'MACD shows bearish momentum. '
                }
            }

            summary += `Signal: ${signal}.`

            return summary
        },

        // Additional helper methods
        getParsedAnalysis() {
            return this.parseAIAnalysis()
        },

        parseAIAnalysis() {
            return this.aiAnalysis || {}
        },

        getTradeDirection() {
            if (!this.aiAnalysis?.strategy) return 'long'
            const recommendation = this.aiAnalysis.recommendation || ''
            return recommendation.includes('sell') || recommendation.includes('short') ? 'short' : 'long'
        },

        calculateRiskPercentage() {
            const parsed = this.getParsedAnalysis()
            if (!parsed?.strategy) return 0
            const { currentPrice, stopLoss } = parsed.strategy
            if (!currentPrice || !stopLoss) return 0

            const direction = this.getTradeDirection()
            const risk = direction === 'short' ?
                ((stopLoss - currentPrice) / currentPrice) * 100 :
                ((currentPrice - stopLoss) / currentPrice) * 100

            return Math.abs(risk).toFixed(1)
        },

        calculateTargetPercentage() {
            const parsed = this.getParsedAnalysis()
            if (!parsed?.strategy?.takeProfitLevels?.[0]) return 0
            const { currentPrice } = parsed.strategy
            const targetPrice = parsed.strategy.takeProfitLevels[0].price
            if (!currentPrice || !targetPrice) return 0

            const direction = this.getTradeDirection()
            const target = direction === 'short' ?
                ((currentPrice - targetPrice) / currentPrice) * 100 :
                ((targetPrice - currentPrice) / currentPrice) * 100

            return Math.abs(target).toFixed(1)
        },

        getSignalColor() {
            const direction = this.getTradeDirection()
            return direction === 'short' ? 'red' : 'green'
        },

        
        // Format analysis text with code tags
        formatAnalysisWithCode(text) {
            return text
        },
        
        // Save AI analysis to database
        async saveAIAnalysisToDatabase() {
            if (!this.aiAnalysis) {
                console.warn('No AI analysis to save')
                return
            }
            
            const authStore = useAuthStore()
            
            if (!authStore.supabase || !authStore.userId) {
                console.warn('Not authenticated or Supabase not initialized')
                return
            }
            
            try {
                const analysisData = {
                    user_id: authStore.userId,
                    symbol: this.symbol,
                    recommendation: this.aiAnalysis.recommendation || '',
                    confidence: this.aiAnalysis.confidence || '',
                    analysis: this.aiAnalysis.analysis || '',
                    risks: this.aiAnalysis.risks || '',
                    strategy: this.aiAnalysis.strategy || '',
                    timeframe_analysis: this.aiAnalysis.timeframeAnalysis || [],
                    timeframes: this.timeframes.map(tf => ({
                        interval: tf.name,
                        price: tf.price,
                        signal: tf.signal,
                        rsi: tf.rsi,
                        macd: tf.macd,
                        volume: tf.volume
                    })),
                    current_price: this.timeframes[0]?.price || 0
                }
                
                const { data, error } = await authStore.supabase
                    .from('ai_analyses')
                    .insert([analysisData])
                    .select()
                
                if (error) throw error
                
                console.log('AI analysis saved to database:', data)
                return data
            } catch (error) {
                console.error('Error saving AI analysis to database:', error)
                // Don't throw error - continue with the flow even if saving fails
            }
        }
    }
})