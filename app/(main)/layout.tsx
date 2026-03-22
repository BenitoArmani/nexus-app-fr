import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import DonationBanner from '@/components/ui/DonationBanner'
import NexusBanner from '@/components/ui/NexusBanner'
import Promethee from '@/components/ui/Promethee'
import PageTransition from '@/components/ui/PageTransition'
import BubbleBar from '@/components/bubbles/BubbleBar'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import AuthGuard from '@/components/auth/AuthGuard'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-primary">
        <NexusBanner />
        <Topbar />
        <DonationBanner />
        <Sidebar />
        <BubbleBar />
        {/* pb-36 on mobile: 64px BottomNav + ~60px BubbleBar */}
        <main className="pt-14 md:pt-0 md:pl-16 lg:pl-[240px] md:pr-[58px] pb-36 md:pb-0 min-h-screen">
          <ErrorBoundary>
            <PageTransition>
              {children}
            </PageTransition>
          </ErrorBoundary>
        </main>
        <BottomNav />
        <Promethee />
      </div>
    </AuthGuard>
  )
}
