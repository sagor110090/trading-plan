-- Create table for storing AI analysis results
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence TEXT NOT NULL,
    analysis TEXT NOT NULL,
    risks TEXT NOT NULL,
    strategy TEXT NOT NULL,
    timeframe_analysis JSONB,
    timeframes JSONB,
    current_price DECIMAL(20, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- Add indexes for better performance
    CONSTRAINT ai_analyses_symbol_check CHECK (symbol <> '')
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON public.ai_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_symbol ON public.ai_analyses(symbol);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_created_at ON public.ai_analyses(created_at);

-- Enable Row Level Security
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own AI analyses
CREATE POLICY "Users can view own AI analyses" ON public.ai_analyses
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own AI analyses
CREATE POLICY "Users can insert own AI analyses" ON public.ai_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own AI analyses
CREATE POLICY "Users can update own AI analyses" ON public.ai_analyses
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own AI analyses
CREATE POLICY "Users can delete own AI analyses" ON public.ai_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_ai_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp (if you add updated_at column later)
-- CREATE TRIGGER handle_ai_analyses_updated_at
--     BEFORE UPDATE ON public.ai_analyses
--     FOR EACH ROW EXECUTE FUNCTION public.handle_ai_analyses_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.ai_analyses TO authenticated;