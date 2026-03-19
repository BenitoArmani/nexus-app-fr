const PROJECT_REF = 'dnbqtrisnhqbljnblpcl'
const TOKEN = 'sbp_f2df18abef632baf00c480345491282f73559d53'

const queries = [
  `CREATE TABLE IF NOT EXISTS public.betting_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    total_pool INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('open', 'closed', 'resolved')) DEFAULT 'open',
    winner_option TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS public.nexus_coins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    balance INTEGER DEFAULT 1000,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    virtual_cash NUMERIC(10,2) DEFAULT 10000,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS public.game_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    game TEXT NOT NULL,
    title TEXT NOT NULL,
    clip_url TEXT,
    thumbnail_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    type TEXT CHECK (type IN ('clip', 'stream')) DEFAULT 'clip',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    instructor_id UUID REFERENCES public.users(id),
    category TEXT NOT NULL,
    level TEXT CHECK (level IN ('débutant', 'intermédiaire', 'avancé')),
    duration_hours INTEGER DEFAULT 1,
    students INTEGER DEFAULT 0,
    rating NUMERIC(2,1) DEFAULT 5.0,
    price NUMERIC(10,2) DEFAULT 0,
    thumbnail TEXT,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
]

async function runQuery(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  console.log(`Status: ${res.status}`, text.slice(0, 200))
  return res.ok
}

for (const q of queries) {
  const tableName = q.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/)?.[1]
  console.log(`\nCreating table: ${tableName}`)
  await runQuery(q)
}

console.log('\nDone!')
