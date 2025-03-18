import ClientPage from './client-page'

// Componente de servidor que renderiza o componente cliente
export default function CampaignPage({ params }: { params: { id: string } }) {
  return <ClientPage params={params} />
}
