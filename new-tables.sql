-- =============================================
-- NEXUS — Nouvelles tables (à coller dans Supabase SQL Editor)
-- =============================================

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_check_in DATE,
  total_glyphs_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streak_select" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streak_insert" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streak_update" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- User Levels
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  level INT DEFAULT 1,
  total_glyphs_earned BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "level_select" ON user_levels FOR SELECT USING (true);
CREATE POLICY "level_insert" ON user_levels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "level_update" ON user_levels FOR UPDATE USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notif_insert" ON notifications FOR INSERT WITH CHECK (true);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  glyphs_earned INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  referrals_count INT DEFAULT 0,
  UNIQUE(user_id, week_start)
);
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leaderboard_select" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "leaderboard_insert" ON leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leaderboard_update" ON leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

-- Golden Nugget Events
CREATE TABLE IF NOT EXISTS golden_nugget_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_at TIMESTAMPTZ NOT NULL,
  pot_amount INT DEFAULT 0,
  winner_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'upcoming',
  question TEXT,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE golden_nugget_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gn_select" ON golden_nugget_events FOR SELECT USING (true);

-- Golden Nugget Participations
CREATE TABLE IF NOT EXISTS golden_nugget_participations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES golden_nugget_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount_bet INT NOT NULL,
  answer TEXT,
  won BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE golden_nugget_participations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gnp_select" ON golden_nugget_participations FOR SELECT USING (true);
CREATE POLICY "gnp_insert" ON golden_nugget_participations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Glyph Transactions
CREATE TABLE IF NOT EXISTS glyph_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE glyph_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gt_select" ON glyph_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gt_insert" ON glyph_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Nouvelles colonnes dans users
ALTER TABLE users ADD COLUMN IF NOT EXISTS glyphs_balance INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_glyphs_earned BIGINT DEFAULT 0;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE glyph_transactions;
