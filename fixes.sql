-- Likes réels par utilisateur
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_likes_select" ON post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Système de follow réel
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Colonnes manquantes sur posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_explicit BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS bets_disabled BOOLEAN DEFAULT false;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;
