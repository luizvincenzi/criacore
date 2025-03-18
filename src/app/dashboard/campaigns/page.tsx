'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/lib/supabase/provider'
import CampaignCard from '@/components/campaigns/CampaignCard'

export default function CampaignsPage() {
  const router = useRouter()
  const { user } = useSupabase()
  const [userType, setUserType] = useState<'brand' | 'creator' | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    const fetchUserType = async () => {
      try {
        // Get user type from metadata
        const type = user.user_metadata?.user_type as 'brand' | 'creator' || null
        setUserType(type)
        
        // Fetch campaigns based on user type
        fetchCampaigns(type, 1)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Erro ao carregar dados do usuário')
        setLoading(false)
      }
    }
    
    fetchUserType()
  }, [user, router])
  
  const fetchCampaigns = async (type: 'brand' | 'creator' | null, page: number, status: string | null = null) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '9')
      if (status) {
        params.append('status', status)
      }
      
      // Fetch campaigns from API
      const response = await fetch(`/api/campaigns?${params.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar campanhas')
      }
      
      setCampaigns(data.campaigns || [])
      setTotalPages(data.pagination?.pages || 1)
      setCurrentPage(page)
    } catch (error: any) {
      console.error('Error fetching campaigns:', error)
      setError(error.message || 'Erro ao carregar campanhas')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePageChange = (page: number) => {
    fetchCampaigns(userType, page, statusFilter)
  }
  
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status)
    fetchCampaigns(userType, 1, status)
  }
  
  const handleJoinCampaign = async (campaignId: string) => {
    try {
      const response = await fetch('/api/participations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao participar da campanha')
      }
      
      // Refresh campaigns to update UI
      fetchCampaigns(userType, currentPage, statusFilter)
    } catch (error: any) {
      console.error('Error joining campaign:', error)
      alert(error.message || 'Erro ao participar da campanha')
    }
  }
  
  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {userType === 'brand' ? 'Minhas Campanhas' : 'Oportunidades'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {userType === 'brand'
              ? 'Gerencie suas campanhas de marketing com influenciadores'
              : 'Encontre oportunidades para colaborar com marcas'}
          </p>
        </div>
        
        {userType === 'brand' && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/dashboard/campaigns/new"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Nova Campanha
            </Link>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilterChange(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusFilter === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleStatusFilterChange('active')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusFilter === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => handleStatusFilterChange('draft')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusFilter === 'draft'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Rascunhos
          </button>
          <button
            onClick={() => handleStatusFilterChange('completed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusFilter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Concluídas
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {campaigns.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter
              ? `Nenhuma campanha ${
                  statusFilter === 'active'
                    ? 'ativa'
                    : statusFilter === 'draft'
                    ? 'em rascunho'
                    : 'concluída'
                } encontrada`
              : 'Nenhuma campanha encontrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {userType === 'brand'
              ? 'Comece criando sua primeira campanha para conectar-se com influenciadores'
              : 'Não há oportunidades disponíveis no momento. Volte mais tarde!'}
          </p>
          
          {userType === 'brand' && (
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Criar Campanha
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                userType={userType || 'creator'}
                onJoin={userType === 'creator' ? handleJoinCampaign : undefined}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Próxima</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}
