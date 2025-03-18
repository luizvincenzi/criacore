'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/supabase/provider'
import CampaignForm from '@/components/campaigns/CampaignForm'

export default function NewCampaignPage() {
  const router = useRouter()
  const { user } = useSupabase()
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Check if user is a brand
    const checkUserType = async () => {
      try {
        // Get user type from metadata
        const userType = user.user_metadata?.user_type
        
        if (userType !== 'brand') {
          // Redirect to dashboard if not a brand
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking user type:', error)
        router.push('/dashboard')
      }
    }
    
    checkUserType()
  }, [user, router])
  
  const handleSuccess = (campaign: any) => {
    router.push(`/dashboard/campaigns/${campaign.id}`)
  }
  
  const handleCancel = () => {
    router.push('/dashboard/campaigns')
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nova Campanha
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Crie uma nova campanha para conectar-se com influenciadores
          </p>
        </div>
      </div>
      
      <CampaignForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
