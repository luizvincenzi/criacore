'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Campaign {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
  budget?: number
  brands?: {
    name: string
    logo_url?: string
  }
  participations?: {
    id: string
    status: string
    creator_id: string
  }[]
}

interface CampaignCardProps {
  campaign: Campaign
  userType: 'brand' | 'creator'
  onJoin?: (campaignId: string) => void
}

export default function CampaignCard({ campaign, userType, onJoin }: CampaignCardProps) {
  const [joining, setJoining] = useState(false)
  
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
  
  const isParticipating = () => {
    if (!campaign.participations || campaign.participations.length === 0) {
      return false
    }
    
    return campaign.participations.some(p => p.status !== 'rejected')
  }
  
  const handleJoin = async () => {
    if (!onJoin) return
    
    try {
      setJoining(true)
      await onJoin(campaign.id)
    } catch (error) {
      console.error('Erro ao participar da campanha:', error)
    } finally {
      setJoining(false)
    }
  }
  
  const getDaysRemaining = () => {
    const endDate = new Date(campaign.end_date)
    const today = new Date()
    
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }
  
  const daysRemaining = getDaysRemaining()
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {campaign.title}
            </h3>
            {userType === 'creator' && campaign.brands && (
              <p className="text-sm text-gray-500">
                {campaign.brands.name}
              </p>
            )}
          </div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
            {getStatusText(campaign.status)}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-500">
              {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
            </span>
          </div>
          
          {daysRemaining > 0 && campaign.status === 'active' && (
            <span className="text-primary font-medium">
              {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} restantes
            </span>
          )}
        </div>
        
        {campaign.budget && userType === 'creator' && (
          <div className="mt-2 flex items-center text-sm">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-500">
              Orçamento: R$ {campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
        <Link
          href={`/dashboard/${userType === 'brand' ? 'campaigns' : 'opportunities'}/${campaign.id}`}
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          Ver detalhes
        </Link>
        
        {userType === 'creator' && campaign.status === 'active' && !isParticipating() && (
          <button
            type="button"
            onClick={handleJoin}
            disabled={joining}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {joining ? 'Participando...' : 'Participar'}
          </button>
        )}
        
        {userType === 'creator' && isParticipating() && (
          <span className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary-light bg-opacity-20">
            Participando
          </span>
        )}
      </div>
    </div>
  )
}
