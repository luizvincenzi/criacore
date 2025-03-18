'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useSupabase } from '@/lib/supabase/provider'

// Client component that uses useSearchParams
function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useSupabase()
  const [userType, setUserType] = useState<'brand' | 'creator'>(
    (searchParams.get('type') as 'brand' | 'creator') || 'brand'
  )
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Brand specific state
  const [brandCategory, setBrandCategory] = useState('')
  const [brandDescription, setBrandDescription] = useState('')
  const [brandWebsite, setBrandWebsite] = useState('')
  
  // Creator specific state
  const [creatorBio, setCreatorBio] = useState('')
  const [creatorCategories, setCreatorCategories] = useState<string[]>([])
  const [creatorSocialLinks, setCreatorSocialLinks] = useState({
    instagram: '',
    tiktok: '',
    youtube: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleCategoryToggle = (category: string) => {
    if (creatorCategories.includes(category)) {
      setCreatorCategories(creatorCategories.filter(c => c !== category))
    } else {
      setCreatorCategories([...creatorCategories, category])
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      if (userType === 'brand') {
        // Update brand profile
        const { error: updateError } = await supabase
          .from('brands')
          .update({
            category: brandCategory,
            description: brandDescription,
            website: brandWebsite,
            onboarding_completed: true,
          })
          .eq('id', user?.id)
        
        if (updateError) throw updateError
      } else {
        // Update creator profile
        const { error: updateError } = await supabase
          .from('creators')
          .update({
            bio: creatorBio,
            content_categories: creatorCategories,
            social_links: creatorSocialLinks,
            onboarding_completed: true,
          })
          .eq('id', user?.id)
        
        if (updateError) throw updateError
      }
      
      // Redirect to dashboard
      router.push('/dashboard')
      
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro ao salvar seu perfil')
    } finally {
      setLoading(false)
    }
  }

  const renderBrandOnboarding = () => {
    return (
      <>
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Informações básicas</h3>
            
            <div>
              <label htmlFor="brandCategory" className="block text-sm font-medium text-gray-700">
                Categoria do negócio
              </label>
              <div className="mt-1">
                <select
                  id="brandCategory"
                  name="brandCategory"
                  value={brandCategory}
                  onChange={(e) => setBrandCategory(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="cafe">Café</option>
                  <option value="bar">Bar</option>
                  <option value="retail">Varejo</option>
                  <option value="service">Serviços</option>
                  <option value="beauty">Beleza e Estética</option>
                  <option value="fitness">Fitness e Saúde</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700">
                Descrição do seu negócio
              </label>
              <div className="mt-1">
                <textarea
                  id="brandDescription"
                  name="brandDescription"
                  rows={4}
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  className="input-field"
                  placeholder="Descreva seu negócio, produtos ou serviços..."
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Presença online</h3>
            
            <div>
              <label htmlFor="brandWebsite" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1">
                <input
                  id="brandWebsite"
                  name="brandWebsite"
                  type="url"
                  value={brandWebsite}
                  onChange={(e) => setBrandWebsite(e.target.value)}
                  className="input-field"
                  placeholder="https://www.seusite.com.br"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Opcional, mas recomendado</p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="text-gray-600 hover:text-gray-900"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Salvando...' : 'Concluir'}
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  const renderCreatorOnboarding = () => {
    return (
      <>
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Seu perfil</h3>
            
            <div>
              <label htmlFor="creatorBio" className="block text-sm font-medium text-gray-700">
                Biografia
              </label>
              <div className="mt-1">
                <textarea
                  id="creatorBio"
                  name="creatorBio"
                  rows={4}
                  value={creatorBio}
                  onChange={(e) => setCreatorBio(e.target.value)}
                  className="input-field"
                  placeholder="Conte um pouco sobre você e seu conteúdo..."
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias de conteúdo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Gastronomia',
                  'Moda',
                  'Beleza',
                  'Fitness',
                  'Viagem',
                  'Lifestyle',
                  'Tecnologia',
                  'Jogos',
                  'Educação',
                  'Finanças',
                ].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={creatorCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Redes sociais</h3>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">@</span>
                </div>
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  value={creatorSocialLinks.instagram}
                  onChange={(e) => setCreatorSocialLinks({...creatorSocialLinks, instagram: e.target.value})}
                  className="input-field pl-7"
                  placeholder="seu_perfil"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">
                TikTok
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">@</span>
                </div>
                <input
                  type="text"
                  name="tiktok"
                  id="tiktok"
                  value={creatorSocialLinks.tiktok}
                  onChange={(e) => setCreatorSocialLinks({...creatorSocialLinks, tiktok: e.target.value})}
                  className="input-field pl-7"
                  placeholder="seu_perfil"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                YouTube
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="youtube"
                  id="youtube"
                  value={creatorSocialLinks.youtube}
                  onChange={(e) => setCreatorSocialLinks({...creatorSocialLinks, youtube: e.target.value})}
                  className="input-field"
                  placeholder="https://youtube.com/c/seucanal"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="text-gray-600 hover:text-gray-900"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Salvando...' : 'Concluir'}
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-text">
            Vamos configurar seu perfil
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {userType === 'brand'
              ? 'Conte-nos mais sobre sua marca para conectá-la com os criadores certos.'
              : 'Conte-nos mais sobre você para conectá-lo com as marcas certas.'}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {userType === 'brand' ? renderBrandOnboarding() : renderCreatorOnboarding()}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback
function OnboardingFallback() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Carregando...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Onboarding() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingContent />
    </Suspense>
  );
}
