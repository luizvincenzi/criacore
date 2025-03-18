'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/lib/supabase/provider'

interface CampaignDetailProps {
  params: {
    id: string
  }
}

export default function ClientPage({ params }: CampaignDetailProps) {
  const router = useRouter()
  const { user } = useSupabase()
  const [userType, setUserType] = useState<'brand' | 'creator' | null>(null)
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [participating, setParticipating] = useState(false)
  const [participation, setParticipation] = useState<any>(null)
  const [joining, setJoining] = useState(false)
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    const fetchUserType = async () => {
      try {
        // Get user type from metadata
        const userType = user.user_metadata?.user_type as 'brand' | 'creator' || null
        setUserType(userType)
        
        // Fetch campaign details
        fetchCampaignDetails(userType)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Erro ao carregar dados do usuário')
        setLoading(false)
      }
    }
    
    fetchUserType()
  }, [user, router, params.id])
  
  const fetchCampaignDetails = async (type: 'brand' | 'creator' | null) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch campaign from API
      const response = await fetch(`/api/campaigns/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar campanha')
      }
      
      setCampaign(data.campaign)
      
      // Check if user is participating (for creators)
      if (type === 'creator' && data.campaign.participations) {
        const userParticipation = data.campaign.participations.find(
          (p: any) => p.creator_id === user?.id
        )
        
        if (userParticipation) {
          setParticipating(true)
          setParticipation(userParticipation)
        }
      }
    } catch (error: any) {
      console.error('Error fetching campaign details:', error)
      setError(error.message || 'Erro ao carregar detalhes da campanha')
    } finally {
      setLoading(false)
    }
  }
  
  const handleJoinCampaign = async () => {
    try {
      setJoining(true)
      setError(null)
      
      const response = await fetch('/api/participations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: params.id,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao participar da campanha')
      }
      
      // Update state
      setParticipating(true)
      setParticipation(data.participation)
      
      // Refresh campaign details
      fetchCampaignDetails(userType)
    } catch (error: any) {
      console.error('Error joining campaign:', error)
      setError(error.message || 'Erro ao participar da campanha')
    } finally {
      setJoining(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'draft':
        return 'Rascunho'
      case 'completed':
        return 'Concluída'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (error || !campaign) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error || 'Campanha não encontrada'}</p>
            <div className="mt-4">
              <Link
                href="/dashboard/campaigns"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Voltar para campanhas
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Parse JSON fields if they are stored as strings
  const rules = typeof campaign.rules === 'string' ? JSON.parse(campaign.rules) : campaign.rules
  const requirements = typeof campaign.requirements === 'string' ? JSON.parse(campaign.requirements) : campaign.requirements
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mr-3">
              {campaign.title}
            </h2>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
              {getStatusText(campaign.status)}
            </span>
          </div>
          
          {userType === 'creator' && campaign.brands && (
            <p className="mt-1 text-sm text-gray-500">
              {campaign.brands.name}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {userType === 'brand' && campaign.status === 'draft' && (
            <>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/campaigns/${params.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/campaigns/${params.id}/publish`, {
                      method: 'POST',
                    })
                    
                    if (!response.ok) {
                      const data = await response.json()
                      throw new Error(data.error || 'Erro ao publicar campanha')
                    }
                    
                    // Refresh campaign details
                    fetchCampaignDetails(userType)
                  } catch (error: any) {
                    alert(error.message || 'Erro ao publicar campanha')
                  }
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Publicar
              </button>
            </>
          )}
          
          {userType === 'creator' && campaign.status === 'active' && !participating && (
            <button
              type="button"
              onClick={handleJoinCampaign}
              disabled={joining}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {joining ? 'Participando...' : 'Participar da Campanha'}
            </button>
          )}
          
          {userType === 'creator' && participating && (
            <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-primary-light bg-opacity-20">
              Você está participando
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detalhes da Campanha
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Informações e requisitos da campanha
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Descrição
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {campaign.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Período
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(campaign.start_date)} até {formatDate(campaign.end_date)}
              </dd>
            </div>
            {campaign.budget && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Orçamento
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  R$ {parseFloat(campaign.budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </dd>
              </div>
            )}
            {campaign.objectives && campaign.objectives.length > 0 && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Objetivos
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {campaign.objectives.map((objective: string, index: number) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">
                            {objective}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Regras e Requisitos
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {rules && (
              <>
                {rules.min_followers && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Mínimo de Seguidores
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {rules.min_followers.toLocaleString()}
                    </dd>
                  </div>
                )}
                
                {rules.required_platforms && rules.required_platforms.length > 0 && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Plataformas Requeridas
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {rules.required_platforms.map((platform: string) => (
                          <span key={platform} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                
                {rules.content_requirements && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Requisitos de Conteúdo
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {rules.content_requirements}
                    </dd>
                  </div>
                )}
                
                {rules.hashtags && rules.hashtags.length > 0 && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Hashtags
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {rules.hashtags.map((hashtag: string) => (
                          <span key={hashtag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            #{hashtag}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </>
            )}
            
            {requirements && (
              <>
                {requirements.content_type && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Tipo de Conteúdo
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                      {requirements.content_type === 'any' ? 'Qualquer' : requirements.content_type}
                    </dd>
                  </div>
                )}
                
                {requirements.min_posts && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Mínimo de Publicações
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {requirements.min_posts}
                    </dd>
                  </div>
                )}
                
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Cupons de Desconto
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {requirements.use_coupon ? 'Sim' : 'Não'}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
      
      {userType === 'creator' && participating && participation && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sua Participação
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    participation.status === 'active' ? 'bg-green-100 text-green-800' :
                    participation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {participation.status === 'active' ? 'Ativa' :
                     participation.status === 'pending' ? 'Pendente' :
                     participation.status}
                  </span>
                </dd>
              </div>
              
              {participation.coupon_code && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Seu Código de Cupom
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{participation.coupon_code}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(participation.coupon_code)
                          alert('Código copiado para a área de transferência!')
                        }}
                        className="ml-2 text-primary hover:text-primary-dark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Compartilhe este código com seus seguidores para que eles possam utilizá-lo na marca.
                    </p>
                  </dd>
                </div>
              )}
              
              {participation.earnings > 0 && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Ganhos
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    R$ {parseFloat(participation.earnings).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
      
      {userType === 'brand' && campaign.participations && campaign.participations.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Participantes
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criadores de conteúdo participando desta campanha
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {campaign.participations.map((participation: any) => (
                <li key={participation.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {participation.creators?.profile_pic_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={participation.creators.profile_pic_url}
                            alt={participation.creators.name}
                          />
                        ) : (
                          <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {participation.creators?.name || 'Criador'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Participando desde {formatDate(participation.joined_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        participation.status === 'active' ? 'bg-green-100 text-green-800' :
                        participation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {participation.status === 'active' ? 'Ativo' :
                         participation.status === 'pending' ? 'Pendente' :
                         participation.status}
                      </span>
                      
                      {participation.coupon_code && (
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{participation.coupon_code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
