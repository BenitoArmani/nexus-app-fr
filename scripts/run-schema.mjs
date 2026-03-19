const TOKEN = 'sbp_f2df18abef632baf00c480345491282f73559d53'
const PROJECT = 'dnbqtrisnhqbljnblpcl'
const URL = `https://api.supabase.com/v1/projects/${PROJECT}/database/query`

async function sql(query) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const data = await res.json()
  if (data.message) {
    console.error(`❌ ERREUR: ${data.message.slice(0, 120)}`)
    return false
  }
  return true
}

const steps = [
  {
    name: 'Table users',
    query: `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL DEFAULT '',
        avatar_url TEXT,
        bio TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_creator BOOLEAN DEFAULT FALSE,
        monthly_goal NUMERIC(10,2) DEFAULT 500,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table posts',
    query: `
      CREATE TABLE IF NOT EXISTS public.posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        media_url TEXT,
        media_type TEXT CHECK (media_type IN ('image', 'video')),
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table reels',
    query: `
      CREATE TABLE IF NOT EXISTS public.reels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        caption TEXT DEFAULT '',
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        earnings NUMERIC(10,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table comments',
    query: `
      CREATE TABLE IF NOT EXISTS public.comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table likes',
    query: `
      CREATE TABLE IF NOT EXISTS public.likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      );
    `,
  },
  {
    name: 'Table messages',
    query: `
      CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        media_url TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table servers',
    query: `
      CREATE TABLE IF NOT EXISTS public.servers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        icon TEXT,
        owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        members_count INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table channels',
    query: `
      CREATE TABLE IF NOT EXISTS public.channels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('text', 'voice', 'announcement')) DEFAULT 'text',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table subscriptions',
    query: `
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        subscriber_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        plan TEXT CHECK (plan IN ('basic', 'pro', 'vip')) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) DEFAULT 'active',
        stripe_subscription_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table earnings',
    query: `
      CREATE TABLE IF NOT EXISTS public.earnings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        source TEXT CHECK (source IN ('reels', 'subscriptions', 'tips', 'shop')) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        description TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table stories',
    query: `
      CREATE TABLE IF NOT EXISTS public.stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        media_url TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
        views INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Table tips',
    query: `
      CREATE TABLE IF NOT EXISTS public.tips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
        amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0.5),
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: 'RLS — users',
    query: `
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Public profiles" ON public.users FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    `,
  },
  {
    name: 'RLS — posts',
    query: `
      ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Posts are public" ON public.posts FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Users create own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY IF NOT EXISTS "Users update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
      CREATE POLICY IF NOT EXISTS "Users delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
    `,
  },
  {
    name: 'RLS — messages',
    query: `
      ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Messages: sender or receiver" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
      CREATE POLICY IF NOT EXISTS "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
    `,
  },
  {
    name: 'RLS — earnings',
    query: `
      ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Earnings: own only" ON public.earnings FOR SELECT USING (auth.uid() = user_id);
    `,
  },
  {
    name: 'Realtime',
    query: `
      ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
    `,
  },
  {
    name: 'Trigger auto-create user',
    query: `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.users (id, username, full_name, avatar_url)
        VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
          COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
          NEW.raw_user_meta_data->>'avatar_url'
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `,
  },
]

console.log('🚀 Déploiement du schéma NEXUS sur Supabase...\n')

let ok = 0
let fail = 0

for (const step of steps) {
  process.stdout.write(`  ${step.name}... `)
  const success = await sql(step.query)
  if (success) {
    console.log('✅')
    ok++
  } else {
    fail++
  }
}

console.log(`\n${ok === steps.length ? '🎉' : '⚠️'} Terminé : ${ok}/${steps.length} étapes réussies`)
if (fail > 0) console.log(`   ${fail} erreur(s) — les tables existent peut-être déjà, c'est normal.`)
