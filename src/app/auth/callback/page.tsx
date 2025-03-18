'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const userType = searchParams.get('user_type')
      
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code for session:', error)
            router.push('/auth/login?error=auth_callback_error')
            return
          }
          
          // If this is a new user from OAuth, create their profile
          if (data.user && data.user.app_metadata.provider && !data.user.app_metadata.profile_created) {
            // Determine user type - either from URL param or default to 'creator'
            const type = userType || 'creator'
            
            if (type === 'brand') {
              const { error: profileError } = await supabase
                .from('brands')
                .insert([
                  {
                    id: data.user.id,
                    name: data.user.user_metadata.full_name || data.user.email?.split('@')[0],
                    email: data.user.email,
                  },
                ])
              
              if (profileError) {
                console.error('Error creating brand profile:', profileError)
              }
            } else {
              const { error: profileError } = await supabase
                .from('creators')
                .insert([
                  {
                    id: data.user.id,
                    name: data.user.user_metadata.full_name || data.user.email?.split('@')[0],
                    email: data.user.email,
                  },
                ])
              
              if (profileError) {
                console.error('Error creating creator profile:', profileError)
              }
            }
            
            // Mark profile as created
            await supabase.auth.updateUser({
              data: { profile_created: true, user_type: type }
            })
            
            // Redirect to onboarding
            router.push(`/auth/onboarding?type=${type}`)
          } else {
            // Existing user, redirect to dashboard
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Unexpected error during auth callback:', error)
          router.push('/auth/login?error=unexpected_error')
        }
      } else {
        // No code found in URL
        router.push('/auth/login?error=no_code_error')
      }
    }
    
    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processando seu login...</h2>
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Você será redirecionado em instantes.</p>
      </div>
    </div>
  )
}
