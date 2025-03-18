'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CampaignFormProps {
  onSuccess?: (campaign: any) => void
  onCancel?: () => void
}

export default function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: [] as string[],
    start_date: '',
    end_date: '',
    budget: '',
    rules: {
      min_followers: 1000,
      required_platforms: ['instagram'] as string[],
      content_requirements: '',
      hashtags: [] as string[],
    },
    requirements: {
      content_type: 'post',
      min_posts: 1,
      use_coupon: true,
    },
  })
  
  const [newObjective, setNewObjective] = useState('')
  const [newHashtag, setNewHashtag] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      const parentObj = formData[parent as keyof typeof formData]
      
      if (parentObj && typeof parentObj === 'object') {
        setFormData({
          ...formData,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      const parentObj = formData[parent as keyof typeof formData]
      
      if (parentObj && typeof parentObj === 'object') {
        setFormData({
          ...formData,
          [parent]: {
            ...parentObj,
            [child]: value === '' ? '' : parseInt(value)
          }
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseFloat(value)
      })
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      const parentObj = formData[parent as keyof typeof formData]
      
      if (parentObj && typeof parentObj === 'object') {
        setFormData({
          ...formData,
          [parent]: {
            ...parentObj,
            [child]: checked
          }
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: checked
      })
    }
  }
  
  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = formData.rules.required_platforms
    
    if (currentPlatforms.includes(platform)) {
      setFormData({
        ...formData,
        rules: {
          ...formData.rules,
          required_platforms: currentPlatforms.filter(p => p !== platform)
        }
      })
    } else {
      setFormData({
        ...formData,
        rules: {
          ...formData.rules,
          required_platforms: [...currentPlatforms, platform]
        }
      })
    }
  }
  
  const addObjective = () => {
    if (newObjective.trim() === '') return
    
    setFormData({
      ...formData,
      objectives: [...formData.objectives, newObjective.trim()]
    })
    
    setNewObjective('')
  }
  
  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    })
  }
  
  const addHashtag = () => {
    if (newHashtag.trim() === '') return
    
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        hashtags: [...formData.rules.hashtags, newHashtag.trim()]
      }
    })
    
    setNewHashtag('')
  }
  
  const removeHashtag = (index: number) => {
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        hashtags: formData.rules.hashtags.filter((_, i) => i !== index)
      }
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Validate form
      if (!formData.title || !formData.description || !formData.start_date || !formData.end_date) {
        setError('Por favor, preencha todos os campos obrigatórios.')
        return
      }
      
      // Format dates to ISO string
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (startDate >= endDate) {
        setError('A data de início deve ser anterior à data de término.')
        return
      }
      
      // Prepare data for API
      const campaignData = {
        ...formData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'draft',
        rules: JSON.stringify(formData.rules),
        requirements: JSON.stringify(formData.requirements),
      }
      
      // Send to API
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar campanha')
      }
      
      // Success
      if (onSuccess) {
        onSuccess(data.campaign)
      } else {
        router.push(`/dashboard/campaigns/${data.campaign.id}`)
      }
      
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro ao criar a campanha. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Nova Campanha</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Campanha *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Ex: Campanha de Verão 2025"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Descreva sua campanha em detalhes..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Data de Início *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input-field mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                Data de Término *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="input-field mt-1"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Orçamento (R$)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleNumberChange}
              className="input-field mt-1"
              placeholder="Ex: 1000"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Objectives */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Objetivos</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="input-field flex-grow"
              placeholder="Adicione um objetivo..."
            />
            <button
              type="button"
              onClick={addObjective}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Adicionar
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.objectives.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhum objetivo adicionado</p>
            ) : (
              <ul className="space-y-2">
                {formData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Rules */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Regras e Requisitos</h3>
          
          <div>
            <label htmlFor="rules.min_followers" className="block text-sm font-medium text-gray-700">
              Mínimo de Seguidores
            </label>
            <input
              type="number"
              id="rules.min_followers"
              name="rules.min_followers"
              value={formData.rules.min_followers}
              onChange={handleNumberChange}
              className="input-field mt-1"
              placeholder="Ex: 1000"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataformas Requeridas
            </label>
            <div className="flex flex-wrap gap-4">
              {['instagram', 'tiktok', 'youtube', 'twitter'].map((platform) => (
                <div key={platform} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${platform}`}
                    checked={formData.rules.required_platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor={`platform-${platform}`} className="ml-2 text-sm text-gray-700 capitalize">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="rules.content_requirements" className="block text-sm font-medium text-gray-700">
              Requisitos de Conteúdo
            </label>
            <textarea
              id="rules.content_requirements"
              name="rules.content_requirements"
              rows={3}
              value={formData.rules.content_requirements}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Descreva os requisitos para o conteúdo..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                className="input-field flex-grow"
                placeholder="Adicione uma hashtag..."
              />
              <button
                type="button"
                onClick={addHashtag}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Adicionar
              </button>
            </div>
            
            <div className="mt-2 space-y-2">
              {formData.rules.hashtags.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhuma hashtag adicionada</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.rules.hashtags.map((hashtag, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm">#{hashtag}</span>
                      <button
                        type="button"
                        onClick={() => removeHashtag(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="requirements.content_type" className="block text-sm font-medium text-gray-700">
              Tipo de Conteúdo
            </label>
            <select
              id="requirements.content_type"
              name="requirements.content_type"
              value={formData.requirements.content_type}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="reels">Reels/TikTok</option>
              <option value="video">Vídeo</option>
              <option value="any">Qualquer</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="requirements.min_posts" className="block text-sm font-medium text-gray-700">
              Mínimo de Publicações
            </label>
            <input
              type="number"
              id="requirements.min_posts"
              name="requirements.min_posts"
              value={formData.requirements.min_posts}
              onChange={handleNumberChange}
              className="input-field mt-1"
              placeholder="Ex: 1"
              min="1"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requirements.use_coupon"
              name="requirements.use_coupon"
              checked={formData.requirements.use_coupon}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="requirements.use_coupon" className="ml-2 text-sm text-gray-700">
              Utilizar cupons de desconto
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Criando...' : 'Criar Campanha'}
          </button>
        </div>
      </form>
    </div>
  )
}
