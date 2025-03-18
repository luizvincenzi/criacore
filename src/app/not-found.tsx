'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar se o caminho corresponde a uma rota dinâmica conhecida
    if (pathname?.startsWith('/dashboard/campaigns/')) {
      const id = pathname.split('/').pop()
      if (id) {
        // Redirecionar para a página de campanhas se for uma rota dinâmica
        router.push(`/dashboard/campaigns`)
      }
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-6">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
