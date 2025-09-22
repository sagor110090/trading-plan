-- Add user_id column to ai_analyses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_analyses' AND column_name = 'user_id') THEN
        ALTER TABLE ai_analyses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Add index for better performance
        CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON ai_analyses(user_id);
        
        RAISE NOTICE 'user_id column added successfully';
    ELSE
        RAISE NOTICE 'user_id column already exists';
    END IF;
END $$;

-- Update RLS policies to work with user authentication
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable select for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable update for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable delete for anonymous users" ON ai_analyses;

-- Create user-specific policies
CREATE POLICY "Users can insert their own analyses" ON ai_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analyses" ON ai_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON ai_analyses
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON ai_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Verify policies are created correctly
SELECT tablename, policyname, permissive, cmd, roles
FROM pg_policies
WHERE tablename = 'ai_analyses';