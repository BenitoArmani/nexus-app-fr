-- Comments table (vraie table remplaçant les mocks)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  gif_url TEXT,
  gif_preview_url TEXT,
  gif_source TEXT CHECK (gif_source IN ('tenor', 'upload')),
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- User GIFs collection
CREATE TABLE IF NOT EXISTS user_gifs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  preview_url TEXT,
  title TEXT,
  source TEXT CHECK (source IN ('tenor', 'upload')) DEFAULT 'tenor',
  category TEXT DEFAULT 'Mes GIFs',
  tenor_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, url)
);
ALTER TABLE user_gifs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ugifs_select" ON user_gifs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ugifs_insert" ON user_gifs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ugifs_delete" ON user_gifs FOR DELETE USING (auth.uid() = user_id);

-- Realtime pour commentaires
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
