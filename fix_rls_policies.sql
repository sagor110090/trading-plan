-- Enable RLS on the table
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable select for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable update for anonymous users" ON ai_analyses;
DROP POLICY IF EXISTS "Enable delete for anonymous users" ON ai_analyses;

-- Create comprehensive policies for anonymous users
CREATE POLICY "Enable insert for anonymous users" ON ai_analyses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for anonymous users" ON ai_analyses
    FOR SELECT USING (true);

CREATE POLICY "Enable update for anonymous users" ON ai_analyses
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for anonymous users" ON ai_analyses
    FOR DELETE USING (true);

-- Verify policies are created correctly
SELECT tablename, policyname, permissive, cmd, roles
FROM pg_policies
WHERE tablename = 'ai_analyses';