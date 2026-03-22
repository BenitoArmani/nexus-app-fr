import { Post, Reel, User, Story, Conversation, Earning, Server, Channel, BettingQuestion, StockQuote, PortfolioHolding, GamePost, Tournament, LFGPost, Course, QuizQuestion } from '@/types'

export const MOCK_USERS: User[] = [
  { id: '1',  username: 'sophia_create',  full_name: 'Sophia Martin',      avatar_url: 'https://i.pravatar.cc/150?img=47', bio: 'Créatrice de contenu | Lifestyle & Mode 💜',          is_verified: true,  is_creator: true,  monthly_goal: 500,  followers_count: 84200,  following_count: 312, created_at: '2024-01-15T10:00:00Z' },
  { id: '2',  username: 'alex_tech',      full_name: 'Alexandre Dubois',   avatar_url: 'https://i.pravatar.cc/150?img=12', bio: 'Dev & Tech Creator | Next.js · Rust · IA',           is_verified: true,  is_creator: true,  monthly_goal: 800,  followers_count: 120500, following_count: 145, created_at: '2023-11-20T10:00:00Z' },
  { id: '3',  username: 'nora_music',     full_name: 'Nora Benali',        avatar_url: 'https://i.pravatar.cc/150?img=32', bio: '🎵 Artiste Indépendante | Soul & RnB',               is_verified: true,  is_creator: true,  monthly_goal: 600,  followers_count: 56800,  following_count: 890, created_at: '2024-03-01T10:00:00Z' },
  { id: '4',  username: 'lucas_photo',    full_name: 'Lucas Petit',        avatar_url: 'https://i.pravatar.cc/150?img=15', bio: '📸 Photographe | Nature · Portrait · Voyage',        is_verified: false, is_creator: true,  monthly_goal: 300,  followers_count: 12400,  following_count: 567, created_at: '2024-06-10T10:00:00Z' },
  { id: '5',  username: 'chloe_cook',     full_name: 'Chloé Bernard',      avatar_url: 'https://i.pravatar.cc/150?img=44', bio: '🍳 Chef Passionnée | Recettes & Astuces du quotidien', is_verified: false, is_creator: false, monthly_goal: 200,  followers_count: 8900,   following_count: 234, created_at: '2024-08-05T10:00:00Z' },
  { id: '6',  username: 'karim_trader',   full_name: 'Karim Mansour',      avatar_url: 'https://i.pravatar.cc/150?img=8',  bio: '📈 Trader PRO | Crypto & Futures | 7 ans d\'expérience', is_verified: true,  is_creator: true,  monthly_goal: 2000, followers_count: 231000, following_count: 89,  created_at: '2023-06-01T10:00:00Z' },
  { id: '7',  username: 'jade_gaming',    full_name: 'Jade Leroux',        avatar_url: 'https://i.pravatar.cc/150?img=29', bio: '🎮 Streameuse Valorant & LoL | Diamond I',           is_verified: true,  is_creator: true,  monthly_goal: 1200, followers_count: 189000, following_count: 421, created_at: '2023-09-12T10:00:00Z' },
  { id: '8',  username: 'thomas_invest',  full_name: 'Thomas Renard',      avatar_url: 'https://i.pravatar.cc/150?img=18', bio: '💰 Finance | DCA · ETF · Immobilier | Indépendance financière', is_verified: false, is_creator: true, monthly_goal: 1500, followers_count: 78400,  following_count: 203, created_at: '2024-01-10T10:00:00Z' },
  { id: '9',  username: 'marie_journal',  full_name: 'Marie Fontaine',     avatar_url: 'https://i.pravatar.cc/150?img=41', bio: '📰 Journaliste · Politique & Tech | Le Monde',       is_verified: true,  is_creator: false, monthly_goal: 400,  followers_count: 45200,  following_count: 1240, created_at: '2024-02-28T10:00:00Z' },
  { id: '10', username: 'enzo_fitness',   full_name: 'Enzo Marchand',      avatar_url: 'https://i.pravatar.cc/150?img=51', bio: '💪 Coach Fitness | Calisthenics · Nutrition',        is_verified: false, is_creator: true,  monthly_goal: 700,  followers_count: 34800,  following_count: 512, created_at: '2024-04-15T10:00:00Z' },
  { id: '11', username: 'lea_vlog',       full_name: 'Léa Dumont',         avatar_url: 'https://i.pravatar.cc/150?img=25', bio: '✈️ Travel & Lifestyle | 42 pays en 3 ans',           is_verified: true,  is_creator: true,  monthly_goal: 900,  followers_count: 267000, following_count: 832, created_at: '2023-07-20T10:00:00Z' },
  { id: '12', username: 'rayan_crypto',   full_name: 'Rayan Khalil',       avatar_url: 'https://i.pravatar.cc/150?img=6',  bio: '₿ Crypto Analyst | On-chain · DeFi · Web3',          is_verified: false, is_creator: true,  monthly_goal: 1800, followers_count: 156000, following_count: 67,  created_at: '2023-10-05T10:00:00Z' },
  { id: '13', username: 'camille_art',    full_name: 'Camille Rousseau',   avatar_url: 'https://i.pravatar.cc/150?img=36', bio: '🎨 Artiste Digital | Illustration · NFT · Animation', is_verified: false, is_creator: true,  monthly_goal: 400,  followers_count: 22100,  following_count: 389, created_at: '2024-05-08T10:00:00Z' },
  { id: '14', username: 'hugo_dev',       full_name: 'Hugo Vallet',        avatar_url: 'https://i.pravatar.cc/150?img=20', bio: '⚡ Indie Hacker | SaaS Builder | Revenus passifs',   is_verified: false, is_creator: true,  monthly_goal: 3000, followers_count: 89300,  following_count: 156, created_at: '2023-12-01T10:00:00Z' },
  { id: '15', username: 'priya_edutech',  full_name: 'Priya Sharma',       avatar_url: 'https://i.pravatar.cc/150?img=38', bio: '🎓 Enseignante & EduTech | Maths · IA pour tous',    is_verified: true,  is_creator: true,  monthly_goal: 600,  followers_count: 41600,  following_count: 278, created_at: '2024-03-18T10:00:00Z' },
]

export const MOCK_CURRENT_USER: User = {
  id: '0',
  username: 'moi_creator',
  full_name: 'Moi (Demo)',
  avatar_url: 'https://i.pravatar.cc/150?img=68',
  bio: '✨ Créateur NEXUS | Explorez mes contenus',
  is_verified: true,
  is_creator: true,
  monthly_goal: 500,
  followers_count: 3420,
  following_count: 186,
  created_at: '2025-01-01T00:00:00Z',
}

export const MOCK_STORIES: Story[] = [
  { id: 's1',  user_id: '6',  media_type: 'image', media_url: 'https://picsum.photos/seed/story-karim/400/711',  expires_at: new Date(Date.now() + 3600000 * 20).toISOString(), views: 12400, created_at: new Date(Date.now() - 3600000 * 1).toISOString(),  user: MOCK_USERS[5]  },
  { id: 's2',  user_id: '11', media_type: 'image', media_url: 'https://picsum.photos/seed/story-lea/400/711',    expires_at: new Date(Date.now() + 3600000 * 22).toISOString(), views: 8900,  created_at: new Date(Date.now() - 3600000 * 2).toISOString(),  user: MOCK_USERS[10] },
  { id: 's3',  user_id: '7',  media_type: 'image', media_url: 'https://picsum.photos/seed/story-jade/400/711',   expires_at: new Date(Date.now() + 3600000 * 18).toISOString(), views: 21000, created_at: new Date(Date.now() - 3600000 * 0.5).toISOString(), user: MOCK_USERS[6]  },
  { id: 's4',  user_id: '3',  media_type: 'image', media_url: 'https://picsum.photos/seed/story-nora/400/711',   expires_at: new Date(Date.now() + 3600000 * 15).toISOString(), views: 5600,  created_at: new Date(Date.now() - 3600000 * 4).toISOString(),  user: MOCK_USERS[2]  },
  { id: 's5',  user_id: '14', media_type: 'image', media_url: 'https://picsum.photos/seed/story-hugo/400/711',   expires_at: new Date(Date.now() + 3600000 * 12).toISOString(), views: 4300,  created_at: new Date(Date.now() - 3600000 * 6).toISOString(),  user: MOCK_USERS[13] },
  { id: 's6',  user_id: '1',  media_type: 'image', media_url: 'https://picsum.photos/seed/story-sophia/400/711', expires_at: new Date(Date.now() + 3600000 * 10).toISOString(), views: 3200,  created_at: new Date(Date.now() - 3600000 * 8).toISOString(),  user: MOCK_USERS[0]  },
  { id: 's7',  user_id: '12', media_type: 'image', media_url: 'https://picsum.photos/seed/story-rayan/400/711',  expires_at: new Date(Date.now() + 3600000 * 8).toISOString(),  views: 6700,  created_at: new Date(Date.now() - 3600000 * 3).toISOString(),  user: MOCK_USERS[11] },
  { id: 's8',  user_id: '4',  media_type: 'image', media_url: 'https://picsum.photos/seed/story-lucas/400/711',  expires_at: new Date(Date.now() + 3600000 * 5).toISOString(),  views: 1800,  created_at: new Date(Date.now() - 3600000 * 12).toISOString(), user: MOCK_USERS[3]  },
]

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', user_id: '1',
    content: '✨ Nouvelle collection capsule disponible ! Chaque pièce est conçue avec des matières durables et éthiques. Vraiment fier de ce travail — 6 mois de développement. Qu\'est-ce que vous en pensez ? 💜 #Mode #Durable #Style',
    media_url: 'https://picsum.photos/seed/fashion1/800/600', media_type: 'image',
    likes_count: 1842, comments_count: 94, views: 12400, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), user: MOCK_USERS[0], liked_by_me: false,
  },
  {
    id: 'p2', user_id: '2',
    content: '🚀 J\'ai reconstruit mon setup dev from scratch. Voici ce que j\'ai appris après 6 mois :\n\n1. Un bon moniteur > une bonne chaise\n2. Le silence > la musique pour coder\n3. 2 terminaux > 1 IDE\n\nThread complet 🧵👇 #Dev #Setup',
    media_url: null, media_type: null,
    likes_count: 3210, comments_count: 187, views: 28900, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(), user: MOCK_USERS[1], liked_by_me: true,
  },
  {
    id: 'p3', user_id: '3',
    content: '🎵 Mon nouveau single "Lumière" sort vendredi à minuit. Voici un extrait exclusif. Je l\'ai composé à 3h du matin après une journée difficile — parfois la douleur crée les meilleures choses 🌙',
    media_url: 'https://picsum.photos/seed/music1/800/450', media_type: 'image',
    likes_count: 5680, comments_count: 321, views: 45200, is_premium: true,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(), user: MOCK_USERS[2], liked_by_me: false,
  },
  {
    id: 'p4', user_id: '4',
    content: 'Lever du soleil à 5h du matin au Mont-Blanc. Certains sacrifices valent vraiment la peine. Canon R5 · 24mm · f/1.4 · ISO 400 📸',
    media_url: 'https://picsum.photos/seed/nature1/800/600', media_type: 'image',
    likes_count: 892, comments_count: 43, views: 6700, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), user: MOCK_USERS[3], liked_by_me: false,
  },
  {
    id: 'p5', user_id: '5',
    content: '🍝 Carbonara AUTHENTIQUE — le vrai secret que les Italiens ne te diront pas :\n\nPas de crème fraîche. Jamais.\nLa technique pour émulsionner les œufs sans les brouiller = retirer la casserole du feu 30s avant.\n\nRecette complète en commentaire 👇 #Food #Cuisine',
    media_url: 'https://picsum.photos/seed/food1/800/600', media_type: 'image',
    likes_count: 4120, comments_count: 218, views: 31500, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(), user: MOCK_USERS[4], liked_by_me: true,
  },
  {
    id: 'p6', user_id: '6',
    content: '📈 Bitcoin vient de casser la résistance à 97k$. Ce que ça signifie techniquement :\n\n→ RSI pas encore en surachat\n→ Volume en hausse de 40%\n→ Prochaine résistance : 102k$\n\nMon analyse complète sur le dashboard → #Crypto #BTC #Trading',
    media_url: 'https://picsum.photos/seed/chart1/800/500', media_type: 'image',
    likes_count: 8420, comments_count: 512, views: 89400, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(), user: MOCK_USERS[5], liked_by_me: false,
  },
  {
    id: 'p7', user_id: '7',
    content: '🎮 ACE en Ranked Immortal avec Jett — clutch 1v5 en ranked. Ma main depuis 3 ans. Le son du dernier headshot 😭🔥\n\n#Valorant #FPS #Gaming #Streameuse',
    media_url: 'https://picsum.photos/seed/gaming1/800/500', media_type: 'image',
    likes_count: 12300, comments_count: 890, views: 156000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(), user: MOCK_USERS[6], liked_by_me: true,
  },
  {
    id: 'p8', user_id: '8',
    content: '💰 À 28 ans j\'ai atteint l\'indépendance financière. Voici les 4 règles que j\'ai suivies :\n\n1. Investir 40% de mes revenus dès le 1er salaire\n2. DCA sur ETF World tous les mois sans exception\n3. Jamais toucher le capital\n4. Lire 1 livre de finance par mois\n\nLe reste : patience. #Finance #FIRE #ETF',
    media_url: null, media_type: null,
    likes_count: 15680, comments_count: 1240, views: 234000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(), user: MOCK_USERS[7], liked_by_me: false,
  },
  {
    id: 'p9', user_id: '9',
    content: '📰 EXCLUSIF : J\'ai passé 3 semaines dans la Silicon Valley à interviewer des fondateurs de licornes. Ce que personne ne dit sur l\'écosystème tech français par rapport aux USA — thread 🧵\n\nSpoiler : ce n\'est pas une question d\'argent. #Tech #Journalisme #Startup',
    media_url: 'https://picsum.photos/seed/city1/800/500', media_type: 'image',
    likes_count: 3280, comments_count: 421, views: 67000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 9).toISOString(), user: MOCK_USERS[8], liked_by_me: false,
  },
  {
    id: 'p10', user_id: '10',
    content: '💪 Transformation 6 mois — same person, same diet, same time in the gym. La seule différence : la méthode. J\'ai arrêté de faire des isolations et j\'ai tout misé sur les 4 mouvements de force. Résultats en image 👇 #Fitness #Calisthenics',
    media_url: 'https://picsum.photos/seed/fitness1/800/600', media_type: 'image',
    likes_count: 6740, comments_count: 380, views: 98200, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(), user: MOCK_USERS[9], liked_by_me: true,
  },
  {
    id: 'p11', user_id: '11',
    content: '✈️ 72h à Tokyo seule avec un sac à dos de 7kg. Ce que j\'ai mangé, où j\'ai dormi, combien j\'ai dépensé. La ville la plus safe que j\'ai visitée en 3 ans de voyage solo 🇯🇵\n\nGuide complet en stories ! #Travel #Japan #SoloTravel',
    media_url: 'https://picsum.photos/seed/tokyo1/800/600', media_type: 'image',
    likes_count: 22400, comments_count: 1890, views: 389000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(), user: MOCK_USERS[10], liked_by_me: false,
  },
  {
    id: 'p12', user_id: '12',
    content: '₿ Ethereum accumulation zone identifiée. Support historique à 3200$, on est dessus depuis 48h.\n\nPositions long pour les swing traders :\n→ Entry : 3200-3250\n→ Target 1 : 3800\n→ Target 2 : 4200\n→ SL : 2950\n\nNFA DYOR 🔮 #ETH #Crypto #DeFi',
    media_url: 'https://picsum.photos/seed/chart2/800/500', media_type: 'image',
    likes_count: 9120, comments_count: 672, views: 145000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), user: MOCK_USERS[11], liked_by_me: false,
  },
  {
    id: 'p13', user_id: '13',
    content: '🎨 Process time-lapse de mon dernier piece — 40h de travail condensé en 60 secondes. Tout à la tablette Wacom, Procreate & Photoshop. C\'est le personnage pour ma série "Nébuleuse" 🌌\n\n#DigitalArt #Illustration #NFT',
    media_url: 'https://picsum.photos/seed/art1/800/800', media_type: 'image',
    likes_count: 7830, comments_count: 294, views: 112000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(), user: MOCK_USERS[12], liked_by_me: true,
  },
  {
    id: 'p14', user_id: '14',
    content: '⚡ Mon SaaS vient de dépasser 5k€ MRR. Sans lever de fonds, sans équipe, depuis mon appart.\n\nStack : Next.js + Supabase + Stripe + Resend\nAcquisition : uniquement Twitter + SEO\nTemps de dev : 3 mois à temps partiel\n\nAMA 👇 #IndieHacker #SaaS #Bootstrapped',
    media_url: null, media_type: null,
    likes_count: 19200, comments_count: 2140, views: 312000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 7).toISOString(), user: MOCK_USERS[13], liked_by_me: false,
  },
  {
    id: 'p15', user_id: '15',
    content: '🎓 J\'ai enseigné les maths à 3000 élèves en ligne cette année. Ce que j\'ai appris sur comment les gens apprennent vraiment :\n\nLes exemples concrets > les théorèmes abstraits\nLa fréquence > la durée des sessions\nL\'erreur > la perfection\n\n#Éducation #Maths #EdTech',
    media_url: 'https://picsum.photos/seed/edu1/800/500', media_type: 'image',
    likes_count: 4560, comments_count: 312, views: 78000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(), user: MOCK_USERS[14], liked_by_me: false,
  },
  {
    id: 'p16', user_id: '1',
    content: '🔞 Contenu exclusif — réservé aux abonnés adultes. Ce post est marqué explicite par le créateur.',
    media_url: 'https://picsum.photos/seed/explicit1/800/600', media_type: 'image',
    likes_count: 982, comments_count: 47, views: 8400, is_premium: false, is_explicit: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), user: MOCK_USERS[0], liked_by_me: false,
  },
  {
    id: 'p17', user_id: '6',
    content: '🔴 LIVE TRADING dans 15 minutes. Ce soir on analyse ETH/BTC en temps réel et je répondrai à toutes vos questions sur la gestion du risque. Rejoignez le live → /live/karim_trader 🚀',
    media_url: null, media_type: null,
    likes_count: 2840, comments_count: 198, views: 41000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString(), user: MOCK_USERS[5], liked_by_me: false,
  },
  {
    id: 'p18', user_id: '7',
    content: '🎮 Je lance mon serveur NEXUS officiel "GG Gaming" — rejoins-nous pour les scrims, tournois internes et sessions coaching. Lien en bio ! 🔗\n\n#Valorant #LoL #GamingCommunity',
    media_url: 'https://picsum.photos/seed/gaming2/800/500', media_type: 'image',
    likes_count: 5670, comments_count: 431, views: 82000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 11).toISOString(), user: MOCK_USERS[6], liked_by_me: true,
  },
  {
    id: 'p19', user_id: '11',
    content: '✈️ Bali vs Thaïlande pour le digital nomad en 2026. J\'ai vécu 2 mois dans chaque. Mon verdict honnête sans filtre — coût de la vie, wifi, communauté, sécurité 🌴\n\n#DigitalNomad #Remote #Travel',
    media_url: 'https://picsum.photos/seed/bali1/800/600', media_type: 'image',
    likes_count: 18700, comments_count: 2340, views: 412000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(), user: MOCK_USERS[10], liked_by_me: false,
  },
  {
    id: 'p20', user_id: '2',
    content: '⚡ Claude Sonnet 4.6 vient de sortir et j\'ai passé 48h à le tester sur des tâches réelles de dev. Verdict :\n\n→ Code quality : 9/10\n→ Refactoring complexe : meilleur que GPT-4\n→ Context window : game changer\n→ Prix : pas encore compétitif\n\n#AI #Dev #LLM',
    media_url: null, media_type: null,
    likes_count: 11400, comments_count: 890, views: 189000, is_premium: false,
    created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(), user: MOCK_USERS[1], liked_by_me: false,
  },
]

export const MOCK_REELS: Reel[] = [
  { id: 'r1', user_id: '1', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail_url: 'https://picsum.photos/seed/reel1/400/711', caption: '✨ Morning routine qui a changé ma vie #wellness #routine', views: 284000, likes: 18400, earnings: 142.00, created_at: new Date(Date.now() - 86400000).toISOString(), user: MOCK_USERS[0], liked_by_me: false },
  { id: 'r2', user_id: '2', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail_url: 'https://picsum.photos/seed/reel2/400/711', caption: '🤖 J\'ai créé une IA qui génère du code parfait en 10 secondes #tech #ai', views: 1200000, likes: 89000, earnings: 600.00, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), user: MOCK_USERS[1], liked_by_me: true },
  { id: 'r3', user_id: '3', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail_url: 'https://picsum.photos/seed/reel3/400/711', caption: '🎵 Session acoustique spontanée dans mon salon #music #live', views: 560000, likes: 42000, earnings: 280.00, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), user: MOCK_USERS[2], liked_by_me: false },
  { id: 'r4', user_id: '4', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail_url: 'https://picsum.photos/seed/reel4/400/711', caption: '🌅 Timelapse lever de soleil — 3h en 30 secondes #photo #nature', views: 98000, likes: 7200, earnings: 49.00, created_at: new Date(Date.now() - 86400000 * 4).toISOString(), user: MOCK_USERS[3], liked_by_me: false },
]

export const MOCK_CONVERSATIONS: Conversation[] = [
  { user: MOCK_USERS[0], last_message: { id: 'm1', sender_id: '1', receiver_id: '0', content: 'Merci pour ton support ! 💜', media_url: null, read: false, created_at: new Date(Date.now() - 600000).toISOString() }, unread_count: 2 },
  { user: MOCK_USERS[1], last_message: { id: 'm2', sender_id: '0', receiver_id: '2', content: 'Super tuto, ça m\'a bien aidé', media_url: null, read: true, created_at: new Date(Date.now() - 3600000).toISOString() }, unread_count: 0 },
  { user: MOCK_USERS[2], last_message: { id: 'm3', sender_id: '3', receiver_id: '0', content: 'Mon nouveau single 🎵', media_url: null, read: false, created_at: new Date(Date.now() - 7200000).toISOString() }, unread_count: 1 },
  { user: MOCK_USERS[3], last_message: { id: 'm4', sender_id: '4', receiver_id: '0', content: 'Check ma dernière photo !', media_url: null, read: true, created_at: new Date(Date.now() - 86400000).toISOString() }, unread_count: 0 },
]

export const MOCK_EARNINGS: Earning[] = [
  { id: 'e1', user_id: '0', source: 'reels', amount: 127.50, description: 'Gains reels — semaine du 10 mars', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'e2', user_id: '0', source: 'subscriptions', amount: 84.93, description: '17 abonnés actifs', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'e3', user_id: '0', source: 'tips', amount: 35.00, description: 'Tips reçus ce mois', created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: 'e4', user_id: '0', source: 'shop', amount: 45.00, description: 'Ventes boutique', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'e5', user_id: '0', source: 'reels', amount: 98.20, description: 'Gains reels — semaine précédente', created_at: new Date(Date.now() - 86400000 * 9).toISOString() },
]

export const MOCK_SERVERS: Server[] = [
  { id: 'srv1', name: 'NEXUS Official', icon: '🚀', owner_id: '0', members_count: 12400, created_at: '2024-01-01T00:00:00Z' },
  { id: 'srv2', name: 'Créateurs FR', icon: '🎨', owner_id: '1', members_count: 8900, created_at: '2024-02-15T00:00:00Z' },
  { id: 'srv3', name: 'Tech & Code', icon: '💻', owner_id: '2', members_count: 24500, created_at: '2024-03-01T00:00:00Z' },
  { id: 'srv4', name: 'Music Lounge', icon: '🎵', owner_id: '3', members_count: 5600, created_at: '2024-04-10T00:00:00Z' },
  { id: 'srv5', name: 'Photo Art', icon: '📸', owner_id: '4', members_count: 3200, created_at: '2024-05-20T00:00:00Z' },
]

export const MOCK_CHANNELS: Channel[] = [
  { id: 'ch1', server_id: 'srv1', name: 'général', type: 'text', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ch2', server_id: 'srv1', name: 'annonces', type: 'announcement', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ch3', server_id: 'srv1', name: 'tips-astuces', type: 'text', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ch4', server_id: 'srv1', name: 'lounge-vocal', type: 'voice', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ch5', server_id: 'srv1', name: 'créateurs', type: 'text', created_at: '2024-01-01T00:00:00Z' },
]

export const MOCK_MONTHLY_EARNINGS = [
  { month: 'Oct', amount: 210 },
  { month: 'Nov', amount: 285 },
  { month: 'Déc', amount: 320 },
  { month: 'Jan', amount: 180 },
  { month: 'Fév', amount: 390 },
  { month: 'Mar', amount: 292.43 },
]

export const MOCK_BETTING: BettingQuestion[] = [
  { id: 'b1', creator_id: '1', question: 'Qui va gagner la Ligue des Champions 2025 ?', options: [{ id: 'o1', label: 'Real Madrid', odds: 2.1, total_bets: 4500 }, { id: 'o2', label: 'PSG', odds: 3.5, total_bets: 2100 }, { id: 'o3', label: 'Man City', odds: 4.0, total_bets: 1800 }, { id: 'o4', label: 'Bayern Munich', odds: 5.0, total_bets: 900 }], total_pool: 9300, status: 'open', expires_at: new Date(Date.now() + 86400000 * 3).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString(), creator: MOCK_USERS[0] },
  { id: 'b2', creator_id: '2', question: 'Bitcoin dépassera 150k$ avant fin 2025 ?', options: [{ id: 'o5', label: 'Oui 🚀', odds: 1.8, total_bets: 8200 }, { id: 'o6', label: 'Non 📉', odds: 2.2, total_bets: 6100 }], total_pool: 14300, status: 'open', expires_at: new Date(Date.now() + 86400000 * 30).toISOString(), created_at: new Date(Date.now() - 7200000).toISOString(), creator: MOCK_USERS[1] },
  { id: 'b3', creator_id: '3', question: 'Prochain single de Nora : combien de streams en 24h ?', options: [{ id: 'o7', label: 'Moins de 100k', odds: 4.0, total_bets: 500 }, { id: 'o8', label: '100k - 500k', odds: 2.5, total_bets: 1200 }, { id: 'o9', label: 'Plus de 500k', odds: 1.6, total_bets: 3400 }], total_pool: 5100, status: 'open', expires_at: new Date(Date.now() + 86400000 * 7).toISOString(), created_at: new Date(Date.now() - 1800000).toISOString(), creator: MOCK_USERS[2] },
]

export const MOCK_STOCKS: StockQuote[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 213.49, change: 2.34, changePercent: 1.11, volume: 52400000, type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 18.20, changePercent: 2.12, volume: 38900000, type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms', price: 584.20, change: -5.80, changePercent: -0.98, volume: 15600000, type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -8.30, changePercent: -3.23, volume: 89700000, type: 'stock' },
  { symbol: 'BTC', name: 'Bitcoin', price: 97420, change: 1250, changePercent: 1.30, volume: 0, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3842, change: -42, changePercent: -1.08, volume: 0, type: 'crypto' },
  { symbol: 'SOL', name: 'Solana', price: 189.40, change: 8.20, changePercent: 4.52, volume: 0, type: 'crypto' },
  { symbol: 'BNB', name: 'Binance Coin', price: 612.30, change: 3.10, changePercent: 0.51, volume: 0, type: 'crypto' },
]

export const MOCK_PORTFOLIO: PortfolioHolding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgBuyPrice: 185.00, currentPrice: 213.49, type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 2, avgBuyPrice: 650.00, currentPrice: 875.40, type: 'stock' },
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.15, avgBuyPrice: 62000, currentPrice: 97420, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', quantity: 2.5, avgBuyPrice: 2800, currentPrice: 3842, type: 'crypto' },
]

export const MOCK_GAME_POSTS: GamePost[] = [
  { id: 'g1', user_id: '1', game: 'Valorant', title: 'ACE en ranked diamond 💥', thumbnail_url: 'https://picsum.photos/seed/game1/400/225', views: 284000, likes: 18400, type: 'clip', created_at: new Date(Date.now() - 3600000).toISOString(), user: MOCK_USERS[0] },
  { id: 'g2', user_id: '2', game: 'League of Legends', title: 'Pentakill Yasuo en Master 🔥', thumbnail_url: 'https://picsum.photos/seed/game2/400/225', views: 560000, likes: 42000, type: 'clip', created_at: new Date(Date.now() - 7200000).toISOString(), user: MOCK_USERS[1] },
  { id: 'g3', user_id: '3', game: 'Minecraft', title: 'Construction folle en 1 heure ⛏️', thumbnail_url: 'https://picsum.photos/seed/game3/400/225', views: 128000, likes: 9800, type: 'stream', created_at: new Date(Date.now() - 86400000).toISOString(), user: MOCK_USERS[2] },
  { id: 'g4', user_id: '4', game: 'CS2', title: 'Clutch 1v5 en finale de tournoi', thumbnail_url: 'https://picsum.photos/seed/game4/400/225', views: 390000, likes: 31000, type: 'clip', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), user: MOCK_USERS[3] },
]

export const MOCK_TOURNAMENTS: Tournament[] = [
  { id: 't1', game: 'Valorant', name: 'NEXUS Cup Valorant', prize_pool: 5000, participants: 48, max_participants: 64, status: 'live', starts_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 't2', game: 'League of Legends', name: "Summoner's Rift Battle", prize_pool: 2500, participants: 32, max_participants: 32, status: 'upcoming', starts_at: new Date(Date.now() + 86400000 * 2).toISOString() },
  { id: 't3', game: 'FIFA 25', name: 'E-Sport Championship FR', prize_pool: 1000, participants: 18, max_participants: 32, status: 'upcoming', starts_at: new Date(Date.now() + 86400000 * 5).toISOString() },
]

export const MOCK_LFG: LFGPost[] = [
  { id: 'lfg1', user_id: '1', game: 'Valorant', rank: 'Diamond 2', looking_for: 'Duo/Trio ranked', language: 'Français', created_at: new Date(Date.now() - 1800000).toISOString(), user: MOCK_USERS[0] },
  { id: 'lfg2', user_id: '2', game: 'League of Legends', rank: 'Master', looking_for: 'Support main pour duo', language: 'Français', created_at: new Date(Date.now() - 3600000).toISOString(), user: MOCK_USERS[1] },
  { id: 'lfg3', user_id: '3', game: 'CS2', rank: 'Global Elite', looking_for: 'Team compétitive', language: 'Français/Anglais', created_at: new Date(Date.now() - 7200000).toISOString(), user: MOCK_USERS[2] },
]

export const MOCK_COURSES: Course[] = [
  { id: 'c1', title: 'Python pour débutants — De zéro à héros', instructor: 'Alexandre Dubois', instructor_avatar: 'https://i.pravatar.cc/150?img=12', category: 'Programmation', level: 'débutant', duration_hours: 12, students: 8420, rating: 4.8, price: 0, thumbnail: 'https://picsum.photos/seed/course1/400/225', is_free: true },
  { id: 'c2', title: 'Marketing Digital & Réseaux Sociaux 2025', instructor: 'Sophia Martin', instructor_avatar: 'https://i.pravatar.cc/150?img=47', category: 'Marketing', level: 'intermédiaire', duration_hours: 8, students: 3200, rating: 4.9, price: 29.99, thumbnail: 'https://picsum.photos/seed/course2/400/225', is_free: false },
  { id: 'c3', title: 'Photographie Portrait — Maîtrisez la lumière', instructor: 'Lucas Petit', instructor_avatar: 'https://i.pravatar.cc/150?img=15', category: 'Photographie', level: 'intermédiaire', duration_hours: 6, students: 1840, rating: 4.7, price: 19.99, thumbnail: 'https://picsum.photos/seed/course3/400/225', is_free: false },
  { id: 'c4', title: 'Guitare Acoustique — Premier pas', instructor: 'Nora Benali', instructor_avatar: 'https://i.pravatar.cc/150?img=32', category: 'Musique', level: 'débutant', duration_hours: 5, students: 5600, rating: 4.6, price: 0, thumbnail: 'https://picsum.photos/seed/course4/400/225', is_free: true },
  { id: 'c5', title: 'Finance Personnelle & Investissement', instructor: 'Alexandre Dubois', instructor_avatar: 'https://i.pravatar.cc/150?img=12', category: 'Finance', level: 'débutant', duration_hours: 10, students: 12000, rating: 4.9, price: 49.99, thumbnail: 'https://picsum.photos/seed/course5/400/225', is_free: false },
  { id: 'c6', title: 'React & Next.js — Devenir Fullstack', instructor: 'Alexandre Dubois', instructor_avatar: 'https://i.pravatar.cc/150?img=12', category: 'Programmation', level: 'avancé', duration_hours: 20, students: 6800, rating: 4.8, price: 79.99, thumbnail: 'https://picsum.photos/seed/course6/400/225', is_free: false },
]

export const MOCK_QUIZ: QuizQuestion[] = [
  { id: 'q1', question: 'Quel est le résultat de 2 ** 10 en Python ?', options: ['512', '1024', '2048', '256'], correct: 1, explanation: '2 élevé à la puissance 10 = 1024' },
  { id: 'q2', question: "CSS: quelle propriété contrôle l'espacement interne ?", options: ['margin', 'padding', 'spacing', 'gap'], correct: 1, explanation: "padding contrôle l'espace entre le contenu et la bordure" },
  { id: 'q3', question: 'En finance, ROI signifie ?', options: ['Rate Of Interest', 'Return On Investment', 'Risk Of Inflation', 'Revenue Over Income'], correct: 1, explanation: 'ROI = Return On Investment, mesure la rentabilité' },
]

export const MOCK_GLYPHS_BALANCE = 2500

export const MOCK_GLYPH_TRANSACTIONS = [
  { id: 't1', amount: 1100, event: 'Achat — Pack 550G', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 't2', amount: -200, event: 'Pari — Ligue des Champions', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 't3', amount: 100, event: 'Bonus inscription', created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 't4', amount: -50, event: 'Tip → @nora_music', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 't5', amount: 10, event: 'Pub regardée', created_at: new Date(Date.now() - 3600000).toISOString() },
]

export const MOCK_WATCH_PARTIES = [
  { id: 'wp1', title: 'Morning Routine de Sophia', hostUsername: 'sophia_create', viewers: 7 },
  { id: 'wp2', title: 'Tech Setup 2025', hostUsername: 'alex_tech', viewers: 4 },
]
