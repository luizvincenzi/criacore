import { supabase } from '@/lib/supabase/client'

// Esta função é necessária para exportação estática com Next.js
export async function generateStaticParams() {
  // Buscar todos os IDs de campanhas do Supabase
  const { data } = await supabase
    .from('campaigns')
    .select('id')
  
  // Retornar um array de objetos com o parâmetro id
  return (data || []).map((campaign: { id: any }) => ({
    id: campaign.id.toString(),
  }))
}

export default function CampaignLayout({
  children,
}: {
  children: any
}) {
  return <>{children}</>
}
