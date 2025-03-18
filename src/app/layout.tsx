import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/lib/supabase/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CriaCore - Plataforma de Marketing com Influenciadores',
  description: 'Conecte sua marca a criadores de conteúdo para campanhas de marketing baseadas em desempenho',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
