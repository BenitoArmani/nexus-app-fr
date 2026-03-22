'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * /signup?ref=CODE — redirects to /register while preserving the ref query param.
 * This allows referral links of the form /signup?ref=XXXXXXXX to work seamlessly.
 */
function SignupRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    const target = ref ? `/register?ref=${encodeURIComponent(ref)}` : '/register'
    router.replace(target)
  }, [router, ref])

  return null
}

export default function SignupRedirectPageWrapper() { return <Suspense><SignupRedirectPage /></Suspense> }
