        function cryptoAnalyzer() {
            return {
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
                deepseekApiKey: 'sk-6aa75f6257a943d3abc142c9a8b83af5', // Users should add their own API key

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
                ],

                init() {
                    console.log('Initialized crypto analyzer');

                    // Reset modal state to ensure it's closed on page load
                    this.resetModalState();

                    // Initialize timeframes from selected intervals
                    this.updateTimeframes();

                    // Load cached data if available
                    const cachedData = localStorage.getItem('cryptoData');
                    if (cachedData) {
                        try {
                            const parsed = JSON.parse(cachedData);
                            if (parsed.symbol === this.symbol) {
                                // Restore selected timeframes if available
                                if (parsed.selectedTimeframes) {
                                    this.selectedTimeframes = parsed.selectedTimeframes;
                                }
                                this.timeframes = parsed.data;
                                this.hasData = true;
                                console.log('Loaded cached data for', this.symbol);
                            }
                        } catch (e) {
                            console.warn('Invalid cached data:', e);
                        }
                    }

                    this.updateData();
                    // Auto-update every 30 seconds
                    setInterval(() => this.autoUpdate(), 30000);

                    // Add page unload handler to cleanup modal state
                    window.addEventListener('beforeunload', () => this.cleanupModalState());
                },

                // Update timeframes array based on selected intervals
                updateTimeframes() {
                    this.timeframes = this.selectedTimeframes.map(interval => ({
                        name: interval,
                        price: 0,
                        signal: '',
                        rsi: null,
                        macd: null,
                        ema20: null,
                        volume: 0,
                        status: 'live'
                    }));
                },

                // Select all available timeframes
                selectAllTimeframes() {
                    this.selectedTimeframes = this.availableTimeframes.map(tf => tf.interval);
                },

                // Ask AI for trading decision
                async askAIForDecision() {
                    console.log('askAIForDecision called');
                    console.log('hasData:', this.hasData);
                    console.log('timeframes length:', this.timeframes.length);
                    
                    if (!this.hasData || this.timeframes.length === 0) {
                        this.errorMessage = 'Please update data first before asking for AI analysis';
                        this.showError = true;
                        console.log('No data available for AI analysis');
                        return;
                    }

                    // Prompt for API key if not set
                    if (!this.deepseekApiKey) {
                        const apiKey = prompt('Please enter your DeepSeek API key:');
                        if (!apiKey) {
                            this.errorMessage = 'DeepSeek API key is required for AI analysis';
                            this.showError = true;
                            return;
                        }
                        this.deepseekApiKey = apiKey;
                    }

                    console.log('Opening AI modal...');
                    this.isAILoading = true;
                    this.showAIModal = true;
                    this.aiAnalysis = null;
                    this.aiError = '';

                    try {
                        // Prepare comprehensive data for AI analysis
                        const analysisData = this.prepareAnalysisData();
                        console.log('Analysis data prepared:', analysisData);
                        const aiResponse = await this.callDeepSeekAPI(analysisData);
                        this.aiAnalysis = this.parseAIResponse(aiResponse);
                        console.log('AI analysis completed');
                        
                        // Parse and populate trading signals layout
                        this.$nextTick(() => {
                            this.populateTradingSignals(this.aiAnalysis.strategy, this.timeframes[0]?.price || 0);
                        });
                    } catch (error) {
                        console.error('AI Analysis Error:', error);
                        this.aiError = `Failed to get AI analysis: ${error.message}`;
                    } finally {
                        this.isAILoading = false;
                    }
                },

                // Prepare data for AI analysis
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
                    };

                    // Calculate additional metrics
                    const priceChanges = this.timeframes.map(tf => tf.price);
                    const avgPrice = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
                    const priceVolatility = this.calculateVolatility(priceChanges);

                    const signals = this.timeframes.map(tf => tf.signal.toLowerCase());
                    const bullishSignals = signals.filter(s => s === 'bullish').length;
                    const bearishSignals = signals.filter(s => s === 'bearish').length;

                    data.summary = {
                        avgPrice: avgPrice,
                        volatility: priceVolatility,
                        bullishCount: bullishSignals,
                        bearishCount: bearishSignals,
                        consensus: bullishSignals > bearishSignals ? 'bullish' : bearishSignals > bullishSignals ? 'bearish' : 'neutral',
                        timeframeCount: this.timeframes.length
                    };

                    return data;
                },

                // Calculate price volatility
                calculateVolatility(prices) {
                    if (prices.length < 2) return 0;

                    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
                    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
                    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;

                    return Math.sqrt(variance) / mean * 100; // Percentage volatility
                },

                // Call DeepSeek API
                async callDeepSeekAPI(analysisData) {
                    const prompt = this.createAIPrompt(analysisData);

                    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.deepseekApiKey}`
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
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    return data.choices[0].message.content;
                },

                // Create AI prompt
                createAIPrompt(analysisData) {
                    const { symbol, timeframes, summary } = analysisData;

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

Provide practical, actionable insights that a trader can use immediately.`;
                },

                // Parse AI response
                parseAIResponse(aiResponse) {
                    try {
                        // Try to parse as JSON first
                        return JSON.parse(aiResponse);
                    } catch (e) {
                        // If not JSON, create structured response from text
                        return this.createStructuredResponse(aiResponse);
                    }
                },

                // Create structured response from text
                createStructuredResponse(text) {
                    const lines = text.split('\n').filter(line => line.trim());
                    const sections = {
                        recommendation: '',
                        confidence: '',
                        analysis: '',
                        risks: '',
                        strategy: '',
                        timeframeAnalysis: []
                    };

                    let currentSection = '';

                    for (const line of lines) {
                        const upperLine = line.toUpperCase();

                        if (upperLine.includes('RECOMMENDATION') || upperLine.includes('OVERALL')) {
                            currentSection = 'recommendation';
                        } else if (upperLine.includes('CONFIDENCE')) {
                            currentSection = 'confidence';
                        } else if (upperLine.includes('ANALYSIS') || upperLine.includes('MARKET')) {
                            currentSection = 'analysis';
                        } else if (upperLine.includes('RISK')) {
                            currentSection = 'risks';
                        } else if (upperLine.includes('STRATEGY') || upperLine.includes('SUGGEST')) {
                            currentSection = 'strategy';
                        }

                        if (currentSection && sections[currentSection] !== undefined) {
                            if (sections[currentSection] && !sections[currentSection].endsWith('\n')) {
                                sections[currentSection] += ' ';
                            }
                            sections[currentSection] += line.replace(/^\*\*.*?\*\*\s*/, '');
                        }
                    }

                    // Generate timeframe analysis
                    sections.timeframeAnalysis = this.timeframes.map(tf => ({
                        timeframe: tf.name,
                        signal: tf.signal,
                        summary: this.generateTimeframeSummary(tf)
                    }));

                    return sections;
                },

                // Generate timeframe summary
                generateTimeframeSummary(timeframe) {
                    const { rsi, macd, signal, price } = timeframe;

                    let summary = `Current price: $${price.toFixed(2)}. `;

                    if (rsi !== null) {
                        if (rsi > 70) {
                            summary += 'RSI indicates overbought conditions. ';
                        } else if (rsi < 30) {
                            summary += 'RSI indicates oversold conditions. ';
                        } else {
                            summary += 'RSI is in neutral territory. ';
                        }
                    }

                    if (macd !== null) {
                        if (macd > 0) {
                            summary += 'MACD shows bullish momentum. ';
                        } else {
                            summary += 'MACD shows bearish momentum. ';
                        }
                    }

                    summary += `Signal: ${signal}.`;

                    return summary;
                },

                async updateData() {
                    if (!this.symbol.trim()) return;

                    this.isLoading = true;
                    this.hasData = false;
                    this.showError = false;

                    try {
                        console.log('Fetching data directly from Binance API');
                        await this.fetchAllTimeframes();

                        // Cache successful data
                        localStorage.setItem('cryptoData', JSON.stringify({
                            symbol: this.symbol,
                            selectedTimeframes: this.selectedTimeframes,
                            data: this.timeframes,
                            timestamp: Date.now()
                        }));

                        this.hasData = true;
                    } catch (error) {
                        console.error("Failed to fetch data:", error);
                        this.errorMessage = `Failed to fetch data: ${error.message}`;
                        this.showError = true;
                    } finally {
                        this.isLoading = false;
                    }
                },

                async fetchAllTimeframes() {
                    try {
                        const promises = this.selectedTimeframes.map(interval =>
                            this.fetchKlines(this.symbol, interval)
                        );

                        const results = await Promise.all(promises);

                        // Process results
                        results.forEach((data, index) => {
                            const tf = this.timeframes[index];
                            tf.status = 'updating';

                            if (data && data.length > 0) {
                                // Extract the last candle
                                const lastCandle = data[data.length - 1];
                                tf.price = parseFloat(lastCandle[4]); // Close price
                                tf.volume = parseFloat(lastCandle[5]);

                                // Calculate indicators (simplified for demo)
                                this.calculateIndicators(tf, data);
                                this.determineSignal(tf);
                            }

                            tf.status = 'live';
                        });
                    } catch (error) {
                        console.error('Error in fetchAllTimeframes:', error);
                        throw error;
                    }
                },

                async fetchKlines(symbol, interval) {
                    const baseUrl = 'https://fapi.binance.com/fapi/v1/klines';
                    const params = new URLSearchParams({
                        symbol: symbol.toUpperCase(),
                        interval: interval,
                        limit: 100
                    });

                    const url = `${baseUrl}?${params}`;

                    console.log(`Requesting ${interval} klines for ${symbol}`);
                    console.log('Direct API URL:', url);

                    try {
                        const response = await fetch(url);

                        console.log(`Response status for ${interval} klines:`, response.status, response.statusText);

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error(`HTTP error for ${interval} klines! status: ${response.status}, response:`, errorText);
                            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                        }

                        const data = await response.json();
                        console.log(`Successfully fetched ${interval} klines:`, data.length, 'candles');
                        return data;
                    } catch (error) {
                        console.error(`Error fetching ${interval} klines:`, error);
                        console.error('Error details:', {
                            message: error.message,
                            stack: error.stack,
                            url: url
                        });
                        throw error;
                    }
                },

                calculateIndicators(tf, data) {
                    if (data.length < 20) return;

                    // Calculate RSI
                    const closes = data.slice(-14).map(candle => parseFloat(candle[4]));
                    let gains = 0, losses = 0;

                    for (let i = 1; i < closes.length; i++) {
                        const diff = closes[i] - closes[i-1];
                        if (diff > 0) gains += diff;
                        else losses -= diff;
                    }

                    const avgGain = gains / 13;
                    const avgLoss = losses / 13;
                    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
                    tf.rsi = 100 - (100 / (1 + rs));

                    // Calculate MACD
                    const prices = data.slice(-26).map(candle => parseFloat(candle[4]));
                    const ema12 = this.calculateEMA(prices, 12);
                    const ema26 = this.calculateEMA(prices, 26);
                    tf.macd = ema12 - ema26;

                    // Calculate EMA 20
                    tf.ema20 = this.calculateEMA(data.slice(-20).map(candle => parseFloat(candle[4])), 20);
                },

                calculateEMA(prices, period) {
                    const k = 2 / (period + 1);
                    let ema = prices[0];

                    for (let i = 1; i < prices.length; i++) {
                        ema = prices[i] * k + ema * (1 - k);
                    }

                    return ema;
                },

                determineSignal(tf) {
                    if (tf.rsi === null || tf.macd === null) return;

                    if (tf.rsi > 70 && tf.macd < 0) {
                        tf.signal = 'Bearish';
                    } else if (tf.rsi < 30 && tf.macd > 0) {
                        tf.signal = 'Bullish';
                    } else if (Math.abs(tf.macd) < 0.1 || (tf.rsi > 60 && tf.macd > 0)) {
                        tf.signal = 'Reversal';
                    } else {
                        tf.signal = tf.macd >= 0 ? 'Bullish' : 'Bearish';
                    }
                },

                getSignalIcon(signal) {
                    switch(signal) {
                        case 'Bullish': return 'fa-arrow-trend-up';
                        case 'Bearish': return 'fa-arrow-trend-down';
                        case 'Reversal': return 'fa-exchange-alt';
                        default: return 'fa-chart-line';
                    }
                },

                formatNumber(num) {
                    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                    return num.toString();
                },

                autoUpdate() {
                    if (this.hasData && !this.isLoading) {
                        this.updateData();
                    }
                },

                // Test Binance API connection
                async testBinanceDirect() {
                    console.log('=== Testing Binance API connection ===');

                    try {
                        const baseUrl = 'https://fapi.binance.com/fapi/v1/klines';
                        const params = new URLSearchParams({
                            symbol: 'BTCUSDT',
                            interval: '1m',
                            limit: 5
                        });

                        const testUrl = `${baseUrl}?${params}`;
                        console.log('Test URL:', testUrl);

                        const response = await fetch(testUrl);
                        console.log('Response status:', response.status);

                        if (response.ok) {
                            const data = await response.json();
                            console.log('✅ Binance API connection successful:', data.length, 'candles');
                            alert('✅ Binance API connection successful! Check console for details.');
                        } else {
                            console.log('❌ Binance API failed with status:', response.status);
                            alert('❌ Binance API failed with status: ' + response.status);
                        }
                    } catch (error) {
                        console.log('❌ Binance API failed with error:', error.message);
                        alert('❌ Binance API failed with error: ' + error.message);
                    }

                    console.log('=== Binance API connection test complete ===');
                },

                // Modal state management methods
                resetModalState() {
                    // Ensure modal is closed on page load
                    this.showAIModal = false;
                    this.isAILoading = false;
                    this.aiAnalysis = null;
                    this.aiError = '';

                    // Clear any modal-related localStorage items
                    localStorage.removeItem('aiModalState');
                    localStorage.removeItem('aiAnalysisData');

                    console.log('Modal state reset on page load');
                },

                cleanupModalState() {
                    // Clean up modal state when page is about to unload
                    this.showAIModal = false;
                    this.isAILoading = false;

                    // Remove any modal state from localStorage
                    localStorage.removeItem('aiModalState');
                    localStorage.removeItem('aiAnalysisData');

                    console.log('Modal state cleaned up on page unload');
                },

                // Parse strategy text and populate trading signals layout
                populateTradingSignals(strategyText, currentPrice) {
                    if (!strategyText || !currentPrice) return;

                    try {
                        // Get strategy data from aiAnalysis if available
                        const strategy = this.aiAnalysis?.strategy || {};
                        
                        // Extract signal direction from strategy or recommendation
                        const isSellSignal = strategyText.toLowerCase().includes('sell') || 
                                           strategyText.toLowerCase().includes('short') ||
                                           strategyText.toLowerCase().includes('bearish');
                        const isBuySignal = strategyText.toLowerCase().includes('buy') || 
                                          strategyText.toLowerCase().includes('long') ||
                                          strategyText.toLowerCase().includes('bullish');

                        // Use strategy data from aiAnalysis, fallback to parsing text
                        const entryPrice = strategy.entryPrice || currentPrice;
                        const stopLossPrice = strategy.stopLoss || currentPrice * 0.98;
                        const takeProfitPrice = strategy.takeProfitLevels?.[0]?.price || currentPrice * 1.02;
                        const positionSize = strategy.positionSizing || '10%';
                        const riskReward = strategy.riskRewardRatio || '1:2';
                        const timeHorizon = strategy.timeHorizon || 'Short-term';

                        // Update signal direction display
                        const signalIndicator = document.getElementById('signal-indicator');
                        const signalDirection = document.getElementById('signal-direction');
                        
                        if (signalIndicator && signalDirection) {
                            if (isSellSignal) {
                                signalIndicator.className = 'w-8 h-8 rounded-full bg-red-600 flex items-center justify-center';
                                signalIndicator.innerHTML = '<i class="fas fa-arrow-down text-white text-sm"></i>';
                                signalDirection.textContent = 'SELL SIGNAL';
                                signalDirection.className = 'text-lg font-bold text-red-600';
                            } else if (isBuySignal) {
                                signalIndicator.className = 'w-8 h-8 rounded-full bg-green-600 flex items-center justify-center';
                                signalIndicator.innerHTML = '<i class="fas fa-arrow-up text-white text-sm"></i>';
                                signalDirection.textContent = 'BUY SIGNAL';
                                signalDirection.className = 'text-lg font-bold text-green-600';
                            } else {
                                signalIndicator.className = 'w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center';
                                signalIndicator.innerHTML = '<i class="fas fa-minus text-white text-sm"></i>';
                                signalDirection.textContent = 'HOLD/SIDELINES';
                                signalDirection.className = 'text-lg font-bold text-gray-600';
                            }
                        }

                        // Update DOM elements with trading signals
                        const updateElement = (id, content, prefix = '', suffix = '') => {
                            const element = document.getElementById(id);
                            if (element && content) {
                                element.textContent = prefix + content.trim() + suffix;
                            }
                        };

                        // Current Price
                        updateElement('current-price', currentPrice.toFixed(2), '$');

                        // Entry Price
                        updateElement('entry-price', entryPrice.toFixed(2), '$');
                        
                        // Stop Loss
                        updateElement('stop-loss-price', stopLossPrice.toFixed(2), '$');
                        
                        // Calculate and display risk percentage
                        const riskPercentage = currentPrice > 0 ? Math.abs(((currentPrice - stopLossPrice) / currentPrice * 100)).toFixed(1) : 0;
                        updateElement('stop-loss-risk', `${riskPercentage}% risk`);

                        // Take Profit
                        updateElement('take-profit-price', takeProfitPrice.toFixed(2), '$');
                        
                        // Calculate and display profit percentage
                        const profitPercentage = currentPrice > 0 ? Math.abs(((takeProfitPrice - currentPrice) / currentPrice * 100)).toFixed(1) : 0;
                        updateElement('take-profit-targets', `${profitPercentage}% target`);

                        // Position Sizing
                        updateElement('position-size', positionSize.replace('%', ''), '', '%');

                        // Risk-Reward Ratio
                        updateElement('risk-reward', riskReward);

                        // Time Horizon
                        updateElement('time-horizon', timeHorizon);

                        // Validate strategy consistency with signal direction
                        // entryPrice is already declared above
                        // stopLossPrice and takeProfitPrice are already declared above

                        // Add validation warnings
                        let strategyWarnings = [];
                        if (isSellSignal && stopLossPrice < entryPrice) {
                            strategyWarnings.push('⚠️ Stop loss should be ABOVE entry price for SELL signals');
                        }
                        if (isSellSignal && takeProfitPrice > entryPrice) {
                            strategyWarnings.push('⚠️ Take profit should be BELOW entry price for SELL signals');
                        }
                        if (isBuySignal && stopLossPrice > entryPrice) {
                            strategyWarnings.push('⚠️ Stop loss should be BELOW entry price for BUY signals');
                        }
                        if (isBuySignal && takeProfitPrice < entryPrice) {
                            strategyWarnings.push('⚠️ Take profit should be ABOVE entry price for BUY signals');
                        }

                        // Strategy Details - extract and format the full strategy with warnings
                        const strategyDetails = strategyWarnings.length > 0 
                            ? strategyWarnings.join('\n') + '\n\n' + strategyText
                            : strategyText;
                        updateElement('strategy-details', strategyDetails);

                        console.log('Trading signals populated successfully');
                        if (strategyWarnings.length > 0) {
                            console.warn('Strategy consistency warnings:', strategyWarnings);
                        }
                    } catch (error) {
                        console.error('Error parsing trading signals:', error);
                        // Fallback: show original strategy text
                        const detailsElement = document.getElementById('strategy-details');
                        if (detailsElement) {
                            detailsElement.textContent = strategyText;
                        }
                    }
                }
            }
        }
    </script>
</body>
</html>
