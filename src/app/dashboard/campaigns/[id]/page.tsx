import { supabase } from '@/lib/supabase/client'
import ClientPage from './client-page'

// Esta função é necessária para exportação estática com Next.js
export async function generateStaticParams() {
  // Buscar todos os IDs de campanhas do Supabase
  const { data } = await supabase
    .from('campaigns')
    .select('id')
  
  // Retornar um array de objetos com o parâmetro id
  return (data || []).map((campaign) => ({
    id: campaign.id.toString(),
  }))
}

// Componente de servidor que renderiza o componente cliente
export default function CampaignPage({ params }: { params: { id: string } }) {
  return <ClientPage params={params} />
}
